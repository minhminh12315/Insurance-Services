using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PaymentReceiptService : IPaymentReceiptService
{
    private readonly InsuranceDbContext _context;
    private readonly IEmailService _emailService;

    public PaymentReceiptService(InsuranceDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<PaymentReceiptDto> GenerateReceiptAsync(int paymentId, bool sendEmail = true)
    {
        // Check if receipt already exists
        var existingReceipt = await _context.Set<PaymentReceipt>()
            .FirstOrDefaultAsync(r => r.PaymentId == paymentId);

        if (existingReceipt != null)
            return await GetReceiptByIdAsync(existingReceipt.ReceiptId) 
                ?? throw new InvalidOperationException("Receipt not found");

        // Get payment details
        var payment = await _context.PremiumPayments
            .Include(p => p.Policy)
                .ThenInclude(pol => pol.Scheme)
                    .ThenInclude(s => s.Category)
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

        if (payment == null)
            throw new InvalidOperationException("Payment not found");

        if (payment.Status != "Completed" && payment.Status != "Success")
            throw new InvalidOperationException("Receipt can only be generated for completed payments");

        // Generate receipt number
        var receiptNumber = await GenerateReceiptNumberAsync();

        // Generate receipt HTML
        var templateData = new ReceiptTemplateDataDto
        {
            ReceiptNumber = receiptNumber,
            GeneratedDate = DateTime.UtcNow,
            CustomerName = payment.User.FullName,
            CustomerEmail = payment.User.Email,
            PolicyNumber = payment.Policy.PolicyNumber,
            InsuranceType = payment.Policy.Scheme.Category.CategoryName,
            SchemeName = payment.Policy.Scheme.SchemeName,
            AmountPaid = payment.AmountPaid,
            PaymentDate = payment.PaymentDate ?? DateTime.UtcNow,
            PaymentMethod = payment.PaymentMethod ?? "Online",
            TransactionReference = payment.TransactionReference ?? payment.OrderCode ?? "N/A"
        };

        var receiptHtml = await GenerateReceiptHtmlAsync(templateData);

        // Create receipt record
        var receipt = new PaymentReceipt
        {
            PaymentId = paymentId,
            ReceiptNumber = receiptNumber,
            GeneratedAt = DateTime.UtcNow,
            ReceiptHtml = receiptHtml,
            EmailSent = false
        };

        _context.Set<PaymentReceipt>().Add(receipt);
        await _context.SaveChangesAsync();

        // Send email if requested
        if (sendEmail && !string.IsNullOrEmpty(payment.User.Email))
        {
            try
            {
                await _emailService.SendEmailAsync(new EmailMessage
                {
                    To = payment.User.Email,
                    ToName = payment.User.FullName,
                    Subject = $"Payment Receipt - {receiptNumber}",
                    Body = receiptHtml,
                    IsHtml = true
                });

                receipt.EmailSent = true;
                receipt.EmailSentAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error but don't fail the operation
                Console.WriteLine($"Failed to send receipt email: {ex.Message}");
            }
        }

        return await GetReceiptByIdAsync(receipt.ReceiptId) 
            ?? throw new InvalidOperationException("Receipt not found");
    }

    public async Task<PaymentReceiptDto?> GetReceiptByIdAsync(int receiptId)
    {
        var receipt = await _context.Set<PaymentReceipt>()
            .Include(r => r.Payment)
                .ThenInclude(p => p.Policy)
                    .ThenInclude(pol => pol.Scheme)
                        .ThenInclude(s => s.Category)
            .Include(r => r.Payment)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(r => r.ReceiptId == receiptId);

        if (receipt == null)
            return null;

        return MapToDto(receipt);
    }

    public async Task<PaymentReceiptDto?> GetReceiptByPaymentIdAsync(int paymentId)
    {
        var receipt = await _context.Set<PaymentReceipt>()
            .Include(r => r.Payment)
                .ThenInclude(p => p.Policy)
                    .ThenInclude(pol => pol.Scheme)
                        .ThenInclude(s => s.Category)
            .Include(r => r.Payment)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(r => r.PaymentId == paymentId);

        if (receipt == null)
            return null;

        return MapToDto(receipt);
    }

    public async Task<List<PaymentReceiptDto>> GetUserReceiptsAsync(int userId)
    {
        var receipts = await _context.Set<PaymentReceipt>()
            .Include(r => r.Payment)
                .ThenInclude(p => p.Policy)
                    .ThenInclude(pol => pol.Scheme)
                        .ThenInclude(s => s.Category)
            .Include(r => r.Payment)
                .ThenInclude(p => p.User)
            .Where(r => r.Payment.UserId == userId)
            .OrderByDescending(r => r.GeneratedAt)
            .ToListAsync();

        return receipts.Select(MapToDto).ToList();
    }

    public async Task<string> GenerateReceiptHtmlAsync(ReceiptTemplateDataDto data)
    {
        var html = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }}
        .receipt-header {{ text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }}
        .receipt-header h1 {{ color: #007bff; margin: 0; }}
        .receipt-number {{ font-size: 24px; font-weight: bold; color: #28a745; margin: 10px 0; }}
        .company-info {{ margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; }}
        .customer-info {{ margin: 20px 0; }}
        .payment-details {{ margin: 30px 0; }}
        .payment-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        .payment-table th {{ background-color: #007bff; color: white; padding: 12px; text-align: left; }}
        .payment-table td {{ padding: 12px; border-bottom: 1px solid #ddd; }}
        .total-amount {{ font-size: 24px; font-weight: bold; color: #28a745; text-align: right; padding: 20px; background-color: #f8f9fa; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }}
        .thank-you {{ text-align: center; margin: 30px 0; font-size: 18px; color: #007bff; }}
    </style>
</head>
<body>
    <div class=""receipt-header"">
        <h1>{data.CompanyName}</h1>
        <p>{data.CompanyAddress}</p>
        <p>Phone: {data.CompanyPhone} | Email: {data.CompanyEmail}</p>
        <div class=""receipt-number"">Receipt #{data.ReceiptNumber}</div>
        <p>Generated: {data.GeneratedDate:dd/MM/yyyy HH:mm}</p>
    </div>

    <div class=""customer-info"">
        <h2>Customer Information</h2>
        <table style=""width: 100%;"">
            <tr>
                <td><strong>Name:</strong></td>
                <td>{data.CustomerName}</td>
            </tr>
            <tr>
                <td><strong>Email:</strong></td>
                <td>{data.CustomerEmail}</td>
            </tr>
            <tr>
                <td><strong>Policy Number:</strong></td>
                <td>{data.PolicyNumber}</td>
            </tr>
        </table>
    </div>

    <div class=""payment-details"">
        <h2>Payment Details</h2>
        <table class=""payment-table"">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Insurance Type</td>
                    <td>{data.InsuranceType}</td>
                </tr>
                <tr>
                    <td>Scheme Name</td>
                    <td>{data.SchemeName}</td>
                </tr>
                <tr>
                    <td>Payment Date</td>
                    <td>{data.PaymentDate:dd/MM/yyyy HH:mm}</td>
                </tr>
                <tr>
                    <td>Payment Method</td>
                    <td>{data.PaymentMethod}</td>
                </tr>
                <tr>
                    <td>Transaction Reference</td>
                    <td>{data.TransactionReference}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class=""total-amount"">
        Total Amount Paid: ₫{data.AmountPaid:N0}
    </div>

    <div class=""thank-you"">
        Thank you for choosing {data.CompanyName}!
    </div>

    <div class=""footer"">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>For any queries, please contact us at {data.CompanyEmail} or call {data.CompanyPhone}</p>
        <p>&copy; {DateTime.UtcNow.Year} {data.CompanyName}. All rights reserved.</p>
    </div>
</body>
</html>";

        return html;
    }

    public async Task<bool> ResendReceiptEmailAsync(int receiptId)
    {
        var receipt = await _context.Set<PaymentReceipt>()
            .Include(r => r.Payment)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(r => r.ReceiptId == receiptId);

        if (receipt == null)
            return false;

        if (string.IsNullOrEmpty(receipt.Payment.User.Email))
            return false;

        try
        {
            await _emailService.SendEmailAsync(new EmailMessage
            {
                To = receipt.Payment.User.Email,
                ToName = receipt.Payment.User.FullName,
                Subject = $"Payment Receipt - {receipt.ReceiptNumber}",
                Body = receipt.ReceiptHtml ?? "Receipt content not available",
                IsHtml = true
            });

            receipt.EmailSent = true;
            receipt.EmailSentAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task<string> GenerateReceiptNumberAsync()
    {
        var year = DateTime.UtcNow.Year;
        var lastReceipt = await _context.Set<PaymentReceipt>()
            .Where(r => r.ReceiptNumber.StartsWith($"RCP-{year}"))
            .OrderByDescending(r => r.ReceiptId)
            .FirstOrDefaultAsync();

        int nextNumber = 1;
        if (lastReceipt != null)
        {
            var lastNumber = lastReceipt.ReceiptNumber.Split('-').Last();
            if (int.TryParse(lastNumber, out int num))
            {
                nextNumber = num + 1;
            }
        }

        return $"RCP-{year}-{nextNumber:D5}";
    }

    private PaymentReceiptDto MapToDto(PaymentReceipt receipt)
    {
        return new PaymentReceiptDto
        {
            ReceiptId = receipt.ReceiptId,
            PaymentId = receipt.PaymentId,
            ReceiptNumber = receipt.ReceiptNumber,
            GeneratedAt = receipt.GeneratedAt,
            ReceiptPdfPath = receipt.ReceiptPdfPath,
            ReceiptPdfUrl = string.IsNullOrEmpty(receipt.ReceiptPdfPath)
                ? null
                : $"/Uploads/receipts/{Path.GetFileName(receipt.ReceiptPdfPath)}",
            EmailSent = receipt.EmailSent,
            EmailSentAt = receipt.EmailSentAt,
            Payment = new PaymentDetailsForReceiptDto
            {
                PaymentId = receipt.Payment.PaymentId,
                PolicyId = receipt.Payment.PolicyId,
                PolicyNumber = receipt.Payment.Policy.PolicyNumber,
                UserName = receipt.Payment.User.FullName,
                UserEmail = receipt.Payment.User.Email,
                AmountPaid = receipt.Payment.AmountPaid,
                PaymentDate = receipt.Payment.PaymentDate,
                PaymentMethod = receipt.Payment.PaymentMethod,
                TransactionReference = receipt.Payment.TransactionReference ?? receipt.Payment.OrderCode,
                Status = receipt.Payment.Status,
                InsuranceType = receipt.Payment.Policy.Scheme.Category.CategoryName,
                SchemeName = receipt.Payment.Policy.Scheme.SchemeName
            }
        };
    }
}
