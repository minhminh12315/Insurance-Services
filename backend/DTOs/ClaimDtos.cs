using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class ClaimDto
{
    public int ClaimId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateOnly ClaimDate { get; set; }
    public decimal ClaimAmount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdminComment { get; set; }
    public string? DocumentPath { get; set; }
    public string? DocumentUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateClaimDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal ClaimAmount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}

public class UpdateClaimStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Submitted, UnderReview, Approved, Rejected, Paid

    [MaxLength(500)]
    public string? AdminComment { get; set; }
}
