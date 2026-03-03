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
    private readonly IFileStorageService _fileStorageService;
    private readonly InsuranceService.API.Models.InsuranceDbContext _context;

    public ClaimController(
        IClaimService claimService,
        IFileStorageService fileStorageService,
        InsuranceService.API.Models.InsuranceDbContext context)
    {
        _claimService = claimService;
        _fileStorageService = fileStorageService;
        _context = context;
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

    /// <summary>
    /// Upload document for a claim
    /// </summary>
    [HttpPost("{id}/upload-document")]
    public async Task<ActionResult> UploadClaimDocument(int id, IFormFile file)
    {
        if (file == null || file  .Length == 0)
            return BadRequest(new { success = false, message = "No file uploaded" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        // Get the claim
        var claim = await _context.Claims.FindAsync(id);
        if (claim == null)
            return NotFound(new { success = false, message = "Claim not found" });

        // Check if user owns the claim or is admin/employee
        if (userRole != "Admin" && userRole != "Employee" && claim.UserId != userId)
            return Forbid();

        // Validate file type
        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx" };
        if (!_fileStorageService.IsValidFileType(file, allowedExtensions))
            return BadRequest(new { success = false, message = $"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}" });

        // Validate file size (10MB max)
        if (!_fileStorageService.IsValidFileSize(file, 10 * 1024 * 1024))
            return BadRequest(new { success = false, message = "File size exceeds 10MB limit" });

        try
        {
            // Delete old document if exists
            if (!string.IsNullOrEmpty(claim.DocumentPath))
            {
                await _fileStorageService.DeleteFileAsync(claim.DocumentPath);
            }

            // Save new document
            var filePath = await _fileStorageService.SaveFileAsync(file, "claims");
            claim.DocumentPath = filePath;
            claim.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var fileUrl = _fileStorageService.GetFileUrl(filePath);

            return Ok(new
            {
                success = true,
                message = "Document uploaded successfully",
                data = new { documentPath = filePath, documentUrl = fileUrl }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Error uploading file", error = ex.Message });
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
