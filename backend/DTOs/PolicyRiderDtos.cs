using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class PolicyRiderDto
{
    public int RiderId { get; set; }
    public int PolicyId { get; set; }
    public string RiderName { get; set; } = string.Empty;
    public string RiderType { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal RiderPremium { get; set; }
    public decimal? CoverageAmount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePolicyRiderDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [StringLength(100)]
    public string RiderName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string RiderType { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal RiderPremium { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? CoverageAmount { get; set; }
}

public class UpdatePolicyRiderDto
{
    [StringLength(100)]
    public string? RiderName { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? RiderPremium { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? CoverageAmount { get; set; }

    public bool? IsActive { get; set; }
}

// Available Rider Templates
public class RiderTemplateDto
{
    public string RiderType { get; set; } = string.Empty;
    public string RiderName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ApplicableCategories { get; set; } = string.Empty; // Life, Medical, Motor, Home
    public decimal BasePrice { get; set; }
}
