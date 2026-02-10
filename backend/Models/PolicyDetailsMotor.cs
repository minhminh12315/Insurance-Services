using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class PolicyDetailsMotor
{
    [Key]
    public int DetailId { get; set; }

    [ForeignKey("Policy")]
    public int? PolicyId { get; set; }

    [MaxLength(20)]
    public string? VehicleRegNumber { get; set; }

    [MaxLength(100)]
    public string? VehicleModel { get; set; }

    [MaxLength(50)]
    public string? VehicleType { get; set; }

    [MaxLength(50)]
    public string? EngineNumber { get; set; }

    [MaxLength(50)]
    public string? ChassisNumber { get; set; }

    public int? ManufacturingYear { get; set; }

    public virtual Policy? Policy { get; set; }
}
