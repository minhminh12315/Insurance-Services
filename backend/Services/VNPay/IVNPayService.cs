using Microsoft.AspNetCore.Http;
using InsuranceService.API.DTOs.VNPay;

namespace InsuranceService.API.Services.VNPay
{
    public interface IVNPayService
    {
        string CreatePaymentUrl(CreatePaymentRequest request, HttpContext context);
        bool ValidateSignature(IQueryCollection queryParams);
    }
}
