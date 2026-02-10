using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class Policy
{
    [Key]
    public int PolicyId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [ForeignKey("Scheme")]
    public int SchemeId { get; set; }

    [Required]
    [MaxLength(50)]
    public string PolicyNumber { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly MaturityDate { get; set; }

    public int TermYears { get; set; }

    [Required]
    [MaxLength(20)]
    public string PaymentFrequency { get; set; } = null!;

    [Column(TypeName = "decimal(15,2)")]
    public decimal SumAssured { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal PremiumAmount { get; set; }

    [MaxLength(20)]
    public string? PolicyStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    [InverseProperty("Policy")]
    public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();

    public virtual PolicyDetailsHome? PolicyDetailsHome { get; set; }

    public virtual PolicyDetailsLife? PolicyDetailsLife { get; set; }

    public virtual PolicyDetailsMedical? PolicyDetailsMedical { get; set; }

    public virtual PolicyDetailsMotor? PolicyDetailsMotor { get; set; }

    [InverseProperty("Policy")]
    public virtual ICollection<PolicyLoan> PolicyLoans { get; set; } = new List<PolicyLoan>();

    [InverseProperty("Policy")]
    public virtual ICollection<PremiumPayment> PremiumPayments { get; set; } = new List<PremiumPayment>();

    public virtual InsuranceScheme Scheme { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
