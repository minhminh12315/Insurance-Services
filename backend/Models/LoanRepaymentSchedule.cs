using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Loan repayment schedule (EMI/installments)
/// </summary>
public partial class LoanRepaymentSchedule
{
    public int ScheduleId { get; set; }

    public int LoanId { get; set; }

    public int InstallmentNumber { get; set; }

    public DateOnly DueDate { get; set; }

    public decimal PrincipalAmount { get; set; }

    public decimal InterestAmount { get; set; }

    public decimal TotalAmount { get; set; } // Principal + Interest

    public decimal OutstandingBalance { get; set; } // Remaining after this payment

    public bool IsPaid { get; set; }

    public DateTime? PaidDate { get; set; }

    public decimal? PaidAmount { get; set; }

    public string? PaymentReference { get; set; }

    public int? DaysOverdue { get; set; }

    public decimal? LateFee { get; set; }

    public virtual PolicyLoan Loan { get; set; } = null!;
}
