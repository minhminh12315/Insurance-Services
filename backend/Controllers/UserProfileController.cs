using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProfileController : ControllerBase
{
    private readonly IUserService _userService;

    public UserProfileController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var profile = await _userService.GetUserProfileAsync(userId);
        if (profile == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, data = profile });
    }

    /// <summary>
    /// Update current user profile
    /// </summary>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var profile = await _userService.UpdateUserProfileAsync(userId, dto);
        if (profile == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, message = "Profile updated successfully", data = profile });
    }

    /// <summary>
    /// Change password
    /// </summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        try
        {
            var result = await _userService.ChangePasswordAsync(userId, dto);
            if (!result)
                return NotFound(new { success = false, message = "User not found" });

            return Ok(new { success = true, message = "Password changed successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get all users (Admin/Employee only)
    /// </summary>
    [HttpGet("users")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetAllUsers([FromQuery] string? role = null)
    {
        var users = await _userService.GetAllUsersAsync(role);
        return Ok(new { success = true, data = users });
    }

    /// <summary>
    /// Get user by ID (Admin/Employee only)
    /// </summary>
    [HttpGet("users/{userId}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetUserById(int userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, data = user });
    }

    /// <summary>
    /// Admin only endpoint (for testing)
    /// </summary>
    [HttpGet("admin-only")]
    [Authorize(Roles = "Admin")]
    public IActionResult AdminOnly()
    {
        return Ok(new
        {
            message = "This endpoint is only accessible by Admin users"
        });
    }
}
