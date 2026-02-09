using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class InsuranceCategoryService : IInsuranceCategoryService
{
    private readonly InsuranceDbContext _context;

    public InsuranceCategoryService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InsuranceCategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _context.InsuranceCategories
            .Include(c => c.InsuranceSchemes)
            .ToListAsync();

        return categories.Select(c => new InsuranceCategoryDto
        {
            CategoryId = c.CategoryId,
            CategoryName = c.CategoryName,
            Description = c.Description,
            SchemeCount = c.InsuranceSchemes?.Count ?? 0
        });
    }

    public async Task<InsuranceCategoryDto?> GetCategoryByIdAsync(int categoryId)
    {
        var category = await _context.InsuranceCategories
            .Include(c => c.InsuranceSchemes)
            .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

        if (category == null)
            return null;

        return new InsuranceCategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            SchemeCount = category.InsuranceSchemes?.Count ?? 0
        };
    }

    public async Task<InsuranceCategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = new InsuranceCategory
        {
            CategoryName = dto.CategoryName,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.InsuranceCategories.Add(category);
        await _context.SaveChangesAsync();

        return new InsuranceCategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            SchemeCount = 0
        };
    }

    public async Task<InsuranceCategoryDto?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto)
    {
        var category = await _context.InsuranceCategories.FindAsync(categoryId);
        if (category == null)
            return null;

        category.CategoryName = dto.CategoryName;
        category.Description = dto.Description;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var schemes = await _context.InsuranceSchemes
            .Where(s => s.CategoryId == categoryId)
            .CountAsync();

        return new InsuranceCategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            SchemeCount = schemes
        };
    }

    public async Task<bool> DeleteCategoryAsync(int categoryId)
    {
        var category = await _context.InsuranceCategories.FindAsync(categoryId);
        if (category == null)
            return false;

        // Check if category has schemes
        var hasSchemes = await _context.InsuranceSchemes
            .AnyAsync(s => s.CategoryId == categoryId);

        if (hasSchemes)
            return false; // Cannot delete category with schemes

        _context.InsuranceCategories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }
}
