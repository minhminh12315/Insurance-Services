using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentReceiptController : ControllerBase
{
    private readonly IPaymentReceiptService _receiptService;

    public PaymentReceiptController(IPaymentReceiptService receiptService)
    {
        _receiptService = receiptService;
    }

    /// <summary>
    /// Generate receipt for payment
    /// </summary>
    [HttpPost("generate")]
    public async Task<ActionResult> GenerateReceipt([FromBody] GenerateReceiptDto dto)
    {
        try
        {
            var receipt = await _receiptService.GenerateReceiptAsync(dto.PaymentId, dto.SendEmail);
            return Ok(new { success = true, message = "Receipt generated successfully", data = receipt });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get receipt by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetReceiptById(int id)
    {
        var receipt = await _receiptService.GetReceiptByIdAsync(id);
        if (receipt == null)
            return NotFound(new { success = false, message = "Receipt not found" });

        // Check access
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userRole != "Admin" && userRole != "Employee" && receipt.Payment.UserEmail != User.FindFirst(ClaimTypes.Email)?.Value)
        {
            // Additional check by userId if needed
            return Forbid();
        }

        return Ok(new { success = true, data = receipt });
    }

    /// <summary>
    /// Get receipt by payment ID
    /// </summary>
    [HttpGet("payment/{paymentId}")]
    public async Task<ActionResult> GetReceiptByPaymentId(int paymentId)
    {
        var receipt = await _receiptService.GetReceiptByPaymentIdAsync(paymentId);
        if (receipt == null)
            return NotFound(new { success = false, message = "No receipt found for this payment" });

        return Ok(new { success = true, data = receipt });
    }

    /// <summary>
    /// Get current user's receipts
    /// </summary>
    [HttpGet("my-receipts")]
    public async Task<ActionResult> GetMyReceipts()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var receipts = await _receiptService.GetUserReceiptsAsync(userId);
        return Ok(new { success = true, data = receipts, count = receipts.Count });
    }

    /// <summary>
    /// Resend receipt email
    /// </summary>
    [HttpPost("{id}/resend-email")]
    public async Task<ActionResult> ResendReceiptEmail(int id)
    {
        var result = await _receiptService.ResendReceiptEmailAsync(id);
        if (!result)
            return BadRequest(new { success = false, message = "Failed to resend receipt email" });

        return Ok(new { success = true, message = "Receipt email sent successfully" });
    }
}
