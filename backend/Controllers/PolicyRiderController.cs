using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicyRiderController : ControllerBase
{
    private readonly IPolicyRiderService _riderService;
    private readonly InsuranceService.API.Models.InsuranceDbContext _context;

    public PolicyRiderController(
        IPolicyRiderService riderService,
        InsuranceService.API.Models.InsuranceDbContext context)
    {
        _riderService = riderService;
        _context = context;
    }

    /// <summary>
    /// Get all riders for a policy
    /// </summary>
    [HttpGet("policy/{policyId}")]
    public async Task<ActionResult> GetPolicyRiders(int policyId)
    {
        var riders = await _riderService.GetPolicyRidersAsync(policyId);
        return Ok(new { success = true, data = riders });
    }

    /// <summary>
    /// Get rider by ID
    /// </summary>
    [HttpGet("{riderId}")]
    public async Task<ActionResult> GetRiderById(int riderId)
    {
        var rider = await _riderService.GetRiderByIdAsync(riderId);
        if (rider == null)
            return NotFound(new { success = false, message = "Rider not found" });

        return Ok(new { success = true, data = rider });
    }

    /// <summary>
    /// Get available rider templates for a category
    /// </summary>
    [HttpGet("templates/{categoryType}")]
    public async Task<ActionResult> GetRiderTemplates(string categoryType)
    {
        var templates = await _riderService.GetAvailableRiderTemplatesAsync(categoryType);
        return Ok(new { success = true, data = templates });
    }

    /// <summary>
    /// Add a rider to a policy
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateRider([FromBody] CreatePolicyRiderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        // Check if user owns the policy or is admin/employee
        var policy = await _context.Policies.FindAsync(dto.PolicyId);
        if (policy == null)
            return NotFound(new { success = false, message = "Policy not found" });

        if (userRole != "Admin" && userRole != "Employee" && policy.UserId != userId)
            return Forbid();

        try
        {
            var rider = await _riderService.CreateRiderAsync(dto);
            return CreatedAtAction(nameof(GetRiderById), new { riderId = rider.RiderId },
                new { success = true, message = "Rider added successfully", data = rider });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Update a rider
    /// </summary>
    [HttpPut("{riderId}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdateRider(int riderId, [FromBody] UpdatePolicyRiderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var rider = await _riderService.UpdateRiderAsync(riderId, dto);
        if (rider == null)
            return NotFound(new { success = false, message = "Rider not found" });

        return Ok(new { success = true, message = "Rider updated successfully", data = rider });
    }

    /// <summary>
    /// Delete a rider
    /// </summary>
    [HttpDelete("{riderId}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> DeleteRider(int riderId)
    {
        var result = await _riderService.DeleteRiderAsync(riderId);
        if (!result)
            return NotFound(new { success = false, message = "Rider not found" });

        return Ok(new { success = true, message = "Rider deleted successfully" });
    }
}
