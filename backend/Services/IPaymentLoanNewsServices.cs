using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IPremiumPaymentService
{
    Task<IEnumerable<PremiumPaymentDto>> GetAllPaymentsAsync(int? userId = null, int? policyId = null);
    Task<PremiumPaymentDto?> GetPaymentByIdAsync(int paymentId);
    Task<IEnumerable<PremiumPaymentDto>> GetUserPaymentsAsync(int userId);
    Task<PremiumPaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto dto);
    Task<PremiumPaymentDto?> UpdatePaymentStatusAsync(int paymentId, UpdatePaymentStatusDto dto);
}

public interface IPolicyLoanService
{
    Task<IEnumerable<PolicyLoanDto>> GetAllLoansAsync(int? userId = null);
    Task<PolicyLoanDto?> GetLoanByIdAsync(int loanId);
    Task<IEnumerable<PolicyLoanDto>> GetUserLoansAsync(int userId);
    Task<PolicyLoanDto> CreateLoanAsync(int userId, CreatePolicyLoanDto dto);
    Task<PolicyLoanDto?> UpdateLoanStatusAsync(int loanId, UpdateLoanStatusDto dto);
}

public interface INewsService
{
    Task<IEnumerable<NewsDto>> GetAllNewsAsync();
    Task<NewsDto?> GetNewsByIdAsync(int newsId);
    Task<NewsDto> CreateNewsAsync(int authorId, CreateNewsDto dto);
    Task<NewsDto?> UpdateNewsAsync(int newsId, UpdateNewsDto dto);
    Task<bool> DeleteNewsAsync(int newsId);
}
