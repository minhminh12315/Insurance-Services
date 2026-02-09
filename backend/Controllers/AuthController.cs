using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid input data",
            });
        }

        var ipAddress = GetIpAddress();
        var result = await _authService.RegisterAsync(request, ipAddress);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponseDto
            {
                Success = false,
                Message = "Invalid input data",
            });
        }

        var ipAddress = GetIpAddress();
        var result = await _authService.LoginAsync(request, ipAddress);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { success = false, message = "Invalid input data" });
        }

        var ipAddress = GetIpAddress();
        var result = await _authService.RefreshTokenAsync(request.RefreshToken, ipAddress);

        if (result == null)
        {
            return Unauthorized(new { success = false, message = "Invalid or expired refresh token" });
        }

        return Ok(new
        {
            success = true,
            message = "Token refreshed successfully",
            data = result
        });
    }

    [HttpPost("revoke-token")]
    [Authorize]
    public async Task<ActionResult> RevokeToken([FromBody] RevokeTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { success = false, message = "Invalid input data" });
        }

        var ipAddress = GetIpAddress();
        var result = await _authService.RevokeTokenAsync(request.Token, ipAddress);

        if (!result)
        {
            return BadRequest(new { success = false, message = "Token not found or already revoked" });
        }

        return Ok(new { success = true, message = "Token revoked successfully" });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Invalid user" });
        }

        var ipAddress = GetIpAddress();
        var result = await _authService.LogoutAsync(userId, ipAddress);

        if (!result)
        {
            return BadRequest(new { success = false, message = "Logout failed" });
        }

        return Ok(new { success = true, message = "Logged out successfully" });
    }

    [HttpPost("validate-token")]
    public async Task<ActionResult<ValidateTokenResponseDto>> ValidateToken([FromBody] ValidateTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ValidateTokenResponseDto
            {
                IsValid = false,
                Message = "Invalid input data"
            });
        }

        var result = await _authService.ValidateTokenAsync(request.Token);
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        return Ok(new
        {
            success = true,
            data = new
            {
                userId,
                email,
                name,
                role
            }
        });
    }

    private string GetIpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            return Request.Headers["X-Forwarded-For"].ToString();
        }
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    }
}
