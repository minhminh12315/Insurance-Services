using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IBeneficiaryService
{
    Task<BeneficiaryDto> CreateBeneficiaryAsync(int userId, CreateBeneficiaryDto dto);
    Task<BeneficiaryDto?> UpdateBeneficiaryAsync(int beneficiaryId, int userId, UpdateBeneficiaryDto dto);
    Task<bool> DeleteBeneficiaryAsync(int beneficiaryId, int userId);
    Task<bool> DeactivateBeneficiaryAsync(int beneficiaryId, int userId);
    Task<BeneficiaryDto?> GetBeneficiaryByIdAsync(int beneficiaryId);
    Task<List<BeneficiaryDto>> GetPolicyBeneficiariesAsync(int policyId);
    Task<PolicyBeneficiariesSummaryDto?> GetPolicyBeneficiariesSummaryAsync(int policyId);
    Task<decimal> CalculateTotalPercentageAsync(int policyId);
}
