using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BeneficiaryController : ControllerBase
{
    private readonly IBeneficiaryService _beneficiaryService;

    public BeneficiaryController(IBeneficiaryService beneficiaryService)
    {
        _beneficiaryService = beneficiaryService;
    }

    /// <summary>
    /// Get policy beneficiaries
    /// </summary>
    [HttpGet("policy/{policyId}")]
    public async Task<ActionResult> GetPolicyBeneficiaries(int policyId)
    {
        var beneficiaries = await _beneficiaryService.GetPolicyBeneficiariesAsync(policyId);
        return Ok(new { success = true, data = beneficiaries });
    }

    /// <summary>
    /// Get policy beneficiaries summary
    /// </summary>
    [HttpGet("policy/{policyId}/summary")]
    public async Task<ActionResult> GetPolicyBeneficiariesSummary(int policyId)
    {
        var summary = await _beneficiaryService.GetPolicyBeneficiariesSummaryAsync(policyId);
        if (summary == null)
            return NotFound(new { success = false, message = "Policy not found" });

        return Ok(new { success = true, data = summary });
    }

    /// <summary>
    /// Get beneficiary by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetBeneficiaryById(int id)
    {
        var beneficiary = await _beneficiaryService.GetBeneficiaryByIdAsync(id);
        if (beneficiary == null)
            return NotFound(new { success = false, message = "Beneficiary not found" });

        return Ok(new { success = true, data = beneficiary });
    }

    /// <summary>
    /// Add beneficiary to policy
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateBeneficiary([FromBody] CreateBeneficiaryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var beneficiary = await _beneficiaryService.CreateBeneficiaryAsync(userId, dto);
            return CreatedAtAction(nameof(GetBeneficiaryById), new { id = beneficiary.BeneficiaryId },
                new { success = true, message = "Beneficiary added successfully", data = beneficiary });
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
    /// Update beneficiary
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBeneficiary(int id, [FromBody] UpdateBeneficiaryDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var beneficiary = await _beneficiaryService.UpdateBeneficiaryAsync(id, userId, dto);
            if (beneficiary == null)
                return NotFound(new { success = false, message = "Beneficiary not found" });

            return Ok(new { success = true, message = "Beneficiary updated successfully", data = beneficiary });
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
    /// Delete beneficiary
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBeneficiary(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var result = await _beneficiaryService.DeleteBeneficiaryAsync(id, userId);
            if (!result)
                return NotFound(new { success = false, message = "Beneficiary not found" });

            return Ok(new { success = true, message = "Beneficiary deleted successfully" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Deactivate beneficiary (soft delete)
    /// </summary>
    [HttpPost("{id}/deactivate")]
    public async Task<ActionResult> DeactivateBeneficiary(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var result = await _beneficiaryService.DeactivateBeneficiaryAsync(id, userId);
            if (!result)
                return NotFound(new { success = false, message = "Beneficiary not found" });

            return Ok(new { success = true, message = "Beneficiary deactivated successfully" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
