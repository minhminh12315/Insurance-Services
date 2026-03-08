using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicySurrenderController : ControllerBase
{
    private readonly IPolicySurrenderService _surrenderService;

    public PolicySurrenderController(IPolicySurrenderService surrenderService)
    {
        _surrenderService = surrenderService;
    }

    /// <summary>
    /// Calculate surrender value for policy
    /// </summary>
    [HttpGet("calculate/{policyId}")]
    public async Task<ActionResult> CalculateSurrenderValue(int policyId)
    {
        var calculation = await _surrenderService.CalculateSurrenderValueAsync(policyId);
        if (calculation == null)
            return NotFound(new { success = false, message = "Policy not found" });

        return Ok(new { success = true, data = calculation });
    }

    /// <summary>
    /// Create surrender request
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateSurrenderRequest([FromBody] CreatePolicySurrenderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var surrender = await _surrenderService.CreateSurrenderRequestAsync(userId, dto);
            return CreatedAtAction(nameof(GetSurrenderById), new { id = surrender.SurrenderId },
                new { success = true, message = "Surrender request submitted successfully", data = surrender });
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
    /// Get surrender by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetSurrenderById(int id)
    {
        var surrender = await _surrenderService.GetSurrenderByIdAsync(id);
        if (surrender == null)
            return NotFound(new { success = false, message = "Surrender request not found" });

        // Check access
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole != "Admin" && userRole != "Employee" && surrender.UserId != userId)
            return Forbid();

        return Ok(new { success = true, data = surrender });
    }

    /// <summary>
    /// Get current user's surrender requests
    /// </summary>
    [HttpGet("my-surrenders")]
    public async Task<ActionResult> GetMySurrenders()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var surrenders = await _surrenderService.GetUserSurrendersAsync(userId);
        return Ok(new { success = true, data = surrenders });
    }

    /// <summary>
    /// Get pending surrender requests (Admin/Employee)
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetPendingSurrenders()
    {
        var surrenders = await _surrenderService.GetPendingSurrendersAsync();
        return Ok(new { success = true, data = surrenders });
    }

    /// <summary>
    /// Process surrender request (Admin/Employee)
    /// </summary>
    [HttpPost("{id}/process")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> ProcessSurrender(int id, [FromBody] ProcessSurrenderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var processedBy = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        try
        {
            var surrender = await _surrenderService.ProcessSurrenderAsync(id, processedBy, dto);
            return Ok(new { success = true, message = $"Surrender {dto.Action.ToLower()}ed successfully", data = surrender });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
