using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IClaimApprovalService
{
    Task<ClaimApprovalHistoryDto> ProcessClaimActionAsync(int claimId, int approvedBy, ClaimApprovalActionDto dto);
    Task<ClaimWithWorkflowDto?> GetClaimWithWorkflowAsync(int claimId);
    Task<List<ClaimApprovalHistoryDto>> GetClaimApprovalHistoryAsync(int claimId);
    Task<List<ClaimWithWorkflowDto>> GetClaimsForApprovalAsync(string? status = null);
    Task<ClaimApprovalHistoryDto> MarkClaimAsPaidAsync(int claimId, int processedBy, MarkClaimPaidDto dto);
}
