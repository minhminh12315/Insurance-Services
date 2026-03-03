using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

/// <summary>
/// Request to renew a policy
/// </summary>
public class CreatePolicyRenewalDto
{
    [Required]
    public int PolicyId { get; set; }

    [Required]
    [Range(1, 50, ErrorMessage = "Renewal term must be between 1 and 50 years")]
    public int RenewalTermYears { get; set; }

    public string? RenewalNotes { get; set; }
}

/// <summary>
/// Policy renewal details response
/// </summary>
public class PolicyRenewalDto
{
    public int RenewalId { get; set; }
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public DateOnly RenewalDate { get; set; }
    public DateOnly PreviousMaturityDate { get; set; }
    public DateOnly NewMaturityDate { get; set; }
    public decimal PreviousPremium { get; set; }
    public decimal NewPremium { get; set; }
    public int RenewalTermYears { get; set; }
    public string? RenewalStatus { get; set; }
    public string? RenewalNotes { get; set; }
    public DateTime? RequestedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int? ProcessedBy { get; set; }
    public string? ProcessedByName { get; set; }
}

/// <summary>
/// Preview renewal calculation before confirming
/// </summary>
public class RenewalCalculationDto
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = null!;
    public DateOnly CurrentMaturityDate { get; set; }
    public DateOnly ProposedMaturityDate { get; set; }
    public decimal CurrentPremium { get; set; }
    public decimal ProposedPremium { get; set; }
    public decimal PremiumIncrease { get; set; }
    public decimal PremiumIncreasePercentage { get; set; }
    public int CurrentAge { get; set; }
    public int ProposedTermYears { get; set; }
    public string? AgeFactorMessage { get; set; }
}

/// <summary>
/// Process renewal request (Admin/Employee)
/// </summary>
public class ProcessRenewalDto
{
    [Required]
    public string Action { get; set; } = null!; // Approve, Reject

    public string? AdminNotes { get; set; }
}
