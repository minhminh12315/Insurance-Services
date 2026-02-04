using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PolicyDetailsHome
{
    public int DetailId { get; set; }

    public int? PolicyId { get; set; }

    public string PropertyAddress { get; set; } = null!;

    public decimal? PropertyValue { get; set; }

    public string? StructureType { get; set; }

    public int? BuiltYear { get; set; }

    public virtual Policy? Policy { get; set; }
}
