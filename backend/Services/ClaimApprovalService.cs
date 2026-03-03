using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class ClaimApprovalService : IClaimApprovalService
{
    private readonly InsuranceDbContext _context;
    private readonly INotificationService _notificationService;

    public ClaimApprovalService(InsuranceDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<ClaimApprovalHistoryDto> ProcessClaimActionAsync(int claimId, int approvedBy, ClaimApprovalActionDto dto)
    {
        var claim = await _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.ClaimId == claimId);

        if (claim == null)
            throw new InvalidOperationException("Claim not found");

        var previousStatus = claim.Status ?? "Pending";
        string newStatus;
        string notificationTitle;
        string notificationMessage;

        // Validate action
        switch (dto.Action.ToLower())
        {
            case "underreview":
                newStatus = "UnderReview";
                notificationTitle = "Claim Under Review";
                notificationMessage = $"Your claim #{claim.ClaimId} is now under review by our team.";
                break;

            case "requested":
                newStatus = "Requested";
                notificationTitle = "Additional Information Requested";
                notificationMessage = $"We need additional information for claim #{claim.ClaimId}. Please check the details.";
                if (string.IsNullOrEmpty(dto.Comments))
                    throw new InvalidOperationException("Comments are required when requesting additional information");
                break;

            case "approved":
                newStatus = "Approved";
                if (!dto.ApprovedAmount.HasValue || dto.ApprovedAmount.Value <= 0)
                    throw new InvalidOperationException("Approved amount is required and must be greater than 0");

                notificationTitle = "Claim Approved";
                notificationMessage = $"Great news! Your claim #{claim.ClaimId} has been approved for ₫{dto.ApprovedAmount.Value:N0}.";
                break;

            case "rejected":
                newStatus = "Rejected";
                if (string.IsNullOrEmpty(dto.RejectionReason))
                    throw new InvalidOperationException("Rejection reason is required");

                notificationTitle = "Claim Rejected";
                notificationMessage = $"Unfortunately, your claim #{claim.ClaimId} has been rejected. Reason: {dto.RejectionReason}";
                break;

            default:
                throw new InvalidOperationException("Invalid action. Use: UnderReview, Requested, Approved, or Rejected");
        }

        // Create approval history record
        var history = new ClaimApprovalHistory
        {
            ClaimId = claimId,
            ApprovedBy = approvedBy,
            Action = dto.Action,
            PreviousStatus = previousStatus,
            NewStatus = newStatus,
            Comments = dto.Comments,
            ApprovedAmount = dto.ApprovedAmount,
            ActionDate = DateTime.UtcNow,
            DocumentsVerified = dto.DocumentsVerified,
            RejectionReason = dto.RejectionReason
        };

        _context.Set<ClaimApprovalHistory>().Add(history);

        // Update claim
        claim.Status = newStatus;
        claim.UpdatedAt = DateTime.UtcNow;
        if (!string.IsNullOrEmpty(dto.Comments))
        {
            claim.AdminComment = string.IsNullOrEmpty(claim.AdminComment)
                ? dto.Comments
                : claim.AdminComment + "\n---\n" + dto.Comments;
        }

        await _context.SaveChangesAsync();

        // Send notification
        await _notificationService.CreateClaimStatusNotificationAsync(
            claim.UserId,
            claimId,
            newStatus,
            dto.Comments
        );

        // Return the created history
        return await MapHistoryToDtoAsync(history);
    }

    public async Task<ClaimWithWorkflowDto?> GetClaimWithWorkflowAsync(int claimId)
    {
        var claim = await _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.ClaimId == claimId);

        if (claim == null)
            return null;

        var history = await GetClaimApprovalHistoryAsync(claimId);

        var currentStatus = claim.Status ?? "Pending";
        bool canApprove = currentStatus is "UnderReview" or "Requested";
        bool canReject = currentStatus is "UnderReview" or "Requested" or "Pending";

        return new ClaimWithWorkflowDto
        {
            ClaimId = claim.ClaimId,
            PolicyId = claim.PolicyId,
            PolicyNumber = claim.Policy.PolicyNumber,
            UserId = claim.UserId,
            UserName = claim.User.FullName,
            ClaimDate = claim.ClaimDate,
            ClaimAmount = claim.ClaimAmount,
            Reason = claim.Reason,
            Status = claim.Status,
            AdminComment = claim.AdminComment,
            DocumentPath = claim.DocumentPath,
            DocumentUrl = string.IsNullOrEmpty(claim.DocumentPath) 
                ? null 
                : $"/Uploads/claims/{Path.GetFileName(claim.DocumentPath)}",
            CreatedAt = claim.CreatedAt,
            UpdatedAt = claim.UpdatedAt,
            ApprovalHistory = history,
            ApprovalStepsCount = history.Count,
            CurrentApprovalStage = GetApprovalStage(currentStatus),
            CanApprove = canApprove,
            CanReject = canReject
        };
    }

    public async Task<List<ClaimApprovalHistoryDto>> GetClaimApprovalHistoryAsync(int claimId)
    {
        var history = await _context.Set<ClaimApprovalHistory>()
            .Include(h => h.Approver)
            .Where(h => h.ClaimId == claimId)
            .OrderBy(h => h.ActionDate)
            .ToListAsync();

        var result = new List<ClaimApprovalHistoryDto>();
        foreach (var item in history)
        {
            result.Add(await MapHistoryToDtoAsync(item));
        }

        return result;
    }

    public async Task<List<ClaimWithWorkflowDto>> GetClaimsForApprovalAsync(string? status = null)
    {
        var query = _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(c => c.Status == status);
        }
        else
        {
            // Default: show claims that need attention
            query = query.Where(c => c.Status == "Pending" || c.Status == "UnderReview" || c.Status == "Requested");
        }

        var claims = await query
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var result = new List<ClaimWithWorkflowDto>();
        foreach (var claim in claims)
        {
            var workflow = await GetClaimWithWorkflowAsync(claim.ClaimId);
            if (workflow != null)
            {
                result.Add(workflow);
            }
        }

        return result;
    }

    public async Task<ClaimApprovalHistoryDto> MarkClaimAsPaidAsync(int claimId, int processedBy, MarkClaimPaidDto dto)
    {
        var claim = await _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.ClaimId == claimId);

        if (claim == null)
            throw new InvalidOperationException("Claim not found");

        if (claim.Status != "Approved")
            throw new InvalidOperationException("Only approved claims can be marked as paid");

        var previousStatus = claim.Status;
        var newStatus = "Paid";

        // Get the approved amount from history
        var approvedHistory = await _context.Set<ClaimApprovalHistory>()
            .Where(h => h.ClaimId == claimId && h.Action.ToLower() == "approved")
            .OrderByDescending(h => h.ActionDate)
            .FirstOrDefaultAsync();

        // Create payment history record
        var history = new ClaimApprovalHistory
        {
            ClaimId = claimId,
            ApprovedBy = processedBy,
            Action = "Paid",
            PreviousStatus = previousStatus,
            NewStatus = newStatus,
            Comments = $"Payment processed via {dto.PaymentMethod}. Reference: {dto.PaymentReference}. Amount: ₫{dto.PaidAmount:N0}. {dto.PaymentNotes}",
            ApprovedAmount = dto.PaidAmount,
            ActionDate = DateTime.UtcNow,
            DocumentsVerified = dto.PaymentReference
        };

        _context.Set<ClaimApprovalHistory>().Add(history);

        // Update claim
        claim.Status = newStatus;
        claim.UpdatedAt = DateTime.UtcNow;
        claim.AdminComment = (claim.AdminComment ?? "") + $"\nPaid: ₫{dto.PaidAmount:N0} via {dto.PaymentMethod}";

        await _context.SaveChangesAsync();

        // Send notification
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            UserId = claim.UserId,
            Title = "Claim Payment Processed",
            Message = $"Payment of ₫{dto.PaidAmount:N0} for claim #{claimId} has been processed successfully.",
            NotificationType = "ClaimUpdate",
            RelatedEntityId = claimId,
            RelatedEntityType = "Claim",
            SendEmail = true
        });

        return await MapHistoryToDtoAsync(history);
    }

    private async Task<ClaimApprovalHistoryDto> MapHistoryToDtoAsync(ClaimApprovalHistory history)
    {
        if (history.Approver == null)
        {
            history.Approver = (await _context.Users.FindAsync(history.ApprovedBy))!;
        }

        return new ClaimApprovalHistoryDto
        {
            ApprovalId = history.ApprovalId,
            ClaimId = history.ClaimId,
            ApprovedBy = history.ApprovedBy,
            ApproverName = history.Approver.FullName,
            ApproverRole = history.Approver.Role,
            Action = history.Action,
            PreviousStatus = history.PreviousStatus,
            NewStatus = history.NewStatus,
            Comments = history.Comments,
            ApprovedAmount = history.ApprovedAmount,
            ActionDate = history.ActionDate,
            DocumentsVerified = history.DocumentsVerified,
            RejectionReason = history.RejectionReason
        };
    }

    private string GetApprovalStage(string status)
    {
        return status switch
        {
            "Pending" => "Awaiting Initial Review",
            "UnderReview" => "Under Review by Claims Team",
            "Requested" => "Additional Information Required",
            "Approved" => "Approved - Pending Payment",
            "Rejected" => "Rejected - Closed",
            "Paid" => "Paid - Closed",
            _ => "Unknown Stage"
        };
    }
}
