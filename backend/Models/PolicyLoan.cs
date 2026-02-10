using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PolicyLoan
{
    [Key]
    public int LoanId { get; set; }

    [ForeignKey("Policy")]
    public int PolicyId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal LoanAmount { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal InterestRate { get; set; }

    public DateOnly ApplicationDate { get; set; }

    public DateOnly? ApprovalDate { get; set; }

    [MaxLength(20)]
    public string? LoanStatus { get; set; } = "Requested";

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
