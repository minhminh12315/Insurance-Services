using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Generate loan repayment schedule
/// </summary>
public class GenerateLoanScheduleDto
{
    [Required]
    public int LoanId { get; set; }

    [Required]
    [Range(1, 120, ErrorMessage = "Repayment period must be between 1 and 120 months")]
    public int RepaymentMonths { get; set; }

    public DateOnly? FirstPaymentDate { get; set; } // Optional, defaults to next month
}

/// <summary>
/// Loan repayment schedule item
/// </summary>
public class LoanRepaymentScheduleDto
{
    public int ScheduleId { get; set; }
    public int LoanId { get; set; }
    public int InstallmentNumber { get; set; }
    public DateOnly DueDate { get; set; }
    public decimal PrincipalAmount { get; set; }
    public decimal InterestAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal OutstandingBalance { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
    public decimal? PaidAmount { get; set; }
    public string? PaymentReference { get; set; }
    public int? DaysOverdue { get; set; }
    public decimal? LateFee { get; set; }
    public string Status { get; set; } = null!; // Upcoming, Due, Overdue, Paid
}

/// <summary>
/// Complete loan schedule with summary
/// </summary>
public class LoanScheduleSummaryDto
{
    public int LoanId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public decimal LoanAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int TotalInstallments { get; set; }
    public decimal MonthlyPayment { get; set; }
    public decimal TotalInterest { get; set; }
    public decimal TotalRepayable { get; set; }
    public List<LoanRepaymentScheduleDto> Schedule { get; set; } = new();
    public int PaidInstallments { get; set; }
    public int PendingInstallments { get; set; }
    public int OverdueInstallments { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalOutstanding { get; set; }
    public DateOnly? NextDueDate { get; set; }
    public decimal? NextDueAmount { get; set; }
}

/// <summary>
/// Record loan repayment
/// </summary>
public class RecordLoanPaymentDto
{
    [Required]
    public int ScheduleId { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal PaidAmount { get; set; }

    [Required]
    public string PaymentReference { get; set; } = null!;

    public DateTime? PaymentDate { get; set; } // Defaults to now
}

/// <summary>
/// Loan payment history
/// </summary>
public class LoanPaymentHistoryDto
{
    public int LoanId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public List<LoanRepaymentScheduleDto> Payments { get; set; } = new();
    public decimal TotalPaid { get; set; }
    public decimal TotalPrincipalPaid { get; set; }
    public decimal TotalInterestPaid { get; set; }
    public decimal TotalLateFees { get; set; }
    public int PaymentsCount { get; set; }
}
