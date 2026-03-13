using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? OtpCode { get; set; }

    public string? NewPassword { get; set; }
}
