using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsuranceCategoryController : ControllerBase
{
    private readonly IInsuranceCategoryService _categoryService;

    public InsuranceCategoryController(IInsuranceCategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Get all insurance categories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InsuranceCategoryDto>>> GetAllCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(new { success = true, data = categories });
    }

    /// <summary>
    /// Get insurance category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InsuranceCategoryDto>> GetCategoryById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
            return NotFound(new { success = false, message = "Category not found" });

        return Ok(new { success = true, data = category });
    }

    /// <summary>
    /// Create new insurance category (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<InsuranceCategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var category = await _categoryService.CreateCategoryAsync(dto);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryId },
            new { success = true, message = "Category created successfully", data = category });
    }

    /// <summary>
    /// Update insurance category (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<InsuranceCategoryDto>> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var category = await _categoryService.UpdateCategoryAsync(id, dto);
        if (category == null)
            return NotFound(new { success = false, message = "Category not found" });

        return Ok(new { success = true, message = "Category updated successfully", data = category });
    }

    /// <summary>
    /// Delete insurance category (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Category not found" });

            return Ok(new { success = true, message = "Category deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
