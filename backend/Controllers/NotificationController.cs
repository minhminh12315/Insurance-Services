using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// Get current user's notifications
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetMyNotifications([FromQuery] bool unreadOnly = false)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var notifications = await _notificationService.GetUserNotificationsAsync(userId, unreadOnly);
        return Ok(new { success = true, data = notifications });
    }

    /// <summary>
    /// Get notification summary (count, recent notifications)
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult> GetNotificationSummary()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var summary = await _notificationService.GetNotificationSummaryAsync(userId);
        return Ok(new { success = true, data = summary });
    }

    /// <summary>
    /// Mark notifications as read
    /// </summary>
    [HttpPost("mark-read")]
    public async Task<ActionResult> MarkAsRead([FromBody] MarkNotificationReadDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var result = await _notificationService.MarkAsReadAsync(userId, dto.NotificationIds);
        if (!result)
            return NotFound(new { success = false, message = "Notifications not found" });

        return Ok(new { success = true, message = "Notifications marked as read" });
    }

    /// <summary>
    /// Mark all notifications as read
    /// </summary>
    [HttpPost("mark-all-read")]
    public async Task<ActionResult> MarkAllAsRead()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(new { success = true, message = "All notifications marked as read" });
    }

    /// <summary>
    /// Delete a notification
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNotification(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var result = await _notificationService.DeleteNotificationAsync(id, userId);
        if (!result)
            return NotFound(new { success = false, message = "Notification not found" });

        return Ok(new { success = true, message = "Notification deleted" });
    }

    /// <summary>
    /// Create notification (Admin/Employee only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var notification = await _notificationService.CreateNotificationAsync(dto);
        return Ok(new { success = true, message = "Notification created", data = notification });
    }
}
