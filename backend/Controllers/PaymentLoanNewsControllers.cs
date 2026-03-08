using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PremiumPaymentController : ControllerBase
{
    private readonly IPremiumPaymentService _paymentService;

    public PremiumPaymentController(IPremiumPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetAllPayments([FromQuery] int? userId, [FromQuery] int? policyId)
    {
        var payments = await _paymentService.GetAllPaymentsAsync(userId, policyId);
        return Ok(new { success = true, data = payments });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetPaymentById(int id)
    {
        var payment = await _paymentService.GetPaymentByIdAsync(id);
        if (payment == null)
            return NotFound(new { success = false, message = "Payment not found" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Employee" && payment.UserId.ToString() != userIdClaim)
            return Forbid();

        return Ok(new { success = true, data = payment });
    }

    [HttpGet("my-payments")]
    public async Task<ActionResult> GetMyPayments()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var payments = await _paymentService.GetUserPaymentsAsync(userId);
        return Ok(new { success = true, data = payments });
    }

    [HttpGet("by-order/{orderCode}")]
    public async Task<ActionResult> GetPaymentByOrderCode(string orderCode)
    {
        var payment = await _paymentService.GetPaymentByOrderCodeAsync(orderCode);
        if (payment == null)
            return NotFound(new { success = false, message = "Payment not found" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (payment.UserId.ToString() != userIdClaim)
            return Forbid();

        return Ok(new { success = true, data = payment });
    }

    [HttpPost]
    public async Task<ActionResult> CreatePayment([FromBody] CreatePaymentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        try
        {
            var payment = await _paymentService.CreatePaymentAsync(userId, dto);
            return CreatedAtAction(nameof(GetPaymentById), new { id = payment.PaymentId },
                new { success = true, message = "Payment successful", data = payment });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var payment = await _paymentService.UpdatePaymentStatusAsync(id, dto);
            if (payment == null)
                return NotFound(new { success = false, message = "Payment not found" });

            return Ok(new { success = true, message = "Payment status updated", data = payment });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicyLoanController : ControllerBase
{
    private readonly IPolicyLoanService _loanService;

    public PolicyLoanController(IPolicyLoanService loanService)
    {
        _loanService = loanService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> GetAllLoans([FromQuery] int? userId)
    {
        var loans = await _loanService.GetAllLoansAsync(userId);
        return Ok(new { success = true, data = loans });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetLoanById(int id)
    {
        var loan = await _loanService.GetLoanByIdAsync(id);
        if (loan == null)
            return NotFound(new { success = false, message = "Loan not found" });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Employee" && loan.UserId.ToString() != userIdClaim)
            return Forbid();

        return Ok(new { success = true, data = loan });
    }

    [HttpGet("my-loans")]
    public async Task<ActionResult> GetMyLoans()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var loans = await _loanService.GetUserLoansAsync(userId);
        return Ok(new { success = true, data = loans });
    }

    [HttpPost]
    public async Task<ActionResult> CreateLoan([FromBody] CreatePolicyLoanDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        try
        {
            var loan = await _loanService.CreateLoanAsync(userId, dto);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.LoanId },
                new { success = true, message = "Loan application submitted", data = loan });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdateLoanStatus(int id, [FromBody] UpdateLoanStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        try
        {
            var loan = await _loanService.UpdateLoanStatusAsync(id, dto);
            if (loan == null)
                return NotFound(new { success = false, message = "Loan not found" });

            return Ok(new { success = true, message = "Loan status updated", data = loan });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAllNews()
    {
        var news = await _newsService.GetAllNewsAsync();
        return Ok(new { success = true, data = news });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetNewsById(int id)
    {
        var news = await _newsService.GetNewsByIdAsync(id);
        if (news == null)
            return NotFound(new { success = false, message = "News not found" });

        return Ok(new { success = true, data = news });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> CreateNews([FromBody] CreateNewsDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized(new { success = false, message = "Invalid user" });

        var news = await _newsService.CreateNewsAsync(userId, dto);
        return CreatedAtAction(nameof(GetNewsById), new { id = news.NewsId },
            new { success = true, message = "News created successfully", data = news });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult> UpdateNews(int id, [FromBody] UpdateNewsDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid data", errors = ModelState });

        var news = await _newsService.UpdateNewsAsync(id, dto);
        if (news == null)
            return NotFound(new { success = false, message = "News not found" });

        return Ok(new { success = true, message = "News updated successfully", data = news });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteNews(int id)
    {
        var result = await _newsService.DeleteNewsAsync(id);
        if (!result)
            return NotFound(new { success = false, message = "News not found" });

        return Ok(new { success = true, message = "News deleted successfully" });
    }
}
