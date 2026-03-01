using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class PremiumPayment
{
    public int PaymentId { get; set; }

    public int PolicyId { get; set; }

    public int UserId { get; set; }

    public decimal AmountPaid { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentMethod { get; set; }

    public string? TransactionReference { get; set; }

    public string? Status { get; set; }

    public virtual Policy Policy { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
