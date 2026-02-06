using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class InsuranceScheme
{
    [Key]
    public int SchemeId { get; set; }

    [ForeignKey("Category")]
    public int? CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    public string SchemeName { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    public int? MinTerm { get; set; }

    public int? MaxTerm { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal? MinInvestmentAmount { get; set; }

    [Column(TypeName = "decimal(15,2)")]
    public decimal? MaxInvestmentAmount { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? ProfitRatio { get; set; }

    public DateOnly? NewLaunchDate { get; set; }

    [Column(TypeName = "bit")]
    public bool? IsActive { get; set; } = true;

    public virtual InsuranceCategory? Category { get; set; }

    [InverseProperty("Scheme")]
    public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
}
