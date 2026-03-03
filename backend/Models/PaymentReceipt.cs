using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Payment receipt generation and tracking
/// </summary>
public partial class PaymentReceipt
{
    public int ReceiptId { get; set; }

    public int PaymentId { get; set; }

    public string ReceiptNumber { get; set; } = null!; // e.g., RCP-2026-00001

    public DateTime GeneratedAt { get; set; }

    public string? ReceiptPdfPath { get; set; } // Path to generated PDF

    public string? ReceiptHtml { get; set; } // HTML content for email

    public bool EmailSent { get; set; }

    public DateTime? EmailSentAt { get; set; }

    public virtual PremiumPayment Payment { get; set; } = null!;
}
