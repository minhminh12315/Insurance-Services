using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class PremiumPaymentService : IPremiumPaymentService
{
    private readonly InsuranceDbContext _context;

    public PremiumPaymentService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PremiumPaymentDto>> GetAllPaymentsAsync(int? userId = null, int? policyId = null)
    {
        var query = _context.PremiumPayments
            .Include(p => p.Policy)
            .Include(p => p.User)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(p => p.UserId == userId.Value);

        if (policyId.HasValue)
            query = query.Where(p => p.PolicyId == policyId.Value);

        return await query.Select(p => new PremiumPaymentDto
        {
            PaymentId = p.PaymentId,
            PolicyId = p.PolicyId,
            PolicyNumber = p.Policy.PolicyNumber,
            UserId = p.UserId,
            UserName = p.User.FullName,
            AmountPaid = p.AmountPaid,
            PaymentDate = p.PaymentDate,
            PaymentMethod = p.PaymentMethod,
            TransactionReference = p.TransactionReference,
            Status = p.Status
        }).ToListAsync();
    }

    public async Task<PremiumPaymentDto?> GetPaymentByIdAsync(int paymentId)
    {
        var payment = await _context.PremiumPayments
            .Include(p => p.Policy)
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

        if (payment == null)
            return null;

        return new PremiumPaymentDto
        {
            PaymentId = payment.PaymentId,
            PolicyId = payment.PolicyId,
            PolicyNumber = payment.Policy.PolicyNumber,
            UserId = payment.UserId,
            UserName = payment.User.FullName,
            AmountPaid = payment.AmountPaid,
            PaymentDate = payment.PaymentDate,
            PaymentMethod = payment.PaymentMethod,
            TransactionReference = payment.TransactionReference,
            Status = payment.Status
        };
    }

    public async Task<IEnumerable<PremiumPaymentDto>> GetUserPaymentsAsync(int userId)
    {
        return await GetAllPaymentsAsync(userId, null);
    }

    public async Task<PremiumPaymentDto> CreatePaymentAsync(int userId, CreatePaymentDto dto)
    {
        var policy = await _context.Policies
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId && p.UserId == userId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found or does not belong to you");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Can only make payments for active policies");

        var payment = new PremiumPayment
        {
            PolicyId = dto.PolicyId,
            UserId = userId,
            AmountPaid = dto.AmountPaid,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = dto.PaymentMethod,
            TransactionReference = dto.TransactionReference ?? $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            Status = "Completed"
        };

        _context.PremiumPayments.Add(payment);
        await _context.SaveChangesAsync();

        return (await GetPaymentByIdAsync(payment.PaymentId))!;
    }

    public async Task<PremiumPaymentDto?> UpdatePaymentStatusAsync(int paymentId, UpdatePaymentStatusDto dto)
    {
        var payment = await _context.PremiumPayments.FindAsync(paymentId);
        if (payment == null)
            return null;

        var validStatuses = new[] { "Pending", "Completed", "Failed", "Refunded" };
        if (!validStatuses.Contains(dto.Status))
            throw new InvalidOperationException($"Invalid status. Must be one of: {string.Join(", ", validStatuses)}");

        payment.Status = dto.Status;
        await _context.SaveChangesAsync();

        return await GetPaymentByIdAsync(paymentId);
    }
}

public class PolicyLoanService : IPolicyLoanService
{
    private readonly InsuranceDbContext _context;

    public PolicyLoanService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PolicyLoanDto>> GetAllLoansAsync(int? userId = null)
    {
        var query = _context.PolicyLoans
            .Include(l => l.Policy)
            .Include(l => l.User)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);

