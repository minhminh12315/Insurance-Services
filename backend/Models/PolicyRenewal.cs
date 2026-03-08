using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Policy renewal tracking
/// </summary>
public partial class PolicyRenewal
{
    public int RenewalId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public DateOnly RenewalDate { get; set; }

    public DateOnly PreviousMaturityDate { get; set; }

    public DateOnly NewMaturityDate { get; set; }

    public decimal PreviousPremium { get; set; }

    public decimal NewPremium { get; set; }

    public int RenewalTermYears { get; set; }

    public string? RenewalStatus { get; set; } // Pending, Approved, Rejected, Completed

    public string? RenewalNotes { get; set; }

    public DateTime? RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public int? ProcessedBy { get; set; }

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
