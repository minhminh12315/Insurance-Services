using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicyRenewalController : ControllerBase
{
    private readonly IPolicyRenewalService _renewalService;

    public PolicyRenewalController(IPolicyRenewalService renewalService)
    {
        _renewalService = renewalService;
    }

    /// <summary>
    /// Calculate policy renewal premium
    /// </summary>
    [HttpGet("calculate")]
    public async Task<ActionResult> CalculateRenewal([FromQuery] int policyId, [FromQuery] int renewalTermYears)
    {
        try
        {
            var calculation = await _renewalService.CalculateRenewalAsync(policyId, renewalTermYears);
            if (calculation == null)
                return NotFound(new { success = false, message = "Policy not found" });

            return Ok(new { success = true, data = calculation });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Create renewal request
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateRenewalRequest([FromBody] CreatePolicyRenewalDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var renewal = await _renewalService.CreateRenewalRequestAsync(userId, dto);
            return CreatedAtAction(nameof(GetRenewalById), new { id = renewal.RenewalId },
                new { success = true, message = "Renewal request submitted successfully", data = renewal });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get renewal by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetRenewalById(int id)
    {
        var renewal = await _renewalService.GetRenewalByIdAsync(id);
        if (renewal == null)
            return NotFound(new { success = false, message = "Renewal not found" });

        // Check access
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole != "Admin" && userRole != "Employee" && renewal.UserId != userId)
            return Forbid();

        return Ok(new { success = true, data = renewal });
    }

    /// <summary>
    /// Get current user's renewals
    /// </summary>
    [HttpGet("my-renewals")]
    public async Task<ActionResult> GetMyRenewals()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var renewals = await _renewalService.GetUserRenewalsAsync(userId);
        return Ok(new { success = true, data = renewals });
    }

    /// <summary>
    /// Get pending renewals (Admin/Employee)
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetPendingRenewals()
    {
        var renewals = await _renewalService.GetPendingRenewalsAsync();
        return Ok(new { success = true, data = renewals });
    }

    /// <summary>
    /// Process renewal request (Admin/Employee)
    /// </summary>
    [HttpPost("{id}/process")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> ProcessRenewal(int id, [FromBody] ProcessRenewalDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var processedBy = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var renewal = await _renewalService.ProcessRenewalAsync(id, processedBy, dto);
            return Ok(new { success = true, message = $"Renewal {dto.Action.ToLower()}ed successfully", data = renewal });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
