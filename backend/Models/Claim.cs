using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class Claim
{
    public int ClaimId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public DateOnly ClaimDate { get; set; }

    public decimal ClaimAmount { get; set; }

    public string Reason { get; set; } = null!;

    public string? Status { get; set; }

    public string? AdminComment { get; set; }
    
    public string? DocumentPath { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    
    public DateTime? UpdatedAt { get; set; }

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
