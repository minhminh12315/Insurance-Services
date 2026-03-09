using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class ContactDto
{
    [Required]
    public string Name { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Subject { get; set; } = null!;

    [Required]
    public string Message { get; set; } = null!;
}
