using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicInteractionController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<PublicInteractionController> _logger;

    public PublicInteractionController(
        IEmailService emailService, 
        IOptions<EmailSettings> emailSettings,
        ILogger<PublicInteractionController> logger)
    {
        _emailService = emailService;
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    [HttpPost("contact")]
    public async Task<ActionResult> SubmitContact([FromBody] ContactDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data" });

        var adminEmail = _emailSettings.SmtpUsername; // Default to using the SMTP username as admin email
        if (string.IsNullOrEmpty(adminEmail)) adminEmail = "admin@insurance.com";

        var body = $@"
            <h3>New Contact Query</h3>
            <p><strong>Name:</strong> {dto.Name}</p>
            <p><strong>Email:</strong> {dto.Email}</p>
            <p><strong>Subject:</strong> {dto.Subject}</p>
            <p><strong>Message:</strong><br/>{dto.Message}</p>
        ";

        var success = await _emailService.SendEmailAsync(new EmailMessage
        {
            To = adminEmail,
            ToName = "Admin",
            Subject = $"Contact Query: {dto.Subject}",
            Body = body,
            IsHtml = true
        });

        if (success)
            return Ok(new { success = true, message = "Your message has been sent successfully!" });
        
        return StatusCode(500, new { success = false, message = "Failed to send message. Please try again later." });
    }
}
