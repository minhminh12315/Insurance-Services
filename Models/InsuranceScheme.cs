using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class InsuranceScheme
{
    public int SchemeId { get; set; }

    public int? CategoryId { get; set; }

    public string SchemeName { get; set; } = null!;

    public string? Description { get; set; }

    public int? MinTerm { get; set; }

    public int? MaxTerm { get; set; }

    public decimal? MinInvestmentAmount { get; set; }

    public decimal? MaxInvestmentAmount { get; set; }

    public decimal? ProfitRatio { get; set; }

    public DateOnly? NewLaunchDate { get; set; }

    public bool? IsActive { get; set; }

    public virtual InsuranceCategory? Category { get; set; }

    public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
}
