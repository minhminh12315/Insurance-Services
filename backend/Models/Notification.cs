using System;

namespace InsuranceService.API.Models;

public class Notification
{
    public int NotificationId { get; set; }
    
    public int UserId { get; set; }
    
    public string Title { get; set; } = null!;
    
    public string Message { get; set; } = null!;
    
    public string NotificationType { get; set; } = null!; // PremiumDue, PolicyExpiry, ClaimUpdate, General
    
    public int? RelatedEntityId { get; set; } // PolicyId, ClaimId, etc.
    
    public string? RelatedEntityType { get; set; } // Policy, Claim, Payment
    
    public bool IsRead { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? ReadAt { get; set; }
    
    public bool EmailSent { get; set; } = false;
    
    public DateTime? EmailSentAt { get; set; }

    public virtual User User { get; set; } = null!;
}
