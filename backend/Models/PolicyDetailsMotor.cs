using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PolicyDetailsMotor
{
    public int DetailId { get; set; }

    public int? PolicyId { get; set; }

    public string? VehicleRegNumber { get; set; }

    public string? VehicleModel { get; set; }

    public string? VehicleType { get; set; }

    public string? EngineNumber { get; set; }

    public string? ChassisNumber { get; set; }

    public int? ManufacturingYear { get; set; }

    public virtual Policy? Policy { get; set; }
}
