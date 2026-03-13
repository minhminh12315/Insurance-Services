using System;
using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.Models;

public class UserOtp
{
    [Key]
    public int OtpId { get; set; }

    [Required]
    public string Email { get; set; } = null!;

    [Required]
    public string OtpCode { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public bool IsUsed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
