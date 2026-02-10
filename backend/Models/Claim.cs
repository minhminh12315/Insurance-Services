using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class Claim
{
    [Key]
    public int ClaimId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public DateOnly ClaimDate { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal ClaimAmount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Status { get; set; } = "Submitted";

    [MaxLength(500)]
    public string? AdminComment { get; set; }

    public Policy Policy { get; set; } = null!;

    public User User { get; set; } = null!;
}
