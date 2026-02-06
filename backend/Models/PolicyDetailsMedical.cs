using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PolicyDetailsMedical
{
    [Key]
    public int DetailId { get; set; }

    [ForeignKey("Policy")]
    public int? PolicyId { get; set; }

    [MaxLength(500)]
    public string? PreExistingDiseases { get; set; }

    [MaxLength(50)]
    public string? HospitalNetworkTier { get; set; }

    public bool? IsFamilyFloater { get; set; } = false;

    public virtual Policy? Policy { get; set; }
}
