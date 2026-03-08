using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(EmailMessage message);
    Task<bool> SendNotificationEmailAsync(string toEmail, string toName, string title, string message);
    Task<bool> SendPremiumDueReminderAsync(string toEmail, string policyNumber, decimal amount, DateOnly dueDate);
    Task<bool> SendPolicyExpiryReminderAsync(string toEmail, string policyNumber, DateOnly expiryDate);
    Task<bool> SendClaimStatusUpdateAsync(string toEmail, string claimId, string status, string? comment);
}
