using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IInsuranceSchemeService
{
    Task<IEnumerable<InsuranceSchemeDto>> GetAllSchemesAsync(int? categoryId = null, bool? isActive = null);
    Task<InsuranceSchemeDto?> GetSchemeByIdAsync(int schemeId);
    Task<InsuranceSchemeDto> CreateSchemeAsync(CreateSchemeDto dto);
    Task<InsuranceSchemeDto?> UpdateSchemeAsync(int schemeId, UpdateSchemeDto dto);
    Task<bool> DeleteSchemeAsync(int schemeId);
    Task<PremiumCalculationResultDto?> CalculatePremiumAsync(CalculatePremiumRequestDto request);
}
