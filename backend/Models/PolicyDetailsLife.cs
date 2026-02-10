using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PolicyDetailsLife
{
    [Key]
    public int DetailId { get; set; }

    [ForeignKey("Policy")]
    public int? PolicyId { get; set; }

    [MaxLength(100)]
    public string? NomineeName { get; set; }

    [MaxLength(50)]
    public string? NomineeRelation { get; set; }

    public virtual Policy? Policy { get; set; }
}
