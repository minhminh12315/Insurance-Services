using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PolicySurrenderService : IPolicySurrenderService
{
    private readonly InsuranceDbContext _context;
    private readonly INotificationService _notificationService;

    public PolicySurrenderService(InsuranceDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<SurrenderCalculationDto?> CalculateSurrenderValueAsync(int policyId)
    {
        var policy = await _context.Policies
            .Include(p => p.PremiumPayments.Where(pp => pp.Status == "Completed" || pp.Status == "Success"))
            .FirstOrDefaultAsync(p => p.PolicyId == policyId);

        if (policy == null)
            return null;

        var today = DateOnly.FromDateTime(DateTime.Today);
        var policyHeldYears = today.Year - policy.StartDate.Year;
        var policyHeldMonths = (today.Year - policy.StartDate.Year) * 12 + (today.Month - policy.StartDate.Month);

        // Calculate total premium paid
        var totalPremiumPaid = policy.PremiumPayments.Sum(p => p.AmountPaid);

        // Surrender value calculation based on policy duration
        decimal surrenderPercentage;
        decimal chargePercentage;
        string surrenderPolicy;
        var notes = new List<string>();

        if (policyHeldYears < 1)
        {
            surrenderPercentage = 0m;
            chargePercentage = 100m;
            surrenderPolicy = "No surrender value for policies held less than 1 year";
            notes.Add("Policies surrendered within the first year receive no surrender value.");
        }
        else if (policyHeldYears < 2)
        {
            surrenderPercentage = 30m;
            chargePercentage = 70m;
            surrenderPolicy = "30% of premiums paid (70% surrender charges)";
            notes.Add("High surrender charges apply for early surrender.");
        }
        else if (policyHeldYears < 3)
        {
            surrenderPercentage = 50m;
            chargePercentage = 50m;
            surrenderPolicy = "50% of premiums paid (50% surrender charges)";
            notes.Add("Moderate surrender charges apply.");
        }
        else if (policyHeldYears < 5)
        {
            surrenderPercentage = 70m;
            chargePercentage = 30m;
            surrenderPolicy = "70% of premiums paid (30% surrender charges)";
            notes.Add("Lower surrender charges for policies held 3-5 years.");
        }
        else
        {
            surrenderPercentage = 90m;
            chargePercentage = 10m;
            surrenderPolicy = "90% of premiums paid (10% surrender charges)";
            notes.Add("Minimal surrender charges for mature policies.");
        }

        var surrenderValue = totalPremiumPaid * (surrenderPercentage / 100);
        var surrenderCharges = totalPremiumPaid * (chargePercentage / 100);
        var netPayable = surrenderValue; // Same as surrenderValue since charges are already deducted

        notes.Add("Surrender will terminate all coverage and benefits.");
        notes.Add("Any outstanding loans will be deducted from the surrender value.");
        notes.Add("This is an estimate. Final amount may vary based on policy terms.");

        return new SurrenderCalculationDto
        {
            PolicyId = policyId,
            PolicyNumber = policy.PolicyNumber,
            PolicyStartDate = policy.StartDate,
            PolicyMaturityDate = policy.MaturityDate,
            PolicyHeldYears = policyHeldYears,
            PolicyHeldMonths = policyHeldMonths,
            TotalPremiumPaid = totalPremiumPaid,
            SurrenderValue = Math.Round(surrenderValue, 2),
            SurrenderCharges = Math.Round(surrenderCharges, 2),
            SurrenderChargePercentage = chargePercentage,
            NetPayable = Math.Round(netPayable, 2),
            SurrenderPolicy = surrenderPolicy,
            ImportantNotes = notes
        };
    }

    public async Task<PolicySurrenderDto> CreateSurrenderRequestAsync(int userId, CreatePolicySurrenderDto dto)
    {
        var policy = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.PolicyLoans.Where(l => l.LoanStatus == "Approved" || l.LoanStatus == "Active"))
            .Include(p => p.PremiumPayments.Where(pp => pp.Status == "Completed" || pp.Status == "Success"))
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found");

        if (policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this policy");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Only active policies can be surrendered");

        // Check if there's already a pending surrender
        var existingSurrender = await _context.Set<PolicySurrender>()
            .FirstOrDefaultAsync(s => s.PolicyId == dto.PolicyId && s.SurrenderStatus == "Pending");

        if (existingSurrender != null)
            throw new InvalidOperationException("A surrender request is already pending for this policy");

        // Calculate surrender value
        var calculation = await CalculateSurrenderValueAsync(dto.PolicyId);
        if (calculation == null)
            throw new InvalidOperationException("Failed to calculate surrender value");

        if (calculation.SurrenderValue <= 0)
            throw new InvalidOperationException("Policy does not have surrender value. Minimum 1 year policy duration required.");

        // Deduct outstanding loans
        var outstandingLoans = policy.PolicyLoans.Sum(l => l.LoanAmount);
        var finalNetPayable = calculation.NetPayable - outstandingLoans;

        if (finalNetPayable < 0)
            throw new InvalidOperationException($"Outstanding loan amount (₫{outstandingLoans:N0}) exceeds surrender value. Please repay loans before surrendering.");

        var today = DateOnly.FromDateTime(DateTime.Today);

        var surrender = new PolicySurrender
        {
            PolicyId = dto.PolicyId,
            UserId = userId,
            RequestDate = today,
            TotalPremiumPaid = calculation.TotalPremiumPaid,
            SurrenderValue = calculation.SurrenderValue,
            SurrenderCharges = calculation.SurrenderCharges,
            NetPayable = finalNetPayable,
            PolicyHeldYears = calculation.PolicyHeldYears,
            PolicyHeldMonths = calculation.PolicyHeldMonths,
            SurrenderStatus = "Pending",
            SurrenderReason = dto.SurrenderReason,
            RequestedAt = DateTime.UtcNow,
            PaymentMethod = dto.PreferredPaymentMethod
        };

        _context.Set<PolicySurrender>().Add(surrender);
        await _context.SaveChangesAsync();

        // Send notification
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            UserId = userId,
            Title = "Policy Surrender Request Submitted",
            Message = $"Your surrender request for policy {policy.PolicyNumber} has been submitted for review. Estimated payout: ₫{finalNetPayable:N0}",
            NotificationType = "PolicySurrender",
            RelatedEntityId = surrender.SurrenderId,
            RelatedEntityType = "PolicySurrender",
            SendEmail = true
        });

        return await GetSurrenderByIdAsync(surrender.SurrenderId) 
            ?? throw new InvalidOperationException("Surrender not found");
    }

    public async Task<PolicySurrenderDto?> GetSurrenderByIdAsync(int surrenderId)
    {
        var surrender = await _context.Set<PolicySurrender>()
            .Include(s => s.Policy)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.SurrenderId == surrenderId);

        if (surrender == null)
            return null;

        User? processedByUser = null;
        if (surrender.ProcessedBy.HasValue)
        {
            processedByUser = await _context.Users.FindAsync(surrender.ProcessedBy.Value);
        }

        return new PolicySurrenderDto
        {
            SurrenderId = surrender.SurrenderId,
            PolicyId = surrender.PolicyId,
            PolicyNumber = surrender.Policy.PolicyNumber,
            UserId = surrender.UserId,
            UserName = surrender.User.FullName,
            RequestDate = surrender.RequestDate,
            TotalPremiumPaid = surrender.TotalPremiumPaid,
            SurrenderValue = surrender.SurrenderValue,
            SurrenderCharges = surrender.SurrenderCharges,
            NetPayable = surrender.NetPayable,
            PolicyHeldYears = surrender.PolicyHeldYears,
            PolicyHeldMonths = surrender.PolicyHeldMonths,
            SurrenderStatus = surrender.SurrenderStatus,
            SurrenderReason = surrender.SurrenderReason,
            AdminNotes = surrender.AdminNotes,
            RequestedAt = surrender.RequestedAt,
            ProcessedAt = surrender.ProcessedAt,
            ProcessedBy = surrender.ProcessedBy,
            ProcessedByName = processedByUser?.FullName,
            PaymentMethod = surrender.PaymentMethod,
            PaymentReference = surrender.PaymentReference
        };
    }

    public async Task<List<PolicySurrenderDto>> GetUserSurrendersAsync(int userId)
    {
        var surrenders = await _context.Set<PolicySurrender>()
            .Include(s => s.Policy)
            .Include(s => s.User)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.RequestedAt)
            .ToListAsync();

        var result = new List<PolicySurrenderDto>();
        foreach (var surrender in surrenders)
        {
            var dto = await GetSurrenderByIdAsync(surrender.SurrenderId);
            if (dto != null)
            {
                result.Add(dto);
            }
        }

        return result;
    }

    public async Task<List<PolicySurrenderDto>> GetPendingSurrendersAsync()
    {
        var surrenders = await _context.Set<PolicySurrender>()
            .Include(s => s.Policy)
            .Include(s => s.User)
            .Where(s => s.SurrenderStatus == "Pending")
            .OrderBy(s => s.RequestedAt)
            .ToListAsync();

        var result = new List<PolicySurrenderDto>();
        foreach (var surrender in surrenders)
        {
            var dto = await GetSurrenderByIdAsync(surrender.SurrenderId);
            if (dto != null)
            {
                result.Add(dto);
            }
        }

        return result;
    }

    public async Task<PolicySurrenderDto?> ProcessSurrenderAsync(int surrenderId, int processedBy, ProcessSurrenderDto dto)
    {
        var surrender = await _context.Set<PolicySurrender>()
            .Include(s => s.Policy)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.SurrenderId == surrenderId);

        if (surrender == null)
            throw new InvalidOperationException("Surrender request not found");

        if (surrender.SurrenderStatus != "Pending")
            throw new InvalidOperationException("Only pending surrenders can be processed");

        if (dto.Action.ToLower() == "approve")
        {
            if (string.IsNullOrEmpty(dto.PaymentMethod))
                throw new InvalidOperationException("Payment method is required for approval");

            surrender.SurrenderStatus = "Approved";
            surrender.ProcessedAt = DateTime.UtcNow;
            surrender.ProcessedBy = processedBy;
            surrender.AdminNotes = dto.AdminNotes;
            surrender.PaymentMethod = dto.PaymentMethod;
            surrender.PaymentReference = dto.PaymentReference;

            // Update policy status
            surrender.Policy.PolicyStatus = "Surrendered";

            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = surrender.UserId,
                Title = "Policy Surrender Approved",
                Message = $"Your surrender request for policy {surrender.Policy.PolicyNumber} has been approved. Payment of ₫{surrender.NetPayable:N0} will be processed via {dto.PaymentMethod}.",
                NotificationType = "PolicySurrender",
                RelatedEntityId = surrenderId,
                RelatedEntityType = "PolicySurrender",
                SendEmail = true
            });
        }
        else if (dto.Action.ToLower() == "reject")
        {
            surrender.SurrenderStatus = "Rejected";
            surrender.ProcessedAt = DateTime.UtcNow;
            surrender.ProcessedBy = processedBy;
            surrender.AdminNotes = dto.AdminNotes;

            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = surrender.UserId,
                Title = "Policy Surrender Rejected",
                Message = $"Your surrender request for policy {surrender.Policy.PolicyNumber} has been rejected. Please contact support for details.",
                NotificationType = "PolicySurrender",
                RelatedEntityId = surrenderId,
                RelatedEntityType = "PolicySurrender",
                SendEmail = true
            });
        }
        else
        {
            throw new InvalidOperationException("Invalid action. Use 'Approve' or 'Reject'");
        }

        await _context.SaveChangesAsync();

        return await GetSurrenderByIdAsync(surrenderId);
    }
}
