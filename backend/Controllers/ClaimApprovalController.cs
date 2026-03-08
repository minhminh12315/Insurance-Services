using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimApprovalController : ControllerBase
{
    private readonly IClaimApprovalService _claimApprovalService;

    public ClaimApprovalController(IClaimApprovalService claimApprovalService)
    {
        _claimApprovalService = claimApprovalService;
    }

    /// <summary>
    /// Get claim with full approval workflow
    /// </summary>
    [HttpGet("{claimId}")]
    public async Task<ActionResult> GetClaimWithWorkflow(int claimId)
    {
        var claim = await _claimApprovalService.GetClaimWithWorkflowAsync(claimId);
        if (claim == null)
            return NotFound(new { success = false, message = "Claim not found" });

        // Check access
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole != "Admin" && userRole != "Employee" && claim.UserId != userId)
            return Forbid();

        return Ok(new { success = true, data = claim });
    }

    /// <summary>
    /// Get claim approval history
    /// </summary>
    [HttpGet("{claimId}/history")]
    public async Task<ActionResult> GetClaimApprovalHistory(int claimId)
    {
        var history = await _claimApprovalService.GetClaimApprovalHistoryAsync(claimId);
        return Ok(new { success = true, data = history });
    }

    /// <summary>
    /// Get claims for approval (Admin/Employee)
    /// </summary>
    [HttpGet("for-approval")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetClaimsForApproval([FromQuery] string? status = null)
    {
        var claims = await _claimApprovalService.GetClaimsForApprovalAsync(status);
        return Ok(new { success = true, data = claims, count = claims.Count });
    }

    /// <summary>
    /// Process claim action (Admin/Employee)
    /// </summary>
    [HttpPost("{claimId}/process")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> ProcessClaimAction(int claimId, [FromBody] ClaimApprovalActionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var approvedBy = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var history = await _claimApprovalService.ProcessClaimActionAsync(claimId, approvedBy, dto);
            return Ok(new { success = true, message = $"Claim {dto.Action} processed successfully", data = history });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Mark claim as paid (Admin/Employee)
    /// </summary>
    [HttpPost("{claimId}/mark-paid")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> MarkClaimAsPaid(int claimId, [FromBody] MarkClaimPaidDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var processedBy = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var history = await _claimApprovalService.MarkClaimAsPaidAsync(claimId, processedBy, dto);
            return Ok(new { success = true, message = "Claim marked as paid successfully", data = history });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
