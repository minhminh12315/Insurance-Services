using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicyController : ControllerBase
{
    private readonly IPolicyService _policyService;

    public PolicyController(IPolicyService policyService)
    {
        _policyService = policyService;
    }

    /// <summary>
    /// Get all policies (Admin/Employee only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetAllPolicies([FromQuery] int? userId, [FromQuery] string? status)
    {
        var policies = await _policyService.GetAllPoliciesAsync(userId, status);
        return Ok(new { success = true, data = policies });
    }

    /// <summary>
    /// Get policy by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetPolicyById(int id)
    {
        var policy = await _policyService.GetPolicyByIdAsync(id);
        if (policy == null)
            return NotFound(new { success = false, message = "Policy not found" });

        // Check if user has access to this policy
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Employee" && 
            policy.UserId.ToString() != userIdClaim)
        {
            return Forbid();
        }

        return Ok(new { success = true, data = policy });
    }

    /// <summary>
    /// Get policy by policy number
    /// </summary>
    [HttpGet("by-number/{policyNumber}")]
    public async Task<ActionResult> GetPolicyByNumber(string policyNumber)
    {
        var policy = await _policyService.GetPolicyByNumberAsync(policyNumber);
        if (policy == null)
            return NotFound(new { success = false, message = "Policy not found" });

        // Check if user has access to this policy
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Employee" && 
            policy.UserId.ToString() != userIdClaim)
        {
            return Forbid();
        }

        return Ok(new { success = true, data = policy });
    }

    /// <summary>
    /// Get current user's policies
    /// </summary>
    [HttpGet("my-policies")]
    public async Task<ActionResult> GetMyPolicies([FromQuery] bool activeOnly = false)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Invalid user" });
        }

        var policies = await _policyService.GetUserPoliciesAsync(userId, activeOnly);
        return Ok(new { success = true, data = policies });
    }

    /// <summary>
    /// Create new policy
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreatePolicy([FromBody] CreatePolicyDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Invalid user" });
        }

        try
        {
            var policy = await _policyService.CreatePolicyAsync(userId, dto);
            return CreatedAtAction(nameof(GetPolicyById), new { id = policy.PolicyId },
                new { success = true, message = "Policy created successfully", data = policy });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Update policy status (Admin/Employee only)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdatePolicyStatus(int id, [FromBody] UpdatePolicyStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var policy = await _policyService.UpdatePolicyStatusAsync(id, dto);
            if (policy == null)
                return NotFound(new { success = false, message = "Policy not found" });

            return Ok(new { success = true, message = "Policy status updated successfully", data = policy });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Cancel policy (Customer can cancel their own policy)
    /// </summary>
    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelPolicy(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Invalid user" });
        }

        try
        {
            var result = await _policyService.CancelPolicyAsync(id, userId);
            if (!result)
                return NotFound(new { success = false, message = "Policy not found" });

            return Ok(new { success = true, message = "Policy cancelled successfully" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
