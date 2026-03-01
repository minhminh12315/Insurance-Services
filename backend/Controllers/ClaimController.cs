using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimController : ControllerBase
{
    private readonly IClaimService _claimService;

    public ClaimController(IClaimService claimService)
    {
        _claimService = claimService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetAllClaims([FromQuery] int? userId, [FromQuery] string? status)
    {
        var claims = await _claimService.GetAllClaimsAsync(userId, status);
        return Ok(new { success = true, data = claims });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetClaimById(int id)
    {
        var claim = await _claimService.GetClaimByIdAsync(id);
        if (claim == null)
            return NotFound(new { success = false, message = "Claim not found" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Employee" && claim.UserId.ToString() != userIdClaim)
            return Forbid();

        return Ok(new { success = true, data = claim });
    }

    [HttpGet("my-claims")]
    public async Task<ActionResult> GetMyClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var claims = await _claimService.GetUserClaimsAsync(userId);
        return Ok(new { success = true, data = claims });
    }

    [HttpPost]
    public async Task<ActionResult> CreateClaim([FromBody] CreateClaimDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        try
        {
            var claim = await _claimService.CreateClaimAsync(userId, dto);
            return CreatedAtAction(nameof(GetClaimById), new { id = claim.ClaimId },
                new { success = true, message = "Claim submitted successfully", data = claim });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdateClaimStatus(int id, [FromBody] UpdateClaimStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var claim = await _claimService.UpdateClaimStatusAsync(id, dto);
            if (claim == null)
                return NotFound(new { success = false, message = "Claim not found" });

            return Ok(new { success = true, message = "Claim status updated successfully", data = claim });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
