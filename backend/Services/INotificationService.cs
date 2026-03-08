using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface INotificationService
{
    Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto);
    Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false);
    Task<NotificationSummaryDto> GetNotificationSummaryAsync(int userId);
    Task<bool> MarkAsReadAsync(int userId, List<int> notificationIds);
    Task<bool> MarkAllAsReadAsync(int userId);
    Task<bool> DeleteNotificationAsync(int notificationId, int userId);
    
    // Helper methods for creating specific notification types
    Task CreatePremiumDueNotificationAsync(int userId, int policyId, string policyNumber, decimal amount, DateOnly dueDate);
    Task CreatePolicyExpiryNotificationAsync(int userId, int policyId, string policyNumber, DateOnly expiryDate);
    Task CreateClaimStatusNotificationAsync(int userId, int claimId, string status, string? comment = null);
    Task CreateLoanStatusNotificationAsync(int userId, int loanId, string status);
}
