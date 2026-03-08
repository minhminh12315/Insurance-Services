using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class NotificationDto
{
    public int NotificationId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string NotificationType { get; set; } = null!;
    public int? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool EmailSent { get; set; }
}

public class CreateNotificationDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string NotificationType { get; set; } = null!;

    public int? RelatedEntityId { get; set; }

    [StringLength(50)]
    public string? RelatedEntityType { get; set; }

    public bool SendEmail { get; set; } = false;
}

public class MarkNotificationReadDto
{
    [Required]
    public List<int> NotificationIds { get; set; } = new();
}

public class NotificationSummaryDto
{
    public int TotalCount { get; set; }
    public int UnreadCount { get; set; }
    public List<NotificationDto> RecentNotifications { get; set; } = new();
}
