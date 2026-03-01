using Microsoft.AspNetCore.Mvc;
using InsuranceService.API.Services.VNPay;
using InsuranceService.API.DTOs.VNPay;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VNPayController : ControllerBase
    {
        private readonly IVNPayService _vnPayService;
        private readonly InsuranceDbContext _context;

        public VNPayController(IVNPayService vnPayService, InsuranceDbContext context)
        {
            _vnPayService = vnPayService;
            _context = context;
        }

        [HttpPost("create-payment")]
        public IActionResult CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var paymentUrl = _vnPayService.CreatePaymentUrl(request, HttpContext);
                return Ok(new { success = true, paymentUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback()
        {
            var queryParams = Request.Query;
            bool isValid = _vnPayService.ValidateSignature(queryParams);

            string vnp_TxnRef = queryParams["vnp_TxnRef"]!;
            string vnp_ResponseCode = queryParams["vnp_ResponseCode"]!;
            string vnp_TransactionNo = queryParams["vnp_TransactionNo"]!;
            string vnp_Amount = queryParams["vnp_Amount"]!;
            string vnp_BankCode = queryParams["vnp_BankCode"]!;

            var payment = await _context.PremiumPayments
                .FirstOrDefaultAsync(p => p.OrderCode == vnp_TxnRef);

            if (payment == null)
            {
                return BadRequest(new { success = false, message = "Payment not found" });
            }

            bool success = isValid && vnp_ResponseCode == "00";
            
            // Only update if not already processed by IPN
            if (payment.Status == "Pending")
            {
                payment.Status = success ? "Success" : "Failed";
                payment.TransactionReference = vnp_TransactionNo;
                payment.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            var response = new VNPayResponse
            {
                Success = success,
                Message = success ? "Payment successful" : "Payment failed",
                VnPayResponseCode = vnp_ResponseCode,
                VnPayTransactionNo = vnp_TransactionNo,
                VnPayTxnRef = vnp_TxnRef
            };

            return Ok(response);
        }

        [HttpGet("ipn")]
        public async Task<IActionResult> IPN()
        {
            var queryParams = Request.Query;
            bool isValid = _vnPayService.ValidateSignature(queryParams);

            if (!isValid)
            {
                return Ok(new { RspCode = "97", Message = "Invalid signature" });
            }

            string vnp_TxnRef = queryParams["vnp_TxnRef"]!;
            string vnp_ResponseCode = queryParams["vnp_ResponseCode"]!;
            string vnp_TransactionNo = queryParams["vnp_TransactionNo"]!;
            string vnp_Amount = queryParams["vnp_Amount"]!;

            var payment = await _context.PremiumPayments
                .FirstOrDefaultAsync(p => p.OrderCode == vnp_TxnRef);

            if (payment == null)
            {
                return Ok(new { RspCode = "01", Message = "Order not found" });
            }

            if (payment.AmountPaid != (decimal.Parse(vnp_Amount) / 100))
            {
                return Ok(new { RspCode = "04", Message = "Invalid amount" });
            }

            if (payment.Status != "Pending")
            {
                return Ok(new { RspCode = "02", Message = "Order already confirmed" });
            }

            bool success = vnp_ResponseCode == "00";
            payment.Status = success ? "Success" : "Failed";
            payment.TransactionReference = vnp_TransactionNo;
            payment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { RspCode = "00", Message = "Confirm Success" });
        }
    }
}
