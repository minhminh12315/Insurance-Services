using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Policy beneficiaries (nominees) - supports multiple beneficiaries
/// </summary>
public partial class PolicyBeneficiary
{
    public int BeneficiaryId { get; set; }

    public int PolicyId { get; set; }

    public string BeneficiaryName { get; set; } = null!;

    public string Relationship { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public decimal BenefitPercentage { get; set; } // Percentage of sum assured (e.g., 50.00 for 50%)

    public bool IsPrimary { get; set; } // Primary or contingent beneficiary

    public bool IsActive { get; set; } // Can deactivate without deleting

    public string? IdentificationNumber { get; set; } // ID card/passport

    public string? IdentificationType { get; set; } // ID Card, Passport, etc.

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Policy Policy { get; set; } = null!;
}
