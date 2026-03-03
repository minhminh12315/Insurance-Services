using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPolicyRiderService
{
    Task<IEnumerable<PolicyRiderDto>> GetPolicyRidersAsync(int policyId);
    Task<PolicyRiderDto?> GetRiderByIdAsync(int riderId);
    Task<PolicyRiderDto> CreateRiderAsync(CreatePolicyRiderDto dto);
    Task<PolicyRiderDto?> UpdateRiderAsync(int riderId, UpdatePolicyRiderDto dto);
    Task<bool> DeleteRiderAsync(int riderId);
    Task<List<RiderTemplateDto>> GetAvailableRiderTemplatesAsync(string categoryType);
}
