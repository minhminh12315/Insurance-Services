using System;

namespace InsuranceService.API.Models;

/// <summary>
/// Claim approval workflow audit trail
/// </summary>
public partial class ClaimApprovalHistory
{
    public int ApprovalId { get; set; }

    public int ClaimId { get; set; }

    public int ApprovedBy { get; set; } // User ID of approver

    public string Action { get; set; } = null!; // Submitted, UnderReview, Requested, Approved, Rejected, Paid

    public string PreviousStatus { get; set; } = null!;

    public string NewStatus { get; set; } = null!;

    public string? Comments { get; set; }

    public decimal? ApprovedAmount { get; set; } // May differ from claim amount

    public DateTime ActionDate { get; set; }

    public string? DocumentsVerified { get; set; } // JSON or comma-separated list

    public string? RejectionReason { get; set; }

    public virtual Claim Claim { get; set; } = null!;

    public virtual User Approver { get; set; } = null!;
}
