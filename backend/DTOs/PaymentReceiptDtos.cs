using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Request to generate payment receipt
/// </summary>
public class GenerateReceiptDto
{
    [Required]
    public int PaymentId { get; set; }

    public bool SendEmail { get; set; } = true;
}

/// <summary>
/// Payment receipt details
/// </summary>
public class PaymentReceiptDto
{
    public int ReceiptId { get; set; }
    public int PaymentId { get; set; }
    public string ReceiptNumber { get; set; } = null!;
    public DateTime GeneratedAt { get; set; }
    public string? ReceiptPdfPath { get; set; }
    public string? ReceiptPdfUrl { get; set; }
    public bool EmailSent { get; set; }
    public DateTime? EmailSentAt { get; set; }

    // Payment details
    public PaymentDetailsForReceiptDto Payment { get; set; } = null!;
}

/// <summary>
/// Payment details for receipt
/// </summary>
public class PaymentDetailsForReceiptDto
{
    public int PaymentId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string UserEmail { get; set; } = null!;
    public decimal AmountPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? PaymentMethod { get; set; }
    public string? TransactionReference { get; set; }
    public string? Status { get; set; }
    public string InsuranceType { get; set; } = null!;
    public string SchemeName { get; set; } = null!;
}

/// <summary>
/// Receipt HTML template data
/// </summary>
public class ReceiptTemplateDataDto
{
    public string ReceiptNumber { get; set; } = null!;
    public DateTime GeneratedDate { get; set; }
    public string CustomerName { get; set; } = null!;
    public string CustomerEmail { get; set; } = null!;
    public string PolicyNumber { get; set; } = null!;
    public string InsuranceType { get; set; } = null!;
    public string SchemeName { get; set; } = null!;
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string TransactionReference { get; set; } = null!;
    public string CompanyName { get; set; } = "Insurance Service";
    public string CompanyAddress { get; set; } = "123 Insurance Street, Hanoi, Vietnam";
    public string CompanyPhone { get; set; } = "+84 24 1234 5678";
    public string CompanyEmail { get; set; } = "support@insurance.com";
}
