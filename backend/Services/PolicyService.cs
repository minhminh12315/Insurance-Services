using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PolicyService : IPolicyService
{
    private readonly InsuranceDbContext _context;

    public PolicyService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PolicyDto>> GetAllPoliciesAsync(int? userId = null, string? status = null)
    {
        var query = _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme).ThenInclude(s => s.Category)
            .Include(p => p.PolicyDetailsLife)
            .Include(p => p.PolicyDetailsMedical)
            .Include(p => p.PolicyDetailsMotor)
            .Include(p => p.PolicyDetailsHome)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(p => p.UserId == userId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.PolicyStatus == status);

        return await query.Select(p => MapToDto(p)).ToListAsync();
    }

    public async Task<PolicyDto?> GetPolicyByIdAsync(int policyId)
    {
        var policy = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme).ThenInclude(s => s.Category)
            .Include(p => p.PolicyDetailsLife)
            .Include(p => p.PolicyDetailsMedical)
            .Include(p => p.PolicyDetailsMotor)
            .Include(p => p.PolicyDetailsHome)
            .FirstOrDefaultAsync(p => p.PolicyId == policyId);

        return policy == null ? null : MapToDto(policy);
    }

    public async Task<PolicyDto?> GetPolicyByNumberAsync(string policyNumber)
    {
        var policy = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme).ThenInclude(s => s.Category)
            .Include(p => p.PolicyDetailsLife)
            .Include(p => p.PolicyDetailsMedical)
            .Include(p => p.PolicyDetailsMotor)
            .Include(p => p.PolicyDetailsHome)
            .FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);

        return policy == null ? null : MapToDto(policy);
    }

    public async Task<IEnumerable<PolicyDto>> GetUserPoliciesAsync(int userId, bool activeOnly = false)
    {
        var query = _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme).ThenInclude(s => s.Category)
            .Include(p => p.PolicyDetailsLife)
            .Include(p => p.PolicyDetailsMedical)
            .Include(p => p.PolicyDetailsMotor)
            .Include(p => p.PolicyDetailsHome)
            .Where(p => p.UserId == userId);

        if (activeOnly)
            query = query.Where(p => p.PolicyStatus == "Active");

        return await query.Select(p => MapToDto(p)).ToListAsync();
    }

    public async Task<PolicyDto> CreatePolicyAsync(int userId, CreatePolicyDto dto)
    {
        // Validate user exists
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        // Validate scheme exists and is active
        var scheme = await _context.InsuranceSchemes
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.SchemeId == dto.SchemeId);
        
        if (scheme == null)
            throw new InvalidOperationException("Insurance scheme not found");

        if (scheme.IsActive == false)
            throw new InvalidOperationException("Insurance scheme is not active");

        // Validate term
        if (scheme.MinTerm.HasValue && dto.TermYears < scheme.MinTerm.Value)
            throw new InvalidOperationException($"Term must be at least {scheme.MinTerm} years");

        if (scheme.MaxTerm.HasValue && dto.TermYears > scheme.MaxTerm.Value)
            throw new InvalidOperationException($"Term cannot exceed {scheme.MaxTerm} years");

        // Validate sum assured
        if (scheme.MinInvestmentAmount.HasValue && dto.SumAssured < scheme.MinInvestmentAmount.Value)
            throw new InvalidOperationException($"Sum assured must be at least {scheme.MinInvestmentAmount:C}");

        if (scheme.MaxInvestmentAmount.HasValue && dto.SumAssured > scheme.MaxInvestmentAmount.Value)
            throw new InvalidOperationException($"Sum assured cannot exceed {scheme.MaxInvestmentAmount:C}");

        // Calculate premium
        decimal profitRatio = scheme.ProfitRatio ?? 5;
        decimal annualPremium = (dto.SumAssured * profitRatio / 100) / dto.TermYears;
        int installmentsPerYear = dto.PaymentFrequency.ToLower() switch
        {
            "monthly" => 12,
            "quarterly" => 4,
            "halfyearly" => 2,
            "yearly" => 1,
            _ => 12
        };
        decimal premiumAmount = annualPremium / installmentsPerYear;

        // Generate policy number
        var policyNumber = await GeneratePolicyNumber(scheme.Category?.CategoryName ?? "GEN");

        // Create policy
        var policy = new Policy
        {
            UserId = userId,
            SchemeId = dto.SchemeId,
            PolicyNumber = policyNumber,
            StartDate = DateOnly.FromDateTime(DateTime.Today),
            MaturityDate = DateOnly.FromDateTime(DateTime.Today.AddYears(dto.TermYears)),
            TermYears = dto.TermYears,
            PaymentFrequency = dto.PaymentFrequency,
            SumAssured = dto.SumAssured,
            PremiumAmount = premiumAmount,
            PolicyStatus = "Active",
            CreatedAt = DateTime.UtcNow
        };

        _context.Policies.Add(policy);
        await _context.SaveChangesAsync();

        // Add policy type specific details
        var categoryName = scheme.Category?.CategoryName?.ToLower() ?? "";
        
        if (categoryName.Contains("life") || categoryName.Contains("nhân thọ"))
        {
            if (dto.LifeDetails == null)
                throw new InvalidOperationException("Life insurance details are required");

            var lifeDetails = new PolicyDetailsLife
            {
                PolicyId = policy.PolicyId,
                NomineeName = dto.LifeDetails.NomineeName,
                NomineeRelation = dto.LifeDetails.NomineeRelation
            };
            _context.PolicyDetailsLives.Add(lifeDetails);
        }
        else if (categoryName.Contains("medical") || categoryName.Contains("y tế"))
        {
            if (dto.MedicalDetails == null)
                throw new InvalidOperationException("Medical insurance details are required");

            var medicalDetails = new PolicyDetailsMedical
            {
                PolicyId = policy.PolicyId,
                PreExistingDiseases = dto.MedicalDetails.PreExistingDiseases,
                HospitalNetworkTier = dto.MedicalDetails.HospitalNetworkTier,
                IsFamilyFloater = dto.MedicalDetails.IsFamilyFloater
            };
            _context.PolicyDetailsMedicals.Add(medicalDetails);
        }
        else if (categoryName.Contains("motor") || categoryName.Contains("xe"))
        {
            if (dto.MotorDetails == null)
                throw new InvalidOperationException("Motor insurance details are required");

            var motorDetails = new PolicyDetailsMotor
            {
                PolicyId = policy.PolicyId,
                VehicleRegNumber = dto.MotorDetails.VehicleRegNumber,
                VehicleModel = dto.MotorDetails.VehicleModel,
                VehicleType = dto.MotorDetails.VehicleType,
                EngineNumber = dto.MotorDetails.EngineNumber,
                ChassisNumber = dto.MotorDetails.ChassisNumber,
                ManufacturingYear = dto.MotorDetails.ManufacturingYear
            };
            _context.PolicyDetailsMotors.Add(motorDetails);
        }
        else if (categoryName.Contains("home") || categoryName.Contains("nhà"))
        {
            if (dto.HomeDetails == null)
                throw new InvalidOperationException("Home insurance details are required");

            var homeDetails = new PolicyDetailsHome
            {
                PolicyId = policy.PolicyId,
                PropertyAddress = dto.HomeDetails.PropertyAddress,
                PropertyValue = dto.HomeDetails.PropertyValue,
                StructureType = dto.HomeDetails.StructureType,
                BuiltYear = dto.HomeDetails.BuiltYear
            };
            _context.PolicyDetailsHomes.Add(homeDetails);
        }

        await _context.SaveChangesAsync();

        return (await GetPolicyByIdAsync(policy.PolicyId))!;
    }

    public async Task<PolicyDto?> UpdatePolicyStatusAsync(int policyId, UpdatePolicyStatusDto dto)
    {
        var policy = await _context.Policies.FindAsync(policyId);
        if (policy == null)
            return null;

        var validStatuses = new[] { "Active", "Lapsed", "Matured", "Surrendered", "Cancelled" };
        if (!validStatuses.Contains(dto.Status))
            throw new InvalidOperationException($"Invalid status. Must be one of: {string.Join(", ", validStatuses)}");

        policy.PolicyStatus = dto.Status;
        await _context.SaveChangesAsync();

        return await GetPolicyByIdAsync(policyId);
    }

    public async Task<bool> CancelPolicyAsync(int policyId, int userId)
    {
        var policy = await _context.Policies.FindAsync(policyId);
        if (policy == null)
            return false;

        if (policy.UserId != userId)
            throw new UnauthorizedAccessException("You can only cancel your own policies");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Only active policies can be cancelled");

        policy.PolicyStatus = "Cancelled";
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<string> GeneratePolicyNumber(string categoryPrefix)
    {
        var prefix = categoryPrefix.Substring(0, Math.Min(3, categoryPrefix.Length)).ToUpper();
        var count = await _context.Policies.CountAsync();
        var timestamp = DateTime.Now.ToString("yyyyMMdd");
        return $"POL-{prefix}-{timestamp}-{(count + 1):D6}";
    }

    private PolicyDto MapToDto(Policy policy)
    {
        object? policyDetails = null;

        if (policy.PolicyDetailsLife != null)
        {
            policyDetails = new PolicyDetailsLifeDto
            {
                NomineeName = policy.PolicyDetailsLife.NomineeName ?? "",
                NomineeRelation = policy.PolicyDetailsLife.NomineeRelation ?? ""
            };
        }
        else if (policy.PolicyDetailsMedical != null)
        {
            policyDetails = new PolicyDetailsMedicalDto
            {
                PreExistingDiseases = policy.PolicyDetailsMedical.PreExistingDiseases,
                HospitalNetworkTier = policy.PolicyDetailsMedical.HospitalNetworkTier,
                IsFamilyFloater = policy.PolicyDetailsMedical.IsFamilyFloater ?? false
            };
        }
        else if (policy.PolicyDetailsMotor != null)
        {
            policyDetails = new PolicyDetailsMotorDto
            {
                VehicleRegNumber = policy.PolicyDetailsMotor.VehicleRegNumber ?? "",
                VehicleModel = policy.PolicyDetailsMotor.VehicleModel ?? "",
                VehicleType = policy.PolicyDetailsMotor.VehicleType,
                EngineNumber = policy.PolicyDetailsMotor.EngineNumber,
                ChassisNumber = policy.PolicyDetailsMotor.ChassisNumber,
                ManufacturingYear = policy.PolicyDetailsMotor.ManufacturingYear
            };
        }
        else if (policy.PolicyDetailsHome != null)
        {
            policyDetails = new PolicyDetailsHomeDto
            {
                PropertyAddress = policy.PolicyDetailsHome.PropertyAddress,
                PropertyValue = policy.PolicyDetailsHome.PropertyValue,
                StructureType = policy.PolicyDetailsHome.StructureType,
                BuiltYear = policy.PolicyDetailsHome.BuiltYear
            };
        }

        return new PolicyDto
        {
            PolicyId = policy.PolicyId,
            UserId = policy.UserId,
            UserName = policy.User.FullName,
            SchemeId = policy.SchemeId,
            SchemeName = policy.Scheme.SchemeName,
            CategoryName = policy.Scheme.Category?.CategoryName ?? "",
            PolicyNumber = policy.PolicyNumber,
            StartDate = policy.StartDate,
            MaturityDate = policy.MaturityDate,
            TermYears = policy.TermYears,
            PaymentFrequency = policy.PaymentFrequency,
            SumAssured = policy.SumAssured,
            PremiumAmount = policy.PremiumAmount,
            PolicyStatus = policy.PolicyStatus,
            CreatedAt = policy.CreatedAt,
            PolicyDetails = policyDetails
        };
    }
}
