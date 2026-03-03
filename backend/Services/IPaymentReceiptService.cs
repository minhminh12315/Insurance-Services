using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPaymentReceiptService
{
    Task<PaymentReceiptDto> GenerateReceiptAsync(int paymentId, bool sendEmail = true);
    Task<PaymentReceiptDto?> GetReceiptByIdAsync(int receiptId);
    Task<PaymentReceiptDto?> GetReceiptByPaymentIdAsync(int paymentId);
    Task<List<PaymentReceiptDto>> GetUserReceiptsAsync(int userId);
    Task<string> GenerateReceiptHtmlAsync(ReceiptTemplateDataDto data);
    Task<bool> ResendReceiptEmailAsync(int receiptId);
}
