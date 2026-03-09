using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class InsuranceSchemeService : IInsuranceSchemeService
{
    private readonly InsuranceDbContext _context;

    public InsuranceSchemeService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InsuranceSchemeDto>> GetAllSchemesAsync(int? categoryId = null, bool? isActive = null)
    {
        var query = _context.InsuranceSchemes
            .Include(s => s.Category)
            .Include(s => s.Policies)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(s => s.CategoryId == categoryId.Value);

        if (isActive.HasValue)
            query = query.Where(s => s.IsActive == isActive.Value);

        return await query.Select(s => new InsuranceSchemeDto
        {
            SchemeId = s.SchemeId,
            CategoryId = s.CategoryId,
            CategoryName = s.Category != null ? s.Category.CategoryName : null,
            SchemeName = s.SchemeName,
            Description = s.Description,
            MinTerm = s.MinTerm,
            MaxTerm = s.MaxTerm,
            MinInvestmentAmount = s.MinInvestmentAmount,
            MaxInvestmentAmount = s.MaxInvestmentAmount,
            ProfitRatio = s.ProfitRatio,
            NewLaunchDate = s.NewLaunchDate,
            IsActive = s.IsActive,
            PolicyCount = s.Policies.Count
        }).ToListAsync();
    }

    public async Task<PagedResult<InsuranceSchemeDto>> GetAdminSchemesAsync(int pageNumber, int pageSize, string searchTerm, int? categoryId = null)
    {
        var query = _context.InsuranceSchemes
            .Include(s => s.Category)
            .Include(s => s.Policies)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(s => s.CategoryId == categoryId.Value);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(s => s.SchemeName.Contains(searchTerm) || (s.Description != null && s.Description.Contains(searchTerm)));
        }

        var totalCount = await query.CountAsync();

        var schemes = await query
            .OrderByDescending(s => s.SchemeId) // Newest first
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new InsuranceSchemeDto
            {
                SchemeId = s.SchemeId,
                CategoryId = s.CategoryId,
                CategoryName = s.Category != null ? s.Category.CategoryName : null,
                SchemeName = s.SchemeName,
                Description = s.Description,
                MinTerm = s.MinTerm,
                MaxTerm = s.MaxTerm,
                MinInvestmentAmount = s.MinInvestmentAmount,
                MaxInvestmentAmount = s.MaxInvestmentAmount,
                ProfitRatio = s.ProfitRatio,
                NewLaunchDate = s.NewLaunchDate,
                IsActive = s.IsActive,
                PolicyCount = s.Policies.Count
            }).ToListAsync();

        return new PagedResult<InsuranceSchemeDto>
        {
            Items = schemes,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<InsuranceSchemeDto?> GetSchemeByIdAsync(int schemeId)
    {
        var scheme = await _context.InsuranceSchemes
            .Include(s => s.Category)
            .Include(s => s.Policies)
            .FirstOrDefaultAsync(s => s.SchemeId == schemeId);

        if (scheme == null)
            return null;

        return new InsuranceSchemeDto
        {
            SchemeId = scheme.SchemeId,
            CategoryId = scheme.CategoryId,
            CategoryName = scheme.Category?.CategoryName,
            SchemeName = scheme.SchemeName,
            Description = scheme.Description,
            MinTerm = scheme.MinTerm,
            MaxTerm = scheme.MaxTerm,
            MinInvestmentAmount = scheme.MinInvestmentAmount,
            MaxInvestmentAmount = scheme.MaxInvestmentAmount,
            ProfitRatio = scheme.ProfitRatio,
            NewLaunchDate = scheme.NewLaunchDate,
            IsActive = scheme.IsActive,
            PolicyCount = scheme.Policies.Count
        };
    }

    public async Task<InsuranceSchemeDto> CreateSchemeAsync(CreateSchemeDto dto)
    {
        // Validate category exists
        var categoryExists = await _context.InsuranceCategories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        if (!categoryExists)
            throw new InvalidOperationException("Category not found");

        // Validate term range
        if (dto.MinTerm.HasValue && dto.MaxTerm.HasValue && dto.MinTerm > dto.MaxTerm)
            throw new InvalidOperationException("Minimum term cannot be greater than maximum term");

        // Validate investment amount range
        if (dto.MinInvestmentAmount.HasValue && dto.MaxInvestmentAmount.HasValue &&
            dto.MinInvestmentAmount > dto.MaxInvestmentAmount)
            throw new InvalidOperationException("Minimum investment cannot be greater than maximum investment");

        var scheme = new InsuranceScheme
        {
            CategoryId = dto.CategoryId,
            SchemeName = dto.SchemeName,
            Description = dto.Description,
            MinTerm = dto.MinTerm,
            MaxTerm = dto.MaxTerm,
            MinInvestmentAmount = dto.MinInvestmentAmount,
            MaxInvestmentAmount = dto.MaxInvestmentAmount,
            ProfitRatio = dto.ProfitRatio,
            NewLaunchDate = dto.NewLaunchDate,
            IsActive = dto.IsActive
        };

        _context.InsuranceSchemes.Add(scheme);
        await _context.SaveChangesAsync();

        return await GetSchemeByIdAsync(scheme.SchemeId) ?? new InsuranceSchemeDto();
    }

    public async Task<InsuranceSchemeDto?> UpdateSchemeAsync(int schemeId, UpdateSchemeDto dto)
    {
        var scheme = await _context.InsuranceSchemes.FindAsync(schemeId);
        if (scheme == null)
            return null;

        // Validate category exists
        var categoryExists = await _context.InsuranceCategories.AnyAsync(c => c.CategoryId == dto.CategoryId);
        if (!categoryExists)
            throw new InvalidOperationException("Category not found");

        // Validate term range
        if (dto.MinTerm.HasValue && dto.MaxTerm.HasValue && dto.MinTerm > dto.MaxTerm)
            throw new InvalidOperationException("Minimum term cannot be greater than maximum term");

        // Validate investment amount range
        if (dto.MinInvestmentAmount.HasValue && dto.MaxInvestmentAmount.HasValue &&
            dto.MinInvestmentAmount > dto.MaxInvestmentAmount)
            throw new InvalidOperationException("Minimum investment cannot be greater than maximum investment");

        scheme.CategoryId = dto.CategoryId;
        scheme.SchemeName = dto.SchemeName;
        scheme.Description = dto.Description;
        scheme.MinTerm = dto.MinTerm;
        scheme.MaxTerm = dto.MaxTerm;
        scheme.MinInvestmentAmount = dto.MinInvestmentAmount;
        scheme.MaxInvestmentAmount = dto.MaxInvestmentAmount;
        scheme.ProfitRatio = dto.ProfitRatio;
        scheme.NewLaunchDate = dto.NewLaunchDate;
        scheme.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return await GetSchemeByIdAsync(schemeId);
    }

    public async Task<bool> DeleteSchemeAsync(int schemeId)
    {
        var scheme = await _context.InsuranceSchemes.FindAsync(schemeId);
        if (scheme == null)
            return false;

        // Check if scheme has associated policies
        var hasPolicies = await _context.Policies.AnyAsync(p => p.SchemeId == schemeId);
        if (hasPolicies)
            throw new InvalidOperationException("Cannot delete scheme with associated policies");

        _context.InsuranceSchemes.Remove(scheme);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<PremiumCalculationResultDto?> CalculatePremiumAsync(CalculatePremiumRequestDto request)
    {
        var scheme = await _context.InsuranceSchemes.FindAsync(request.SchemeId);
        if (scheme == null)
            return null;

        // Validate term is within scheme limits
        if (scheme.MinTerm.HasValue && request.TermYears < scheme.MinTerm.Value)
            throw new InvalidOperationException($"Term must be at least {scheme.MinTerm} years");

        if (scheme.MaxTerm.HasValue && request.TermYears > scheme.MaxTerm.Value)
            throw new InvalidOperationException($"Term cannot exceed {scheme.MaxTerm} years");

        // Validate sum assured is within scheme limits
        if (scheme.MinInvestmentAmount.HasValue && request.SumAssured < scheme.MinInvestmentAmount.Value)
            throw new InvalidOperationException($"Sum assured must be at least {scheme.MinInvestmentAmount:C}");

        if (scheme.MaxInvestmentAmount.HasValue && request.SumAssured > scheme.MaxInvestmentAmount.Value)
            throw new InvalidOperationException($"Sum assured cannot exceed {scheme.MaxInvestmentAmount:C}");

        // Calculate premium
        // Base calculation: (SumAssured * ProfitRatio / 100) / TermYears
        decimal profitRatio = scheme.ProfitRatio ?? 5; // Default 5% if not specified
        decimal annualPremium = (request.SumAssured * profitRatio / 100) / request.TermYears;

        // Calculate based on payment frequency
        int installmentsPerYear = request.PaymentFrequency.ToLower() switch
        {
            "monthly" => 12,
            "quarterly" => 4,
            "halfyearly" => 2,
            "yearly" => 1,
            _ => 12
        };

        decimal premiumPerInstallment = annualPremium / installmentsPerYear;
        int totalInstallments = request.TermYears * installmentsPerYear;
        decimal totalPremium = premiumPerInstallment * totalInstallments;

        var calculationDetails = $"Calculation: Sum Assured ({request.SumAssured:C}) × Profit Ratio ({profitRatio}%) ÷ Term ({request.TermYears} years) = Annual Premium ({annualPremium:C}). " +
                               $"Payment frequency: {request.PaymentFrequency} ({installmentsPerYear} times/year). " +
                               $"Premium per installment: {premiumPerInstallment:C}";

        return new PremiumCalculationResultDto
        {
            SchemeId = scheme.SchemeId,
            SchemeName = scheme.SchemeName,
            SumAssured = request.SumAssured,
            TermYears = request.TermYears,
            PaymentFrequency = request.PaymentFrequency,
            AnnualPremium = annualPremium,
            PremiumPerInstallment = premiumPerInstallment,
            NumberOfInstallments = totalInstallments,
            TotalPremiumPayable = totalPremium,
            CalculationDetails = calculationDetails
        };
    }
}
