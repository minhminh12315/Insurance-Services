using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoanRepaymentController : ControllerBase
{
    private readonly ILoanRepaymentService _loanRepaymentService;

    public LoanRepaymentController(ILoanRepaymentService loanRepaymentService)
    {
        _loanRepaymentService = loanRepaymentService;
    }

    /// <summary>
    /// Generate repayment schedule for loan
    /// </summary>
    [HttpPost("generate-schedule")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GenerateSchedule([FromBody] GenerateLoanScheduleDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var schedule = await _loanRepaymentService.GenerateRepaymentScheduleAsync(dto);
            return Ok(new { success = true, message = "Repayment schedule generated successfully", data = schedule });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get loan repayment schedule
    /// </summary>
    [HttpGet("schedule/{loanId}")]
    public async Task<ActionResult> GetLoanSchedule(int loanId)
    {
        var schedule = await _loanRepaymentService.GetLoanScheduleAsync(loanId);
        if (schedule == null)
            return NotFound(new { success = false, message = "No repayment schedule found for this loan" });

        return Ok(new { success = true, data = schedule });
    }

    /// <summary>
    /// Record loan payment
    /// </summary>
    [HttpPost("record-payment")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> RecordPayment([FromBody] RecordLoanPaymentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var payment = await _loanRepaymentService.RecordPaymentAsync(dto);
            if (payment == null)
                return NotFound(new { success = false, message = "Payment schedule not found" });

            return Ok(new { success = true, message = "Payment recorded successfully", data = payment });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get loan payment history
    /// </summary>
    [HttpGet("history/{loanId}")]
    public async Task<ActionResult> GetPaymentHistory(int loanId)
    {
        var history = await _loanRepaymentService.GetLoanPaymentHistoryAsync(loanId);
        if (history == null)
            return NotFound(new { success = false, message = "Loan not found" });

        return Ok(new { success = true, data = history });
    }

    /// <summary>
    /// Get overdue installments
    /// </summary>
    [HttpGet("overdue")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetOverdueInstallments([FromQuery] int? userId = null)
    {
        var overdueInstallments = await _loanRepaymentService.GetOverdueInstallmentsAsync(userId);
        return Ok(new { success = true, data = overdueInstallments, count = overdueInstallments.Count });
    }

    /// <summary>
    /// Get current user's overdue installments
    /// </summary>
    [HttpGet("my-overdue")]
    public async Task<ActionResult> GetMyOverdueInstallments()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var overdueInstallments = await _loanRepaymentService.GetOverdueInstallmentsAsync(userId);
        return Ok(new { success = true, data = overdueInstallments, count = overdueInstallments.Count });
    }
}
