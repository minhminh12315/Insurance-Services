using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Policy surrender requests and calculations
/// </summary>
public partial class PolicySurrender
{
    public int SurrenderId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public DateOnly RequestDate { get; set; }

    public decimal TotalPremiumPaid { get; set; }

    public decimal SurrenderValue { get; set; } // Calculated surrender value

    public decimal SurrenderCharges { get; set; } // Penalty/charges

    public decimal NetPayable { get; set; } // Surrender value - charges

    public int PolicyHeldYears { get; set; }

    public int PolicyHeldMonths { get; set; }

    public string? SurrenderStatus { get; set; } // Pending, Approved, Rejected, Paid

    public string? SurrenderReason { get; set; }

    public string? AdminNotes { get; set; }

    public DateTime? RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public int? ProcessedBy { get; set; }

    public string? PaymentMethod { get; set; } // Bank Transfer, Cheque, etc.

    public string? PaymentReference { get; set; }

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
