using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class NotificationService : INotificationService
{
    private readonly InsuranceDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        InsuranceDbContext context, 
        IEmailService emailService,
        ILogger<NotificationService> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto)
    {
        var notification = new Notification
        {
            UserId = dto.UserId,
            Title = dto.Title,
            Message = dto.Message,
            NotificationType = dto.NotificationType,
            RelatedEntityId = dto.RelatedEntityId,
            RelatedEntityType = dto.RelatedEntityType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Send email if requested
        if (dto.SendEmail)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user != null)
            {
                var emailSent = await _emailService.SendNotificationEmailAsync(
                    user.Email, 
                    user.FullName, 
                    dto.Title, 
                    dto.Message);

                if (emailSent)
                {
                    notification.EmailSent = true;
                    notification.EmailSentAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }
        }

        return MapToDto(notification);
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false)
    {
        var query = _context.Notifications
            .Where(n => n.UserId == userId);

        if (unreadOnly)
            query = query.Where(n => !n.IsRead);

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(100) // Limit to 100 notifications
            .ToListAsync();

        return notifications.Select(MapToDto);
    }

    public async Task<NotificationSummaryDto> GetNotificationSummaryAsync(int userId)
    {
        var totalCount = await _context.Notifications.CountAsync(n => n.UserId == userId);
        var unreadCount = await _context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);

        var recentNotifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(10)
            .ToListAsync();

        return new NotificationSummaryDto
        {
            TotalCount = totalCount,
            UnreadCount = unreadCount,
            RecentNotifications = recentNotifications.Select(MapToDto).ToList()
        };
    }

    public async Task<bool> MarkAsReadAsync(int userId, List<int> notificationIds)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && notificationIds.Contains(n.NotificationId))
            .ToListAsync();

        if (!notifications.Any())
            return false;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAllAsReadAsync(int userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        if (!notifications.Any())
            return false;

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteNotificationAsync(int notificationId, int userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.NotificationId == notificationId && n.UserId == userId);

        if (notification == null)
            return false;

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task CreatePremiumDueNotificationAsync(int userId, int policyId, string policyNumber, decimal amount, DateOnly dueDate)
    {
        var message = $"Your premium payment of {amount:N0} VND for policy {policyNumber} is due on {dueDate:dd/MM/yyyy}. Please ensure timely payment to keep your policy active.";

        var dto = new CreateNotificationDto
        {
            UserId = userId,
            Title = "Premium Payment Reminder",
            Message = message,
            NotificationType = "PremiumDue",
            RelatedEntityId = policyId,
            RelatedEntityType = "Policy",
            SendEmail = true
        };

        await CreateNotificationAsync(dto);

        // Send specific email
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendPremiumDueReminderAsync(user.Email, policyNumber, amount, dueDate);
        }
    }

    public async Task CreatePolicyExpiryNotificationAsync(int userId, int policyId, string policyNumber, DateOnly expiryDate)
    {
        var daysUntilExpiry = expiryDate.DayNumber - DateOnly.FromDateTime(DateTime.UtcNow).DayNumber;
        var message = $"Your insurance policy {policyNumber} will expire on {expiryDate:dd/MM/yyyy} ({daysUntilExpiry} days). Please contact us to renew your policy.";

        var dto = new CreateNotificationDto
        {
            UserId = userId,
            Title = "Policy Expiry Notification",
            Message = message,
            NotificationType = "PolicyExpiry",
            RelatedEntityId = policyId,
            RelatedEntityType = "Policy",
            SendEmail = true
        };

        await CreateNotificationAsync(dto);

        // Send specific email
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendPolicyExpiryReminderAsync(user.Email, policyNumber, expiryDate);
        }
    }

    public async Task CreateClaimStatusNotificationAsync(int userId, int claimId, string status, string? comment = null)
    {
        var message = $"Your claim (ID: {claimId}) status has been updated to: {status}.";
        if (!string.IsNullOrEmpty(comment))
            message += $" Comment: {comment}";

        var dto = new CreateNotificationDto
        {
            UserId = userId,
            Title = $"Claim Status Update - {status}",
            Message = message,
            NotificationType = "ClaimUpdate",
            RelatedEntityId = claimId,
            RelatedEntityType = "Claim",
            SendEmail = false
        };

        await CreateNotificationAsync(dto);

        // Send specific email
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendClaimStatusUpdateAsync(user.Email, claimId.ToString(), status, comment);
        }
    }

    public async Task CreateLoanStatusNotificationAsync(int userId, int loanId, string status)
    {
        var message = $"Your policy loan application (ID: {loanId}) status has been updated to: {status}.";

        var dto = new CreateNotificationDto
        {
            UserId = userId,
            Title = $"Loan Status Update - {status}",
            Message = message,
            NotificationType = "LoanUpdate",
            RelatedEntityId = loanId,
            RelatedEntityType = "Loan",
            SendEmail = true
        };

        await CreateNotificationAsync(dto);
    }

    private NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            NotificationId = notification.NotificationId,
            UserId = notification.UserId,
            Title = notification.Title,
            Message = notification.Message,
            NotificationType = notification.NotificationType,
            RelatedEntityId = notification.RelatedEntityId,
            RelatedEntityType = notification.RelatedEntityType,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            ReadAt = notification.ReadAt,
            EmailSent = notification.EmailSent
        };
    }
}
