using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class PolicyDto
{
    public int PolicyId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int SchemeId { get; set; }
    public string SchemeName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly MaturityDate { get; set; }
    public int TermYears { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public decimal SumAssured { get; set; }
    public decimal PremiumAmount { get; set; }
    public string? PolicyStatus { get; set; }
    public DateTime? CreatedAt { get; set; }
    public object? PolicyDetails { get; set; } // Will hold Life/Medical/Motor/Home details
}

public class CreatePolicyDto
{
    [Required]
    public int SchemeId { get; set; }

    [Required]
    [Range(1, 100)]
    public int TermYears { get; set; }

    [Required]
    public string PaymentFrequency { get; set; } = "Monthly"; // Monthly, Quarterly, HalfYearly, Yearly

    [Required]
    [Range(0, double.MaxValue)]
    public decimal SumAssured { get; set; }

    // Policy type specific details (only one should be provided based on category)
    public PolicyDetailsLifeDto? LifeDetails { get; set; }
    public PolicyDetailsMedicalDto? MedicalDetails { get; set; }
    public PolicyDetailsMotorDto? MotorDetails { get; set; }
    public PolicyDetailsHomeDto? HomeDetails { get; set; }
}

public class PolicyDetailsLifeDto
{
    [Required]
    [MaxLength(100)]
    public string NomineeName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string NomineeRelation { get; set; } = string.Empty;
}

public class PolicyDetailsMedicalDto
{
    [MaxLength(500)]
    public string? PreExistingDiseases { get; set; }

    [MaxLength(50)]
    public string? HospitalNetworkTier { get; set; }

    public bool IsFamilyFloater { get; set; } = false;
}

public class PolicyDetailsMotorDto
{
    [Required]
    [MaxLength(20)]
    public string VehicleRegNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string VehicleModel { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? VehicleType { get; set; }

    [MaxLength(50)]
    public string? EngineNumber { get; set; }

    [MaxLength(50)]
    public string? ChassisNumber { get; set; }

    [Range(1900, 2100)]
    public int? ManufacturingYear { get; set; }
}

public class PolicyDetailsHomeDto
{
    [Required]
    [MaxLength(255)]
    public string PropertyAddress { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal? PropertyValue { get; set; }

    [MaxLength(50)]
    public string? StructureType { get; set; }

    [Range(1800, 2100)]
    public int? BuiltYear { get; set; }
}

public class UpdatePolicyStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Active, Lapsed, Matured, Surrendered, Cancelled
}
