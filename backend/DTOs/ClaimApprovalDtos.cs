using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Claim approval action
/// </summary>
public class ClaimApprovalActionDto
{
    [Required]
    public string Action { get; set; } = null!; // UnderReview, Requested, Approved, Rejected

    [StringLength(1000)]
    public string? Comments { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? ApprovedAmount { get; set; } // Required if Action is Approved

    public string? DocumentsVerified { get; set; }

    public string? RejectionReason { get; set; } // Required if Action is Rejected
}

/// <summary>
/// Claim approval history entry
/// </summary>
public class ClaimApprovalHistoryDto
{
    public int ApprovalId { get; set; }
    public int ClaimId { get; set; }
    public int ApprovedBy { get; set; }
    public string ApproverName { get; set; } = null!;
    public string ApproverRole { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string PreviousStatus { get; set; } = null!;
    public string NewStatus { get; set; } = null!;
    public string? Comments { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public DateTime ActionDate { get; set; }
    public string? DocumentsVerified { get; set; }
    public string? RejectionReason { get; set; }
}

/// <summary>
/// Complete claim details with approval workflow
/// </summary>
public class ClaimWithWorkflowDto
{
    public int ClaimId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public DateOnly ClaimDate { get; set; }
    public decimal ClaimAmount { get; set; }
    public string Reason { get; set; } = null!;
    public string? Status { get; set; }
    public string? AdminComment { get; set; }
    public string? DocumentPath { get; set; }
    public string? DocumentUrl { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<ClaimApprovalHistoryDto> ApprovalHistory { get; set; } = new();
    public int ApprovalStepsCount { get; set; }
    public string CurrentApprovalStage { get; set; } = null!;
    public bool CanApprove { get; set; }
    public bool CanReject { get; set; }
}

/// <summary>
/// Mark claim as paid
/// </summary>
public class MarkClaimPaidDto
{
    [Required]
    public string PaymentMethod { get; set; } = null!; // Bank Transfer, Cheque, etc.

    [Required]
    public string PaymentReference { get; set; } = null!;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal PaidAmount { get; set; }

    public string? PaymentNotes { get; set; }
}
