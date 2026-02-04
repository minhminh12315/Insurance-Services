using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PolicyLoan
{
    public int LoanId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public decimal LoanAmount { get; set; }

    public decimal InterestRate { get; set; }

    public DateOnly ApplicationDate { get; set; }

    public DateOnly? ApprovalDate { get; set; }

    public string? LoanStatus { get; set; }

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
