using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Create or update beneficiary
/// </summary>
public class CreateBeneficiaryDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [StringLength(100)]
    public string BeneficiaryName { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string Relationship { get; set; } = null!;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [Required]
    [Range(0.01, 100.00, ErrorMessage = "Benefit percentage must be between 0.01 and 100")]
    public decimal BenefitPercentage { get; set; }

    public bool IsPrimary { get; set; } = true;

    [StringLength(50)]
    public string? IdentificationNumber { get; set; }

    [StringLength(50)]
    public string? IdentificationType { get; set; }
}

/// <summary>
/// Update existing beneficiary
/// </summary>
public class UpdateBeneficiaryDto
{
    [Required]
    [StringLength(100)]
    public string BeneficiaryName { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string Relationship { get; set; } = null!;

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [Required]
    [Range(0.01, 100.00)]
    public decimal BenefitPercentage { get; set; }

    public bool IsPrimary { get; set; }

    [StringLength(50)]
    public string? IdentificationNumber { get; set; }

    [StringLength(50)]
    public string? IdentificationType { get; set; }
}

/// <summary>
/// Beneficiary response
/// </summary>
public class BeneficiaryDto
{
    public int BeneficiaryId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public string BeneficiaryName { get; set; } = null!;
    public string Relationship { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public int Age { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public decimal BenefitPercentage { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; }
    public string? IdentificationNumber { get; set; }
    public string? IdentificationType { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Summary of all beneficiaries for a policy
/// </summary>
public class PolicyBeneficiariesSummaryDto
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public List<BeneficiaryDto> Beneficiaries { get; set; } = new();
    public decimal TotalPercentageAllocated { get; set; }
    public bool IsFullyAllocated => TotalPercentageAllocated == 100.00m;
    public int ActiveBeneficiariesCount { get; set; }
    public int TotalBeneficiariesCount { get; set; }
}
