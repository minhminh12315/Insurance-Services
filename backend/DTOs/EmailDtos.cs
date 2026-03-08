using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class EmailSettings
{
    public string SmtpHost { get; set; } = "smtp.gmail.com";
    public int SmtpPort { get; set; } = 587;
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public string FromEmail { get; set; } = "noreply@insurance.com";
    public string FromName { get; set; } = "Insurance Service";
    public bool EnableSsl { get; set; } = true;
}

public class EmailMessage
{
    [Required]
    [EmailAddress]
    public string To { get; set; } = null!;

    public string? ToName { get; set; }

    [Required]
    public string Subject { get; set; } = null!;

    [Required]
    public string Body { get; set; } = null!;

    public bool IsHtml { get; set; } = true;
}
