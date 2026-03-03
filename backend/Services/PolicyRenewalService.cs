using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PolicyRenewalService : IPolicyRenewalService
{
    private readonly InsuranceDbContext _context;
    private readonly INotificationService _notificationService;

    public PolicyRenewalService(InsuranceDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<PolicyRenewalDto?> CreateRenewalRequestAsync(int userId, CreatePolicyRenewalDto dto)
    {
        // Get policy
        var policy = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme)
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found");

        // Check ownership
        if (policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this policy");

        // Check if policy is active
        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Only active policies can be renewed");

        // Check if policy is near maturity (within 3 months)
        var today = DateOnly.FromDateTime(DateTime.Today);
        var threeMonthsBefore = policy.MaturityDate.AddMonths(-3);
        if (today < threeMonthsBefore)
            throw new InvalidOperationException($"Policy can only be renewed within 3 months of maturity date. Renewal will be available from {threeMonthsBefore:dd/MM/yyyy}");

        // Check if there's already a pending renewal
        var existingRenewal = await _context.Set<PolicyRenewal>()
            .FirstOrDefaultAsync(r => r.PolicyId == dto.PolicyId && r.RenewalStatus == "Pending");

        if (existingRenewal != null)
            throw new InvalidOperationException("A renewal request is already pending for this policy");

        // Calculate new premium
        var calculation = await CalculateRenewalAsync(dto.PolicyId, dto.RenewalTermYears);
        if (calculation == null)
            throw new InvalidOperationException("Failed to calculate renewal premium");

        // Create renewal record
        var renewal = new PolicyRenewal
        {
            PolicyId = dto.PolicyId,
            UserId = userId,
            RenewalDate = today,
            PreviousMaturityDate = policy.MaturityDate,
            NewMaturityDate = policy.MaturityDate.AddYears(dto.RenewalTermYears),
            PreviousPremium = policy.PremiumAmount,
            NewPremium = calculation.ProposedPremium,
            RenewalTermYears = dto.RenewalTermYears,
            RenewalStatus = "Pending",
            RenewalNotes = dto.RenewalNotes,
            RequestedAt = DateTime.UtcNow
        };

        _context.Set<PolicyRenewal>().Add(renewal);
        await _context.SaveChangesAsync();

        // Send notification
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            UserId = userId,
            Title = "Policy Renewal Request Submitted",
            Message = $"Your renewal request for policy {policy.PolicyNumber} has been submitted for review.",
            NotificationType = "PolicyRenewal",
            RelatedEntityId = renewal.RenewalId,
            RelatedEntityType = "PolicyRenewal",
            SendEmail = true
        });

        return await GetRenewalByIdAsync(renewal.RenewalId);
    }

    public async Task<RenewalCalculationDto?> CalculateRenewalAsync(int policyId, int renewalTermYears)
    {
        var policy = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme)
            .FirstOrDefaultAsync(p => p.PolicyId == policyId);

        if (policy == null)
            return null;

        var today = DateOnly.FromDateTime(DateTime.Today);
        var currentAge = CalculateAge(policy.User.DateOfBirth, today);
        var ageAtRenewal = CalculateAge(policy.User.DateOfBirth, policy.MaturityDate);

        // Premium increase factors
        decimal ageFactor = 1.0m;
        string ageFactorMessage = "";

        // Age-based premium increase
        if (ageAtRenewal >= 60)
        {
            ageFactor = 1.30m; // 30% increase for age 60+
            ageFactorMessage = "Premium increased by 30% due to age factor (60+ years)";
        }
        else if (ageAtRenewal >= 50)
        {
            ageFactor = 1.20m; // 20% increase for age 50-59
            ageFactorMessage = "Premium increased by 20% due to age factor (50-59 years)";
        }
        else if (ageAtRenewal >= 40)
        {
            ageFactor = 1.10m; // 10% increase for age 40-49
            ageFactorMessage = "Premium increased by 10% due to age factor (40-49 years)";
        }
        else
        {
            ageFactor = 1.05m; // 5% standard increase
            ageFactorMessage = "Standard 5% premium increase applied";
        }

        // Calculate new premium
        var proposedPremium = policy.PremiumAmount * ageFactor;
        var premiumIncrease = proposedPremium - policy.PremiumAmount;
        var increasePercentage = (premiumIncrease / policy.PremiumAmount) * 100;

        return new RenewalCalculationDto
        {
            PolicyId = policyId,
            PolicyNumber = policy.PolicyNumber,
            CurrentMaturityDate = policy.MaturityDate,
            ProposedMaturityDate = policy.MaturityDate.AddYears(renewalTermYears),
            CurrentPremium = policy.PremiumAmount,
            ProposedPremium = Math.Round(proposedPremium, 2),
            PremiumIncrease = Math.Round(premiumIncrease, 2),
            PremiumIncreasePercentage = Math.Round(increasePercentage, 2),
            CurrentAge = currentAge,
            ProposedTermYears = renewalTermYears,
            AgeFactorMessage = ageFactorMessage
        };
    }

    public async Task<PolicyRenewalDto?> GetRenewalByIdAsync(int renewalId)
    {
        var renewal = await _context.Set<PolicyRenewal>()
            .Include(r => r.Policy)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.RenewalId == renewalId);

        if (renewal == null)
            return null;

        User? processedByUser = null;
        if (renewal.ProcessedBy.HasValue)
        {
            processedByUser = await _context.Users.FindAsync(renewal.ProcessedBy.Value);
        }

        return new PolicyRenewalDto
        {
            RenewalId = renewal.RenewalId,
            PolicyId = renewal.PolicyId,
            PolicyNumber = renewal.Policy.PolicyNumber,
            UserId = renewal.UserId,
            UserName = renewal.User.FullName,
            RenewalDate = renewal.RenewalDate,
            PreviousMaturityDate = renewal.PreviousMaturityDate,
            NewMaturityDate = renewal.NewMaturityDate,
            PreviousPremium = renewal.PreviousPremium,
            NewPremium = renewal.NewPremium,
            RenewalTermYears = renewal.RenewalTermYears,
            RenewalStatus = renewal.RenewalStatus,
            RenewalNotes = renewal.RenewalNotes,
            RequestedAt = renewal.RequestedAt,
            ProcessedAt = renewal.ProcessedAt,
            ProcessedBy = renewal.ProcessedBy,
            ProcessedByName = processedByUser?.FullName
        };
    }

    public async Task<List<PolicyRenewalDto>> GetUserRenewalsAsync(int userId)
    {
        var renewals = await _context.Set<PolicyRenewal>()
            .Include(r => r.Policy)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RequestedAt)
            .ToListAsync();

        var result = new List<PolicyRenewalDto>();
        foreach (var renewal in renewals)
        {
            User? processedByUser = null;
            if (renewal.ProcessedBy.HasValue)
            {
                processedByUser = await _context.Users.FindAsync(renewal.ProcessedBy.Value);
            }

            result.Add(new PolicyRenewalDto
            {
                RenewalId = renewal.RenewalId,
                PolicyId = renewal.PolicyId,
                PolicyNumber = renewal.Policy.PolicyNumber,
                UserId = renewal.UserId,
                UserName = renewal.User.FullName,
                RenewalDate = renewal.RenewalDate,
                PreviousMaturityDate = renewal.PreviousMaturityDate,
                NewMaturityDate = renewal.NewMaturityDate,
                PreviousPremium = renewal.PreviousPremium,
                NewPremium = renewal.NewPremium,
                RenewalTermYears = renewal.RenewalTermYears,
                RenewalStatus = renewal.RenewalStatus,
                RenewalNotes = renewal.RenewalNotes,
                RequestedAt = renewal.RequestedAt,
                ProcessedAt = renewal.ProcessedAt,
                ProcessedBy = renewal.ProcessedBy,
                ProcessedByName = processedByUser?.FullName
            });
        }

        return result;
    }

    public async Task<List<PolicyRenewalDto>> GetPendingRenewalsAsync()
    {
        var renewals = await _context.Set<PolicyRenewal>()
            .Include(r => r.Policy)
            .Include(r => r.User)
            .Where(r => r.RenewalStatus == "Pending")
            .OrderBy(r => r.RequestedAt)
            .ToListAsync();

        return renewals.Select(r => new PolicyRenewalDto
        {
            RenewalId = r.RenewalId,
            PolicyId = r.PolicyId,
            PolicyNumber = r.Policy.PolicyNumber,
            UserId = r.UserId,
            UserName = r.User.FullName,
            RenewalDate = r.RenewalDate,
            PreviousMaturityDate = r.PreviousMaturityDate,
            NewMaturityDate = r.NewMaturityDate,
            PreviousPremium = r.PreviousPremium,
            NewPremium = r.NewPremium,
            RenewalTermYears = r.RenewalTermYears,
            RenewalStatus = r.RenewalStatus,
            RenewalNotes = r.RenewalNotes,
            RequestedAt = r.RequestedAt,
            ProcessedAt = r.ProcessedAt,
            ProcessedBy = r.ProcessedBy
        }).ToList();
    }

    public async Task<PolicyRenewalDto?> ProcessRenewalAsync(int renewalId, int processedBy, ProcessRenewalDto dto)
    {
        var renewal = await _context.Set<PolicyRenewal>()
            .Include(r => r.Policy)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.RenewalId == renewalId);

        if (renewal == null)
            throw new InvalidOperationException("Renewal request not found");

        if (renewal.RenewalStatus != "Pending")
            throw new InvalidOperationException("Only pending renewals can be processed");

        if (dto.Action.ToLower() == "approve")
        {
            // Update renewal status
            renewal.RenewalStatus = "Approved";
            renewal.ProcessedAt = DateTime.UtcNow;
            renewal.ProcessedBy = processedBy;
            if (!string.IsNullOrEmpty(dto.AdminNotes))
                renewal.RenewalNotes = (renewal.RenewalNotes ?? "") + "\nAdmin: " + dto.AdminNotes;

            // Update policy
            renewal.Policy.MaturityDate = renewal.NewMaturityDate;
            renewal.Policy.PremiumAmount = renewal.NewPremium;
            renewal.Policy.TermYears += renewal.RenewalTermYears;

            // Send approval notification
            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = renewal.UserId,
                Title = "Policy Renewal Approved",
                Message = $"Your policy {renewal.Policy.PolicyNumber} has been successfully renewed until {renewal.NewMaturityDate:dd/MM/yyyy}.",
                NotificationType = "PolicyRenewal",
                RelatedEntityId = renewalId,
                RelatedEntityType = "PolicyRenewal",
                SendEmail = true
            });
        }
        else if (dto.Action.ToLower() == "reject")
        {
            renewal.RenewalStatus = "Rejected";
            renewal.ProcessedAt = DateTime.UtcNow;
            renewal.ProcessedBy = processedBy;
            if (!string.IsNullOrEmpty(dto.AdminNotes))
                renewal.RenewalNotes = (renewal.RenewalNotes ?? "") + "\nAdmin: " + dto.AdminNotes;

            // Send rejection notification
            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = renewal.UserId,
                Title = "Policy Renewal Rejected",
                Message = $"Your renewal request for policy {renewal.Policy.PolicyNumber} has been rejected. Please contact support for details.",
                NotificationType = "PolicyRenewal",
                RelatedEntityId = renewalId,
                RelatedEntityType = "PolicyRenewal",
                SendEmail = true
            });
        }
        else
        {
            throw new InvalidOperationException("Invalid action. Use 'Approve' or 'Reject'");
        }

        await _context.SaveChangesAsync();

        return await GetRenewalByIdAsync(renewalId);
    }

    private int CalculateAge(DateOnly dateOfBirth, DateOnly asOfDate)
    {
        var age = asOfDate.Year - dateOfBirth.Year;
        if (asOfDate.Month < dateOfBirth.Month || (asOfDate.Month == dateOfBirth.Month && asOfDate.Day < dateOfBirth.Day))
            age--;
        return age;
    }
}
