using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PolicyDetailsLife
{
    public int DetailId { get; set; }

    public int? PolicyId { get; set; }

    public string? NomineeName { get; set; }

    public string? NomineeRelation { get; set; }

    public virtual Policy? Policy { get; set; }
}
