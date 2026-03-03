using System;

namespace InsuranceService.API.Models;

public class PolicyRider
{
    public int RiderId { get; set; }
    
    public int PolicyId { get; set; }
    
    public string RiderName { get; set; } = null!;
    
    public string RiderType { get; set; } = null!; // AccidentGuard, CriticalIllness, WaiverOfPremium, Hydrostatic, PartsTheft, etc.
    
    public string? Description { get; set; }
    
    public decimal RiderPremium { get; set; }
    
    public decimal? CoverageAmount { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Policy Policy { get; set; } = null!;
}
