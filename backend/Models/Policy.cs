using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class Policy
{
    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public int SchemeId { get; set; }

    public string PolicyNumber { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly MaturityDate { get; set; }

    public int TermYears { get; set; }

    public string PaymentFrequency { get; set; } = null!;

    public decimal SumAssured { get; set; }

    public decimal PremiumAmount { get; set; }

    public string? PolicyStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();

    public virtual PolicyDetailsHome? PolicyDetailsHome { get; set; }

    public virtual PolicyDetailsLife? PolicyDetailsLife { get; set; }

    public virtual PolicyDetailsMedical? PolicyDetailsMedical { get; set; }

    public virtual PolicyDetailsMotor? PolicyDetailsMotor { get; set; }

    public virtual ICollection<PolicyLoan> PolicyLoans { get; set; } = new List<PolicyLoan>();

    public virtual ICollection<PremiumPayment> PremiumPayments { get; set; } = new List<PremiumPayment>();

    public virtual InsuranceScheme Scheme { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
