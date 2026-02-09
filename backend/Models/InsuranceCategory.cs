using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.Models;

public class InsuranceCategory
{
    [Key]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(50)]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public ICollection<InsuranceScheme> InsuranceSchemes { get; set; }
        = new List<InsuranceScheme>();

}
