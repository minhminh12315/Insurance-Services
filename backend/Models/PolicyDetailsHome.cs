using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PolicyDetailsHome
{
    [Key]
    public int DetailId { get; set; }

    [ForeignKey("Policy")]
    public int? PolicyId { get; set; }

    [Required]
    [MaxLength(255)]
    public string PropertyAddress { get; set; } = null!;

    [Column(TypeName = "decimal(15,2)")]
    public decimal? PropertyValue { get; set; }

    [MaxLength(50)]
    public string? StructureType { get; set; }

        public int? BuiltYear { get; set; }

        public virtual Policy? Policy { get; set; }
    }
