using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Request to surrender a policy
/// </summary>
public class CreatePolicySurrenderDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [StringLength(500)]
    public string SurrenderReason { get; set; } = null!;

    [StringLength(100)]
    public string? PreferredPaymentMethod { get; set; } // Bank Transfer, Cheque
}

/// <summary>
/// Policy surrender calculation preview
/// </summary>
public class SurrenderCalculationDto
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public DateOnly PolicyStartDate { get; set; }
    public DateOnly PolicyMaturityDate { get; set; }
    public int PolicyHeldYears { get; set; }
    public int PolicyHeldMonths { get; set; }
    public decimal TotalPremiumPaid { get; set; }
    public decimal SurrenderValue { get; set; }
    public decimal SurrenderCharges { get; set; }
    public decimal SurrenderChargePercentage { get; set; }
    public decimal NetPayable { get; set; }
    public string SurrenderPolicy { get; set; } = null!;
    public List<string> ImportantNotes { get; set; } = new();
}

/// <summary>
/// Policy surrender details
/// </summary>
public class PolicySurrenderDto
{
    public int SurrenderId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public DateOnly RequestDate { get; set; }
    public decimal TotalPremiumPaid { get; set; }
    public decimal SurrenderValue { get; set; }
    public decimal SurrenderCharges { get; set; }
    public decimal NetPayable { get; set; }
    public int PolicyHeldYears { get; set; }
    public int PolicyHeldMonths { get; set; }
    public string? SurrenderStatus { get; set; }
    public string? SurrenderReason { get; set; }
    public string? AdminNotes { get; set; }
    public DateTime? RequestedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int? ProcessedBy { get; set; }
    public string? ProcessedByName { get; set; }
    public string? PaymentMethod { get; set; }
    public string? PaymentReference { get; set; }
}

/// <summary>
/// Process surrender request (Admin/Employee)
/// </summary>
public class ProcessSurrenderDto
{
    [Required]
    public string Action { get; set; } = null!; // Approve, Reject

    public string? AdminNotes { get; set; }

    [StringLength(100)]
    public string? PaymentMethod { get; set; } // Required if Action is Approve

    [StringLength(200)]
    public string? PaymentReference { get; set; }
}
