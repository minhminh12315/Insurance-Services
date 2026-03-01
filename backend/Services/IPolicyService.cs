using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPolicyService
{
    Task<IEnumerable<PolicyDto>> GetAllPoliciesAsync(int? userId = null, string? status = null);
    Task<PolicyDto?> GetPolicyByIdAsync(int policyId);
    Task<PolicyDto?> GetPolicyByNumberAsync(string policyNumber);
    Task<IEnumerable<PolicyDto>> GetUserPoliciesAsync(int userId, bool activeOnly = false);
    Task<PolicyDto> CreatePolicyAsync(int userId, CreatePolicyDto dto);
    Task<PolicyDto?> UpdatePolicyStatusAsync(int policyId, UpdatePolicyStatusDto dto);
    Task<bool> CancelPolicyAsync(int policyId, int userId);
}
