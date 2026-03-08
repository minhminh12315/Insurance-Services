using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class BeneficiaryService : IBeneficiaryService
{
    private readonly InsuranceDbContext _context;

    public BeneficiaryService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<BeneficiaryDto> CreateBeneficiaryAsync(int userId, CreateBeneficiaryDto dto)
    {
        // Get policy and verify ownership
        var policy = await _context.Policies
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found");

        if (policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this policy");

        // Check if policy is active
        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Beneficiaries can only be added to active policies");

        // Validate total percentage
        var currentTotal = await CalculateTotalPercentageAsync(dto.PolicyId);
        if (currentTotal + dto.BenefitPercentage > 100)
            throw new InvalidOperationException($"Total benefit percentage cannot exceed 100%. Current total: {currentTotal}%, Attempting to add: {dto.BenefitPercentage}%");

        // Validate age (beneficiary should be born)
        var today = DateOnly.FromDateTime(DateTime.Today);
        if (dto.DateOfBirth >= today)
            throw new InvalidOperationException("Beneficiary date of birth must be in the past");

        var beneficiary = new PolicyBeneficiary
        {
            PolicyId = dto.PolicyId,
            BeneficiaryName = dto.BeneficiaryName,
            Relationship = dto.Relationship,
            DateOfBirth = dto.DateOfBirth,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            BenefitPercentage = dto.BenefitPercentage,
            IsPrimary = dto.IsPrimary,
            IsActive = true,
            IdentificationNumber = dto.IdentificationNumber,
            IdentificationType = dto.IdentificationType,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<PolicyBeneficiary>().Add(beneficiary);
        await _context.SaveChangesAsync();

        return await MapToDtoAsync(beneficiary);
    }

    public async Task<BeneficiaryDto?> UpdateBeneficiaryAsync(int beneficiaryId, int userId, UpdateBeneficiaryDto dto)
    {
        var beneficiary = await _context.Set<PolicyBeneficiary>()
            .Include(b => b.Policy)
            .FirstOrDefaultAsync(b => b.BeneficiaryId == beneficiaryId);

        if (beneficiary == null)
            return null;

        // Verify ownership
        if (beneficiary.Policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this beneficiary");

        // Validate total percentage (excluding current beneficiary)
        var currentTotal = await CalculateTotalPercentageAsync(beneficiary.PolicyId);
        var totalWithoutCurrent = currentTotal - beneficiary.BenefitPercentage;
        if (totalWithoutCurrent + dto.BenefitPercentage > 100)
            throw new InvalidOperationException($"Total benefit percentage cannot exceed 100%");

        // Update fields
        beneficiary.BeneficiaryName = dto.BeneficiaryName;
        beneficiary.Relationship = dto.Relationship;
        beneficiary.DateOfBirth = dto.DateOfBirth;
        beneficiary.PhoneNumber = dto.PhoneNumber;
        beneficiary.Email = dto.Email;
        beneficiary.Address = dto.Address;
        beneficiary.BenefitPercentage = dto.BenefitPercentage;
        beneficiary.IsPrimary = dto.IsPrimary;
        beneficiary.IdentificationNumber = dto.IdentificationNumber;
        beneficiary.IdentificationType = dto.IdentificationType;
        beneficiary.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await MapToDtoAsync(beneficiary);
    }

    public async Task<bool> DeleteBeneficiaryAsync(int beneficiaryId, int userId)
    {
        var beneficiary = await _context.Set<PolicyBeneficiary>()
            .Include(b => b.Policy)
            .FirstOrDefaultAsync(b => b.BeneficiaryId == beneficiaryId);

        if (beneficiary == null)
            return false;

        // Verify ownership
        if (beneficiary.Policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this beneficiary");

        _context.Set<PolicyBeneficiary>().Remove(beneficiary);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeactivateBeneficiaryAsync(int beneficiaryId, int userId)
    {
        var beneficiary = await _context.Set<PolicyBeneficiary>()
            .Include(b => b.Policy)
            .FirstOrDefaultAsync(b => b.BeneficiaryId == beneficiaryId);

        if (beneficiary == null)
            return false;

        // Verify ownership
        if (beneficiary.Policy.UserId != userId)
            throw new UnauthorizedAccessException("You don't have access to this beneficiary");

        beneficiary.IsActive = false;
        beneficiary.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<BeneficiaryDto?> GetBeneficiaryByIdAsync(int beneficiaryId)
    {
        var beneficiary = await _context.Set<PolicyBeneficiary>()
            .Include(b => b.Policy)
            .FirstOrDefaultAsync(b => b.BeneficiaryId == beneficiaryId);

        if (beneficiary == null)
            return null;

        return await MapToDtoAsync(beneficiary);
    }

    public async Task<List<BeneficiaryDto>> GetPolicyBeneficiariesAsync(int policyId)
    {
        var beneficiaries = await _context.Set<PolicyBeneficiary>()
            .Include(b => b.Policy)
            .Where(b => b.PolicyId == policyId)
            .OrderByDescending(b => b.IsPrimary)
            .ThenByDescending(b => b.BenefitPercentage)
            .ToListAsync();

        var result = new List<BeneficiaryDto>();
        foreach (var beneficiary in beneficiaries)
        {
            result.Add(await MapToDtoAsync(beneficiary));
        }

        return result;
    }

    public async Task<PolicyBeneficiariesSummaryDto?> GetPolicyBeneficiariesSummaryAsync(int policyId)
    {
        var policy = await _context.Policies.FindAsync(policyId);
        if (policy == null)
            return null;

        var beneficiaries = await GetPolicyBeneficiariesAsync(policyId);
        var activeCount = beneficiaries.Count(b => b.IsActive);
        var totalPercentage = await CalculateTotalPercentageAsync(policyId);

        return new PolicyBeneficiariesSummaryDto
        {
            PolicyId = policyId,
            PolicyNumber = policy.PolicyNumber,
            Beneficiaries = beneficiaries,
            TotalPercentageAllocated = totalPercentage,
            ActiveBeneficiariesCount = activeCount,
            TotalBeneficiariesCount = beneficiaries.Count
        };
    }

    public async Task<decimal> CalculateTotalPercentageAsync(int policyId)
    {
        var total = await _context.Set<PolicyBeneficiary>()
            .Where(b => b.PolicyId == policyId && b.IsActive)
            .SumAsync(b => b.BenefitPercentage);

        return total;
    }

    private async Task<BeneficiaryDto> MapToDtoAsync(PolicyBeneficiary beneficiary)
    {
        if (beneficiary.Policy == null)
        {
            beneficiary.Policy = (await _context.Policies.FindAsync(beneficiary.PolicyId))!;
        }

        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = CalculateAge(beneficiary.DateOfBirth, today);

        return new BeneficiaryDto
        {
            BeneficiaryId = beneficiary.BeneficiaryId,
            PolicyId = beneficiary.PolicyId,
            PolicyNumber = beneficiary.Policy.PolicyNumber,
            BeneficiaryName = beneficiary.BeneficiaryName,
            Relationship = beneficiary.Relationship,
            DateOfBirth = beneficiary.DateOfBirth,
            Age = age,
            PhoneNumber = beneficiary.PhoneNumber,
            Email = beneficiary.Email,
            Address = beneficiary.Address,
            BenefitPercentage = beneficiary.BenefitPercentage,
            IsPrimary = beneficiary.IsPrimary,
            IsActive = beneficiary.IsActive,
            IdentificationNumber = beneficiary.IdentificationNumber,
            IdentificationType = beneficiary.IdentificationType,
            CreatedAt = beneficiary.CreatedAt,
            UpdatedAt = beneficiary.UpdatedAt
        };
    }

    private int CalculateAge(DateOnly dateOfBirth, DateOnly asOfDate)
    {
        var age = asOfDate.Year - dateOfBirth.Year;
        if (asOfDate.Month < dateOfBirth.Month || (asOfDate.Month == dateOfBirth.Month && asOfDate.Day < dateOfBirth.Day))
            age--;
        return age;
    }
}
