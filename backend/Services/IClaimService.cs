using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IClaimService
{
    Task<IEnumerable<ClaimDto>> GetAllClaimsAsync(int? userId = null, string? status = null);
    Task<ClaimDto?> GetClaimByIdAsync(int claimId);
    Task<IEnumerable<ClaimDto>> GetUserClaimsAsync(int userId);
    Task<ClaimDto> CreateClaimAsync(int userId, CreateClaimDto dto);
    Task<ClaimDto?> UpdateClaimStatusAsync(int claimId, UpdateClaimStatusDto dto);
}
