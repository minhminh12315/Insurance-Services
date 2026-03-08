using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface ILoanRepaymentService
{
    Task<LoanScheduleSummaryDto> GenerateRepaymentScheduleAsync(GenerateLoanScheduleDto dto);
    Task<LoanScheduleSummaryDto?> GetLoanScheduleAsync(int loanId);
    Task<LoanRepaymentScheduleDto?> RecordPaymentAsync(RecordLoanPaymentDto dto);
    Task<LoanPaymentHistoryDto?> GetLoanPaymentHistoryAsync(int loanId);
    Task<List<LoanRepaymentScheduleDto>> GetOverdueInstallmentsAsync(int? userId = null);
    Task UpdateOverdueStatusAsync(); // Background service to update overdue loans
}
