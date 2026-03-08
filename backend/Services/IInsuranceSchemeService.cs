using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IInsuranceSchemeService
{
    Task<IEnumerable<InsuranceSchemeDto>> GetAllSchemesAsync(int? categoryId = null, bool? isActive = null);
    Task<PagedResult<InsuranceSchemeDto>> GetAdminSchemesAsync(int pageNumber, int pageSize, string searchTerm, int? categoryId = null);
    Task<InsuranceSchemeDto?> GetSchemeByIdAsync(int schemeId);
    Task<InsuranceSchemeDto> CreateSchemeAsync(CreateSchemeDto dto);
    Task<InsuranceSchemeDto?> UpdateSchemeAsync(int schemeId, UpdateSchemeDto dto);
    Task<bool> DeleteSchemeAsync(int schemeId);
    Task<PremiumCalculationResultDto?> CalculatePremiumAsync(CalculatePremiumRequestDto request);
}
