using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PolicyDetailsMedical
{
    public int DetailId { get; set; }

    public int? PolicyId { get; set; }

    public string? PreExistingDiseases { get; set; }

    public string? HospitalNetworkTier { get; set; }

    public bool? IsFamilyFloater { get; set; }

    public virtual Policy? Policy { get; set; }
}
