using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

// Premium Payment DTOs
public class PremiumPaymentDto
{
    public int PaymentId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public decimal AmountPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? PaymentMethod { get; set; }
    public string? TransactionReference { get; set; }
    public string? Status { get; set; }
}

public class CreatePaymentDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal AmountPaid { get; set; }

    [Required]
    public string PaymentMethod { get; set; } = string.Empty; // CreditCard, DebitCard, BankTransfer, UPI, Cash

    public string? TransactionReference { get; set; }
}

public class UpdatePaymentStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Pending, Completed, Failed, Refunded
}

// Policy Loan DTOs
public class PolicyLoanDto
{
    public int LoanId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public decimal LoanAmount { get; set; }
    public decimal InterestRate { get; set; }
    public DateOnly ApplicationDate { get; set; }
    public DateOnly? ApprovalDate { get; set; }
    public string? LoanStatus { get; set; }
}

public class CreatePolicyLoanDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal LoanAmount { get; set; }
}

public class UpdateLoanStatusDto
{
    [Required]
    public string LoanStatus { get; set; } = string.Empty; // Requested, Approved, Rejected, Disbursed, Repaid
}

// News and Announcement DTOs
public class NewsDto
{
    public int NewsId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime? PublishedDate { get; set; }
    public int? AuthorId { get; set; }
    public string? AuthorName { get; set; }
}

public class CreateNewsDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
}

public class UpdateNewsDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
}
