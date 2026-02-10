using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class InsuranceCategory
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<InsuranceScheme> InsuranceSchemes { get; set; } = new List<InsuranceScheme>();
}
