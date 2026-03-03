using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class LoanRepaymentService : ILoanRepaymentService
{
    private readonly InsuranceDbContext _context;
    private readonly INotificationService _notificationService;

    public LoanRepaymentService(InsuranceDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<LoanScheduleSummaryDto> GenerateRepaymentScheduleAsync(GenerateLoanScheduleDto dto)
    {
        var loan = await _context.PolicyLoans
            .Include(l => l.Policy)
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.LoanId == dto.LoanId);

        if (loan == null)
            throw new InvalidOperationException("Loan not found");

        if (loan.LoanStatus != "Approved")
            throw new InvalidOperationException("Only approved loans can have repayment schedules generated");

        // Check if schedule already exists
        var existingSchedule = await _context.Set<LoanRepaymentSchedule>()
            .FirstOrDefaultAsync(s => s.LoanId == dto.LoanId);

        if (existingSchedule != null)
            throw new InvalidOperationException("Repayment schedule already exists for this loan. Use GetLoanScheduleAsync to retrieve it.");

        // Calculate monthly payment using EMI formula
        var principal = loan.LoanAmount;
        var annualRate = loan.InterestRate;
        var monthlyRate = annualRate / 100 / 12;
        var months = dto.RepaymentMonths;

        // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        var emi = principal * monthlyRate * (decimal)Math.Pow((double)(1 + monthlyRate), months) /
                  ((decimal)Math.Pow((double)(1 + monthlyRate), months) - 1);

        emi = Math.Round(emi, 2);

        // Set first payment date
        var firstPaymentDate = dto.FirstPaymentDate ?? DateOnly.FromDateTime(DateTime.Today.AddMonths(1));

        var outstandingBalance = principal;
        var schedules = new List<LoanRepaymentSchedule>();

        for (int i = 1; i <= months; i++)
        {
            var interestAmount = Math.Round(outstandingBalance * monthlyRate, 2);
            var principalAmount = Math.Round(emi - interestAmount, 2);

            // Adjust last installment to account for rounding differences
            if (i == months)
            {
                principalAmount = outstandingBalance;
                emi = principalAmount + interestAmount;
            }

            outstandingBalance -= principalAmount;
            if (outstandingBalance < 0) outstandingBalance = 0;

            var schedule = new LoanRepaymentSchedule
            {
                LoanId = dto.LoanId,
                InstallmentNumber = i,
                DueDate = firstPaymentDate.AddMonths(i - 1),
                PrincipalAmount = principalAmount,
                InterestAmount = interestAmount,
                TotalAmount = principalAmount + interestAmount,
                OutstandingBalance = outstandingBalance,
                IsPaid = false
            };

            schedules.Add(schedule);
        }

        // Save all schedules
        _context.Set<LoanRepaymentSchedule>().AddRange(schedules);

        // Update loan status
        loan.LoanStatus = "Active";

        await _context.SaveChangesAsync();

        // Send notification
        await _notificationService.CreateNotificationAsync(new CreateNotificationDto
        {
            UserId = loan.UserId,
            Title = "Loan Repayment Schedule Generated",
            Message = $"Your loan repayment schedule has been created. Monthly payment: ₫{emi:N0} for {months} months.",
            NotificationType = "LoanUpdate",
            RelatedEntityId = dto.LoanId,
            RelatedEntityType = "Loan",
            SendEmail = true
        });

        return await GetLoanScheduleAsync(dto.LoanId) 
            ?? throw new InvalidOperationException("Failed to retrieve schedule");
    }

    public async Task<LoanScheduleSummaryDto?> GetLoanScheduleAsync(int loanId)
    {
        var loan = await _context.PolicyLoans
            .Include(l => l.Policy)
            .FirstOrDefaultAsync(l => l.LoanId == loanId);

        if (loan == null)
            return null;

        var schedules = await _context.Set<LoanRepaymentSchedule>()
            .Where(s => s.LoanId == loanId)
            .OrderBy(s => s.InstallmentNumber)
            .ToListAsync();

        if (!schedules.Any())
            return null;

        var today = DateOnly.FromDateTime(DateTime.Today);
        var scheduleDtos = schedules.Select(s => MapToDto(s, today)).ToList();

        var totalPaid = schedules.Where(s => s.IsPaid).Sum(s => s.PaidAmount ?? 0);
        var totalOutstanding = schedules.Where(s => !s.IsPaid).Sum(s => s.TotalAmount);
        var paidCount = schedules.Count(s => s.IsPaid);
        var pendingCount = schedules.Count(s => !s.IsPaid && s.DueDate >= today);
        var overdueCount = schedules.Count(s => !s.IsPaid && s.DueDate < today);

        var nextDue = schedules.FirstOrDefault(s => !s.IsPaid && s.DueDate >= today);

        var totalInterest = schedules.Sum(s => s.InterestAmount);
        var totalRepayable = loan.LoanAmount + totalInterest;
        var monthlyPayment = schedules.FirstOrDefault()?.TotalAmount ?? 0;

        return new LoanScheduleSummaryDto
        {
            LoanId = loanId,
            PolicyNumber = loan.Policy.PolicyNumber,
            LoanAmount = loan.LoanAmount,
            InterestRate = loan.InterestRate,
            TotalInstallments = schedules.Count,
            MonthlyPayment = monthlyPayment,
            TotalInterest = totalInterest,
            TotalRepayable = totalRepayable,
            Schedule = scheduleDtos,
            PaidInstallments = paidCount,
            PendingInstallments = pendingCount,
            OverdueInstallments = overdueCount,
            TotalPaid = totalPaid,
            TotalOutstanding = totalOutstanding,
            NextDueDate = nextDue?.DueDate,
            NextDueAmount = nextDue?.TotalAmount
        };
    }

    public async Task<LoanRepaymentScheduleDto?> RecordPaymentAsync(RecordLoanPaymentDto dto)
    {
        var schedule = await _context.Set<LoanRepaymentSchedule>()
            .Include(s => s.Loan)
                .ThenInclude(l => l.User)
            .FirstOrDefaultAsync(s => s.ScheduleId == dto.ScheduleId);

        if (schedule == null)
            throw new InvalidOperationException("Repayment schedule not found");

        if (schedule.IsPaid)
            throw new InvalidOperationException("This installment has already been paid");

        // Calculate late fee if overdue
        var today = DateOnly.FromDateTime(DateTime.Today);
        var paymentDate = dto.PaymentDate.HasValue 
            ? DateOnly.FromDateTime(dto.PaymentDate.Value) 
            : today;

        decimal lateFee = 0;
        int daysOverdue = 0;

        if (paymentDate > schedule.DueDate)
        {
            daysOverdue = paymentDate.DayNumber - schedule.DueDate.DayNumber;
            // Late fee: 0.5% per day overdue, max 10% of installment
            lateFee = Math.Min(
                schedule.TotalAmount * 0.005m * daysOverdue,
                schedule.TotalAmount * 0.10m
            );
            lateFee = Math.Round(lateFee, 2);
        }

        var totalDue = schedule.TotalAmount + lateFee;

        if (dto.PaidAmount < totalDue)
            throw new InvalidOperationException($"Payment amount (₫{dto.PaidAmount:N0}) is less than total due (₫{totalDue:N0} including late fee ₫{lateFee:N0})");

        // Record payment
        schedule.IsPaid = true;
        schedule.PaidDate = dto.PaymentDate ?? DateTime.UtcNow;
        schedule.PaidAmount = dto.PaidAmount;
        schedule.PaymentReference = dto.PaymentReference;
        schedule.DaysOverdue = daysOverdue > 0 ? daysOverdue : null;
        schedule.LateFee = lateFee > 0 ? lateFee : null;

        await _context.SaveChangesAsync();

        // Check if all installments are paid
        var allPaid = await _context.Set<LoanRepaymentSchedule>()
            .Where(s => s.LoanId == schedule.LoanId)
            .AllAsync(s => s.IsPaid);

        if (allPaid)
        {
            // Mark loan as completed
            schedule.Loan.LoanStatus = "Completed";
            await _context.SaveChangesAsync();

            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = schedule.Loan.UserId,
                Title = "Loan Fully Repaid",
                Message = $"Congratulations! You have successfully repaid your entire loan. Total paid: ₫{dto.PaidAmount:N0}",
                NotificationType = "LoanUpdate",
                RelatedEntityId = schedule.LoanId,
                RelatedEntityType = "Loan",
                SendEmail = true
            });
        }
        else
        {
            await _notificationService.CreateNotificationAsync(new CreateNotificationDto
            {
                UserId = schedule.Loan.UserId,
                Title = "Loan Payment Received",
                Message = $"Payment of ₫{dto.PaidAmount:N0} received for installment #{schedule.InstallmentNumber}.",
                NotificationType = "LoanUpdate",
                RelatedEntityId = schedule.LoanId,
                RelatedEntityType = "Loan",
                SendEmail = true
            });
        }

        return MapToDto(schedule, today);
    }

    public async Task<LoanPaymentHistoryDto?> GetLoanPaymentHistoryAsync(int loanId)
    {
        var loan = await _context.PolicyLoans
            .Include(l => l.Policy)
            .FirstOrDefaultAsync(l => l.LoanId == loanId);

        if (loan == null)
            return null;

        var paidSchedules = await _context.Set<LoanRepaymentSchedule>()
            .Where(s => s.LoanId == loanId && s.IsPaid)
            .OrderBy(s => s.PaidDate)
            .ToListAsync();

        var today = DateOnly.FromDateTime(DateTime.Today);
        var payments = paidSchedules.Select(s => MapToDto(s, today)).ToList();

        var totalPaid = paidSchedules.Sum(s => s.PaidAmount ?? 0);
        var totalPrincipal = paidSchedules.Sum(s => s.PrincipalAmount);
        var totalInterest = paidSchedules.Sum(s => s.InterestAmount);
        var totalLateFees = paidSchedules.Sum(s => s.LateFee ?? 0);

        return new LoanPaymentHistoryDto
        {
            LoanId = loanId,
            PolicyNumber = loan.Policy.PolicyNumber,
            Payments = payments,
            TotalPaid = totalPaid,
            TotalPrincipalPaid = totalPrincipal,
            TotalInterestPaid = totalInterest,
            TotalLateFees = totalLateFees,
            PaymentsCount = payments.Count
        };
    }

    public async Task<List<LoanRepaymentScheduleDto>> GetOverdueInstallmentsAsync(int? userId = null)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var query = _context.Set<LoanRepaymentSchedule>()
            .Include(s => s.Loan)
                .ThenInclude(l => l.Policy)
            .Where(s => !s.IsPaid && s.DueDate < today);

        if (userId.HasValue)
        {
            query = query.Where(s => s.Loan.UserId == userId.Value);
        }

        var overdueSchedules = await query
            .OrderBy(s => s.DueDate)
            .ToListAsync();

        return overdueSchedules.Select(s => MapToDto(s, today)).ToList();
    }

    public async Task UpdateOverdueStatusAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var overdueSchedules = await _context.Set<LoanRepaymentSchedule>()
            .Include(s => s.Loan)
                .ThenInclude(l => l.User)
            .Where(s => !s.IsPaid && s.DueDate < today && s.DaysOverdue == null)
            .ToListAsync();

        foreach (var schedule in overdueSchedules)
        {
            var daysOverdue = today.DayNumber - schedule.DueDate.DayNumber;
            schedule.DaysOverdue = daysOverdue;

            // Calculate late fee
            var lateFee = Math.Min(
                schedule.TotalAmount * 0.005m * daysOverdue,
                schedule.TotalAmount * 0.10m
            );
            schedule.LateFee = Math.Round(lateFee, 2);

            // Send notification for newly overdue (first day only)
            if (daysOverdue == 1)
            {
                await _notificationService.CreateNotificationAsync(new CreateNotificationDto
                {
                    UserId = schedule.Loan.UserId,
                    Title = "Loan Payment Overdue",
                    Message = $"Your loan installment #{schedule.InstallmentNumber} is now overdue. Please make payment to avoid additional late fees.",
                    NotificationType = "LoanUpdate",
                    RelatedEntityId = schedule.LoanId,
                    RelatedEntityType = "Loan",
                    SendEmail = true
                });
            }
        }

        if (overdueSchedules.Any())
        {
            await _context.SaveChangesAsync();
        }
    }

    private LoanRepaymentScheduleDto MapToDto(LoanRepaymentSchedule schedule, DateOnly today)
    {
        string status;
        if (schedule.IsPaid)
        {
            status = "Paid";
        }
        else if (schedule.DueDate < today)
        {
            status = "Overdue";
        }
        else if (schedule.DueDate == today)
        {
            status = "Due";
        }
        else
        {
            status = "Upcoming";
        }

        return new LoanRepaymentScheduleDto
        {
            ScheduleId = schedule.ScheduleId,
            LoanId = schedule.LoanId,
            InstallmentNumber = schedule.InstallmentNumber,
            DueDate = schedule.DueDate,
            PrincipalAmount = schedule.PrincipalAmount,
            InterestAmount = schedule.InterestAmount,
            TotalAmount = schedule.TotalAmount,
            OutstandingBalance = schedule.OutstandingBalance,
            IsPaid = schedule.IsPaid,
            PaidDate = schedule.PaidDate,
            PaidAmount = schedule.PaidAmount,
            PaymentReference = schedule.PaymentReference,
            DaysOverdue = schedule.DaysOverdue,
            LateFee = schedule.LateFee,
            Status = status
        };
    }
}
