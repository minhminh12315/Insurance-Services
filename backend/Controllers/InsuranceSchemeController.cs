using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsuranceSchemeController : ControllerBase
{
    private readonly IInsuranceSchemeService _schemeService;

    public InsuranceSchemeController(IInsuranceSchemeService schemeService)
    {
        _schemeService = schemeService;
    }

    /// <summary>
    /// Get all insurance schemes with optional filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAllSchemes([FromQuery] int? categoryId, [FromQuery] bool? isActive)
    {
        var schemes = await _schemeService.GetAllSchemesAsync(categoryId, isActive);
        return Ok(new { success = true, data = schemes });
    }

    /// <summary>
    /// Get insurance scheme by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetSchemeById(int id)
    {
        var scheme = await _schemeService.GetSchemeByIdAsync(id);
        if (scheme == null)
            return NotFound(new { success = false, message = "Scheme not found" });

        return Ok(new { success = true, data = scheme });
    }

    /// <summary>
    /// Create new insurance scheme (Admin/Employee only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> CreateScheme([FromBody] CreateSchemeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var scheme = await _schemeService.CreateSchemeAsync(dto);
            return CreatedAtAction(nameof(GetSchemeById), new { id = scheme.SchemeId },
                new { success = true, message = "Scheme created successfully", data = scheme });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Update insurance scheme (Admin/Employee only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdateScheme(int id, [FromBody] UpdateSchemeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var scheme = await _schemeService.UpdateSchemeAsync(id, dto);
            if (scheme == null)
                return NotFound(new { success = false, message = "Scheme not found" });

            return Ok(new { success = true, message = "Scheme updated successfully", data = scheme });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Delete insurance scheme (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteScheme(int id)
    {
        try
        {
            var result = await _schemeService.DeleteSchemeAsync(id);
            if (!result)
                return NotFound(new { success = false, message = "Scheme not found" });

            return Ok(new { success = true, message = "Scheme deleted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Calculate premium for a scheme
    /// </summary>
    [HttpPost("calculate-premium")]
    public async Task<ActionResult> CalculatePremium([FromBody] CalculatePremiumRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var result = await _schemeService.CalculatePremiumAsync(request);
            if (result == null)
                return NotFound(new { success = false, message = "Scheme not found" });

            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
