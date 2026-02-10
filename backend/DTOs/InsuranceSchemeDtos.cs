using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class InsuranceSchemeDto
{
    public int SchemeId { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string SchemeName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MinTerm { get; set; }
    public int? MaxTerm { get; set; }
    public decimal? MinInvestmentAmount { get; set; }
    public decimal? MaxInvestmentAmount { get; set; }
    public decimal? ProfitRatio { get; set; }
    public DateOnly? NewLaunchDate { get; set; }
    public bool? IsActive { get; set; }
    public int PolicyCount { get; set; }
}

public class CreateSchemeDto
{
    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Scheme name is required")]
    [MaxLength(100, ErrorMessage = "Scheme name cannot exceed 100 characters")]
    public string SchemeName { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [Range(1, 100, ErrorMessage = "Minimum term must be between 1 and 100 years")]
    public int? MinTerm { get; set; }

    [Range(1, 100, ErrorMessage = "Maximum term must be between 1 and 100 years")]
    public int? MaxTerm { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Minimum investment must be positive")]
    public decimal? MinInvestmentAmount { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Maximum investment must be positive")]
    public decimal? MaxInvestmentAmount { get; set; }

    [Range(0, 100, ErrorMessage = "Profit ratio must be between 0 and 100")]
    public decimal? ProfitRatio { get; set; }

    public DateOnly? NewLaunchDate { get; set; }

    public bool? IsActive { get; set; } = true;
}

public class UpdateSchemeDto
{
    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Scheme name is required")]
    [MaxLength(100, ErrorMessage = "Scheme name cannot exceed 100 characters")]
    public string SchemeName { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [Range(1, 100, ErrorMessage = "Minimum term must be between 1 and 100 years")]
    public int? MinTerm { get; set; }

    [Range(1, 100, ErrorMessage = "Maximum term must be between 1 and 100 years")]
    public int? MaxTerm { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Minimum investment must be positive")]
    public decimal? MinInvestmentAmount { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Maximum investment must be positive")]
    public decimal? MaxInvestmentAmount { get; set; }

    [Range(0, 100, ErrorMessage = "Profit ratio must be between 0 and 100")]
    public decimal? ProfitRatio { get; set; }

    public DateOnly? NewLaunchDate { get; set; }

    public bool? IsActive { get; set; }
}

public class CalculatePremiumRequestDto
{
    [Required]
    public int SchemeId { get; set; }

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Sum assured must be positive")]
    public decimal SumAssured { get; set; }

    [Required]
    [Range(1, 100, ErrorMessage = "Term must be between 1 and 100 years")]
    public int TermYears { get; set; }

    [Required]
    public string PaymentFrequency { get; set; } = "Monthly"; // Monthly, Quarterly, HalfYearly, Yearly
}

public class PremiumCalculationResultDto
{
    public int SchemeId { get; set; }
    public string SchemeName { get; set; } = string.Empty;
    public decimal SumAssured { get; set; }
    public int TermYears { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public decimal AnnualPremium { get; set; }
    public decimal PremiumPerInstallment { get; set; }
    public int NumberOfInstallments { get; set; }
    public decimal TotalPremiumPayable { get; set; }
    public string CalculationDetails { get; set; } = string.Empty;
}
