using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class InsuranceCategoryDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SchemeCount { get; set; }
}

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Category name is required")]
    [MaxLength(50, ErrorMessage = "Category name cannot exceed 50 characters")]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }
}

public class UpdateCategoryDto
{
    [Required(ErrorMessage = "Category name is required")]
    [MaxLength(50, ErrorMessage = "Category name cannot exceed 50 characters")]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }
}