        return await query.Select(l => new PolicyLoanDto
        {
            LoanId = l.LoanId,
            PolicyId = l.PolicyId,
            PolicyNumber = l.Policy.PolicyNumber,
            UserId = l.UserId,
            UserName = l.User.FullName,
            LoanAmount = l.LoanAmount,
            InterestRate = l.InterestRate,
            ApplicationDate = l.ApplicationDate,
            ApprovalDate = l.ApprovalDate,
            LoanStatus = l.LoanStatus
        }).ToListAsync();
    }

    public async Task<PolicyLoanDto?> GetLoanByIdAsync(int loanId)
    {
        var loan = await _context.PolicyLoans
            .Include(l => l.Policy)
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.LoanId == loanId);

        if (loan == null)
            return null;

        return new PolicyLoanDto
        {
            LoanId = loan.LoanId,
            PolicyId = loan.PolicyId,
            PolicyNumber = loan.Policy.PolicyNumber,
            UserId = loan.UserId,
            UserName = loan.User.FullName,
            LoanAmount = loan.LoanAmount,
            InterestRate = loan.InterestRate,
            ApplicationDate = loan.ApplicationDate,
            ApprovalDate = loan.ApprovalDate,
            LoanStatus = loan.LoanStatus
        };
    }

    public async Task<IEnumerable<PolicyLoanDto>> GetUserLoansAsync(int userId)
    {
        return await GetAllLoansAsync(userId);
    }

    public async Task<PolicyLoanDto> CreateLoanAsync(int userId, CreatePolicyLoanDto dto)
    {
        var policy = await _context.Policies
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId && p.UserId == userId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found or does not belong to you");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Can only request loans for active policies");

        // Check if policy has sufficient surrender value (typically 40% of sum assured after 3 years)
        var policyAge = DateTime.Today.Year - policy.StartDate.Year;
        if (policyAge < 3)
            throw new InvalidOperationException("Policy must be at least 3 years old to be eligible for loan");

        var maxLoanAmount = policy.SumAssured * 0.4m; // 40% of sum assured
        if (dto.LoanAmount > maxLoanAmount)
            throw new InvalidOperationException($"Loan amount cannot exceed {maxLoanAmount:C} (40% of sum assured)");

        var loan = new PolicyLoan
        {
            PolicyId = dto.PolicyId,
            UserId = userId,
            LoanAmount = dto.LoanAmount,
            InterestRate = 8.5m, // Default interest rate
            ApplicationDate = DateOnly.FromDateTime(DateTime.Today),
            LoanStatus = "Requested"
        };

        _context.PolicyLoans.Add(loan);
        await _context.SaveChangesAsync();

        return (await GetLoanByIdAsync(loan.LoanId))!;
    }

    public async Task<PolicyLoanDto?> UpdateLoanStatusAsync(int loanId, UpdateLoanStatusDto dto)
    {
        var loan = await _context.PolicyLoans.FindAsync(loanId);
        if (loan == null)
            return null;

        var validStatuses = new[] { "Requested", "Approved", "Rejected", "Disbursed", "Repaid" };
        if (!validStatuses.Contains(dto.LoanStatus))
            throw new InvalidOperationException($"Invalid status. Must be one of: {string.Join(", ", validStatuses)}");

        loan.LoanStatus = dto.LoanStatus;
        if (dto.LoanStatus == "Approved" && loan.ApprovalDate == null)
            loan.ApprovalDate = DateOnly.FromDateTime(DateTime.Today);

        await _context.SaveChangesAsync();

        return await GetLoanByIdAsync(loanId);
    }
}

public class NewsService : INewsService
{
    private readonly InsuranceDbContext _context;

    public NewsService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NewsDto>> GetAllNewsAsync()
    {
        return await _context.NewsAndAnnouncements
            .Include(n => n.Author)
            .OrderByDescending(n => n.PublishedDate)
            .Select(n => new NewsDto
            {
                NewsId = n.NewsId,
                Title = n.Title,
                Content = n.Content,
                PublishedDate = n.PublishedDate,
                AuthorId = n.AuthorId,
                AuthorName = n.Author != null ? n.Author.FullName : null
            }).ToListAsync();
    }

    public async Task<NewsDto?> GetNewsByIdAsync(int newsId)
    {
        var news = await _context.NewsAndAnnouncements
            .Include(n => n.Author)
            .FirstOrDefaultAsync(n => n.NewsId == newsId);

        if (news == null)
            return null;

        return new NewsDto
        {
            NewsId = news.NewsId,
            Title = news.Title,
            Content = news.Content,
            PublishedDate = news.PublishedDate,
            AuthorId = news.AuthorId,
            AuthorName = news.Author?.FullName
        };
    }

    public async Task<NewsDto> CreateNewsAsync(int authorId, CreateNewsDto dto)
    {
        var news = new NewsAndAnnouncement
        {
            Title = dto.Title,
            Content = dto.Content,
            PublishedDate = DateTime.UtcNow,
            AuthorId = authorId
        };

        _context.NewsAndAnnouncements.Add(news);
        await _context.SaveChangesAsync();

        return (await GetNewsByIdAsync(news.NewsId))!;
    }

    public async Task<NewsDto?> UpdateNewsAsync(int newsId, UpdateNewsDto dto)
    {
        var news = await _context.NewsAndAnnouncements.FindAsync(newsId);
        if (news == null)
            return null;

        news.Title = dto.Title;
        news.Content = dto.Content;

        await _context.SaveChangesAsync();

        return await GetNewsByIdAsync(newsId);
    }

    public async Task<bool> DeleteNewsAsync(int newsId)
    {
        var news = await _context.NewsAndAnnouncements.FindAsync(newsId);
        if (news == null)
            return false;

        _context.NewsAndAnnouncements.Remove(news);
        await _context.SaveChangesAsync();
        return true;
    }
}
