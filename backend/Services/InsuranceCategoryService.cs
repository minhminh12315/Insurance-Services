using InsuranceService.API.DTOs.Category;
using InsuranceService.API.Models;
using InsuranceService.API.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System;

namespace InsuranceService.API.Services
{
    public class InsuranceCategoryService
    {
        public readonly InsuranceDbContext _context;
        public InsuranceCategoryService(InsuranceDbContext context)
        {
            _context = context;
        }


        public async Task<PagedResult<InsuranceCategoryResponseDto>> GetAllCategoriesAsync(int pageNumber, int pageSize, string searchTerm)
        {
            var query = _context.InsuranceCategories.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(c => c.CategoryName.Contains(searchTerm) || c.Description.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.UpdatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new InsuranceCategoryResponseDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName,
                    Description = c.Description,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return new PagedResult<InsuranceCategoryResponseDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<InsuranceCategoryResponseDto> CreateCategoryAsync(InsuranceCategoryRequestDto request)
        {
            var category = new InsuranceCategory
            {
                CategoryName = request.CategoryName,
                Description = request.Description,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _context.InsuranceCategories.Add(category);
            await _context.SaveChangesAsync();
            return new InsuranceCategoryResponseDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                Description = category.Description,
            };
        }

        public async Task<InsuranceCategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _context.InsuranceCategories.FindAsync(id);
            if (category == null) return null;

            return new InsuranceCategoryResponseDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                Description = category.Description,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task<InsuranceCategoryResponseDto?> UpdateAsync(int id, InsuranceCategoryRequestDto request)
        {
            var category = await _context.InsuranceCategories.FindAsync(id);
            if (category == null) return null;

            category.CategoryName = request.CategoryName;
            category.Description = request.Description;
            category.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return new InsuranceCategoryResponseDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                Description = category.Description,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(int categoryId)
        {
            var entity = await _context.InsuranceCategories
                .FindAsync(categoryId);

            if (entity == null)
                return false;

            _context.InsuranceCategories.Remove(entity);

            await _context.SaveChangesAsync();
            return true;
        }

        private bool InsuranceCategoryExists(int id)
        {
            return _context.InsuranceCategories.Any(e => e.CategoryId == id);
        }
    }
}