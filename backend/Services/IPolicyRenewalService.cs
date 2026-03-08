using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPolicyRenewalService
{
    Task<PolicyRenewalDto?> CreateRenewalRequestAsync(int userId, CreatePolicyRenewalDto dto);
    Task<RenewalCalculationDto?> CalculateRenewalAsync(int policyId, int renewalTermYears);
    Task<PolicyRenewalDto?> GetRenewalByIdAsync(int renewalId);
    Task<List<PolicyRenewalDto>> GetUserRenewalsAsync(int userId);
    Task<List<PolicyRenewalDto>> GetPendingRenewalsAsync();
    Task<PolicyRenewalDto?> ProcessRenewalAsync(int renewalId, int processedBy, ProcessRenewalDto dto);
}
