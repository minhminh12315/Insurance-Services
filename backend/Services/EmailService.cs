using InsuranceService.API.DTOs;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace InsuranceService.API.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _emailSettings = emailSettings.Value;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(EmailMessage message)
    {
        try
        {
            // If SMTP is not configured, just log and return true (for development)
            if (string.IsNullOrEmpty(_emailSettings.SmtpUsername))
            {
                _logger.LogWarning("Email service not configured. Email would be sent to: {Email}", message.To);
                _logger.LogInformation("Subject: {Subject}", message.Subject);
                _logger.LogInformation("Body: {Body}", message.Body);
                return true;
            }

            using var smtpClient = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort)
            {
                EnableSsl = _emailSettings.EnableSsl,
                Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                Subject = message.Subject,
                Body = message.Body,
                IsBodyHtml = message.IsHtml
            };

            mailMessage.To.Add(new MailAddress(message.To, message.ToName ?? message.To));

            await smtpClient.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent successfully to {Email}", message.To);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", message.To);
            return false;
        }
    }

    public async Task<bool> SendNotificationEmailAsync(string toEmail, string toName, string title, string message)
    {
        var emailBody = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;'>
                    <h2 style='color: #2c3e50;'>{title}</h2>
                    <p style='color: #34495e; line-height: 1.6;'>{message}</p>
                    <hr style='margin: 20px 0; border: none; border-top: 1px solid #eee;'>
                    <p style='color: #7f8c8d; font-size: 12px;'>
                        This is an automated message from Insurance Service. Please do not reply to this email.
                    </p>
                </div>
            </body>
            </html>
        ";

        var emailMessage = new EmailMessage
        {
            To = toEmail,
            ToName = toName,
            Subject = title,
            Body = emailBody,
            IsHtml = true
        };

        return await SendEmailAsync(emailMessage);
    }

    public async Task<bool> SendPremiumDueReminderAsync(string toEmail, string policyNumber, decimal amount, DateOnly dueDate)
    {
        var title = "Premium Payment Reminder";
        var message = $@"
            Dear Customer,<br><br>
            This is a reminder that your premium payment is due soon.<br><br>
            <strong>Policy Number:</strong> {policyNumber}<br>
            <strong>Amount Due:</strong> {amount:N0} VND<br>
            <strong>Due Date:</strong> {dueDate:dd/MM/yyyy}<br><br>
            Please ensure timely payment to keep your policy active.<br><br>
            Thank you for choosing our insurance service.
        ";

        return await SendNotificationEmailAsync(toEmail, string.Empty, title, message);
    }

    public async Task<bool> SendPolicyExpiryReminderAsync(string toEmail, string policyNumber, DateOnly expiryDate)
    {
        var title = "Policy Expiry Notification";
        var message = $@"
            Dear Customer,<br><br>
            Your insurance policy is approaching its expiry date.<br><br>
            <strong>Policy Number:</strong> {policyNumber}<br>
            <strong>Expiry Date:</strong> {expiryDate:dd/MM/yyyy}<br><br>
            Please contact us to renew your policy and continue your coverage.<br><br>
            Thank you for your continued trust in our services.
        ";

        return await SendNotificationEmailAsync(toEmail, string.Empty, title, message);
    }

    public async Task<bool> SendClaimStatusUpdateAsync(string toEmail, string claimId, string status, string? comment)
    {
        var title = $"Claim Status Update - {status}";
        var message = $@"
            Dear Customer,<br><br>
            Your claim status has been updated.<br><br>
            <strong>Claim ID:</strong> {claimId}<br>
            <strong>New Status:</strong> {status}<br>
            {(!string.IsNullOrEmpty(comment) ? $"<strong>Comment:</strong> {comment}<br>" : "")}
            <br>
            Please log in to your account to view full details.<br><br>
            Thank you for your patience.
        ";

        return await SendNotificationEmailAsync(toEmail, string.Empty, title, message);
    }
}
