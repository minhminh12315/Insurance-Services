using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IInsuranceCategoryService
{
    Task<IEnumerable<InsuranceCategoryDto>> GetAllCategoriesAsync();
    Task<InsuranceCategoryDto?> GetCategoryByIdAsync(int categoryId);
    Task<InsuranceCategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<InsuranceCategoryDto?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto);
    Task<bool> DeleteCategoryAsync(int categoryId);
}
