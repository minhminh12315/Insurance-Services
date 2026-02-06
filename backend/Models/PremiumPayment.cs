using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PremiumPayment
{
    [Key]
    public int PaymentId { get; set; }

    [ForeignKey("Policy")]
    public int PolicyId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal AmountPaid { get; set; }

    public DateTime? PaymentDate { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [MaxLength(100)]
    public string? TransactionReference { get; set; }

    [MaxLength(20)]
    public string? Status { get; set; } = "Pending";

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
