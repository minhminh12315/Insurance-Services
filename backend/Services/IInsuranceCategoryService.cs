using InsuranceService.API.DTOs;
using InsuranceService.API.DTOs.Category;

namespace InsuranceService.API.Services;

public interface IInsuranceCategoryService
{
    // Simple DTO-based methods used by newer controller
    Task<IEnumerable<InsuranceCategoryDto>> GetAllCategoriesAsync();
    Task<InsuranceCategoryDto?> GetCategoryByIdAsync(int categoryId);
    Task<InsuranceCategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<InsuranceCategoryDto?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto);
    Task<bool> DeleteCategoryAsync(int categoryId);

    // Paged / request-response methods used by legacy controller
    Task<PagedResult<InsuranceCategoryResponseDto>> GetAllCategoriesAsync(int pageNumber, int pageSize, string searchTerm);
    Task<InsuranceCategoryResponseDto> CreateCategoryAsync(InsuranceCategoryRequestDto request);
    Task<InsuranceCategoryResponseDto?> GetByIdAsync(int id);
    Task<InsuranceCategoryResponseDto?> UpdateAsync(int id, InsuranceCategoryRequestDto request);
    Task<bool> DeleteAsync(int categoryId);
}
