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
    
    // Annual Limits
    public decimal? AnnualLimit { get; set; }
    
    public decimal? UsedAmount { get; set; }
    
    // Detailed Coverage Limits
    public decimal? RoomAndBoardLimit { get; set; }
    
    public decimal? SurgeryLimit { get; set; }
    
    public decimal? OutpatientLimit { get; set; }
    
    public decimal? DentalLimit { get; set; }
    
    public decimal? MaternityLimit { get; set; }
    
    // Additional Features
    public bool? HasDirectBilling { get; set; }
    
    public string? CardTier { get; set; } // Gold, Diamond
    
    public int? WaitingPeriodDays { get; set; }

    public virtual Policy? Policy { get; set; }
}
