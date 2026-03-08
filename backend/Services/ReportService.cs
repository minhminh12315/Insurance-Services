using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace InsuranceService.API.Services;

public class ReportService : IReportService
{
    private readonly InsuranceDbContext _context;

    public ReportService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync(u => u.Role == "Customer");
        var totalPolicies = await _context.Policies.CountAsync();
        var activePolicies = await _context.Policies.CountAsync(p => p.PolicyStatus == "Active");
        var expiredPolicies = await _context.Policies.CountAsync(p => p.PolicyStatus == "Expired");
        
        var totalClaims = await _context.Claims.CountAsync();
        var pendingClaims = await _context.Claims.CountAsync(c => c.Status == "Submitted" || c.Status == "UnderReview");
        var approvedClaims = await _context.Claims.CountAsync(c => c.Status == "Approved" || c.Status == "Paid");
        
        var totalPremiumCollected = await _context.PremiumPayments
            .Where(p => p.Status == "Success" || p.Status == "Completed")
            .SumAsync(p => (decimal?)p.AmountPaid) ?? 0;
        
        var totalClaimsPaid = await _context.Claims
            .Where(c => c.Status == "Paid")
            .SumAsync(c => (decimal?)c.ClaimAmount) ?? 0;
        
        var totalLoans = await _context.PolicyLoans.CountAsync();
        var totalLoanAmount = await _context.PolicyLoans
            .Where(l => l.LoanStatus == "Approved")
            .SumAsync(l => (decimal?)l.LoanAmount) ?? 0;

        return new DashboardStatsDto
        {
            TotalUsers = totalUsers,
            TotalPolicies = totalPolicies,
            ActivePolicies = activePolicies,
            ExpiredPolicies = expiredPolicies,
            TotalClaims = totalClaims,
            PendingClaims = pendingClaims,
            ApprovedClaims = approvedClaims,
            TotalPremiumCollected = totalPremiumCollected,
            TotalClaimsPaid = totalClaimsPaid,
            TotalLoans = totalLoans,
            TotalLoanAmount = totalLoanAmount
        };
    }

    public async Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int year)
    {
        var startDate = new DateTime(year, 1, 1);
        var endDate = new DateTime(year, 12, 31, 23, 59, 59);

        var monthlyData = await _context.PremiumPayments
            .Where(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate)
            .Where(p => p.Status == "Success" || p.Status == "Completed")
            .GroupBy(p => new { p.PaymentDate!.Value.Year, p.PaymentDate.Value.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalRevenue = g.Sum(p => p.AmountPaid),
                PolicyCount = g.Count()
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        var result = new List<MonthlyRevenueDto>();
        for (int month = 1; month <= 12; month++)
        {
            var data = monthlyData.FirstOrDefault(m => m.Month == month);
            result.Add(new MonthlyRevenueDto
            {
                Year = year,
                Month = month,
                MonthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month),
                TotalRevenue = data?.TotalRevenue ?? 0,
                PolicyCount = data?.PolicyCount ?? 0
            });
        }

        return result;
    }

    public async Task<List<PolicyCategoryDistributionDto>> GetPolicyCategoryDistributionAsync()
    {
        var totalPolicies = await _context.Policies.CountAsync();

        var distribution = await _context.Policies
            .Include(p => p.Scheme)
            .ThenInclude(s => s.Category)
            .GroupBy(p => p.Scheme.Category!.CategoryName)
            .Select(g => new
            {
                CategoryName = g.Key,
                PolicyCount = g.Count(),
                TotalPremium = g.Sum(p => p.PremiumAmount)
            })
            .ToListAsync();

        return distribution.Select(d => new PolicyCategoryDistributionDto
        {
            CategoryName = d.CategoryName,
            PolicyCount = d.PolicyCount,
            TotalPremium = d.TotalPremium,
            Percentage = totalPolicies > 0 ? (double)d.PolicyCount / totalPolicies * 100 : 0
        }).ToList();
    }

    public async Task<List<ClaimStatisticsDto>> GetClaimStatisticsAsync()
    {
        var statistics = await _context.Claims
            .GroupBy(c => c.Status)
            .Select(g => new ClaimStatisticsDto
            {
                Status = g.Key ?? "Unknown",
                Count = g.Count(),
                TotalAmount = g.Sum(c => c.ClaimAmount)
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return statistics;
    }

    public async Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 20)
    {
        var activities = new List<RecentActivityDto>();

        // Recent Policies
        var recentPolicies = await _context.Policies
            .Include(p => p.User)
            .Include(p => p.Scheme)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count / 4)
            .ToListAsync();

        activities.AddRange(recentPolicies.Select(p => new RecentActivityDto
        {
            ActivityType = "Policy",
            EntityId = p.PolicyId,
            Description = $"New policy created: {p.Scheme.SchemeName} - {p.PolicyNumber}",
            Timestamp = p.CreatedAt ?? DateTime.UtcNow,
            UserName = p.User.FullName
        }));

        // Recent Claims
        var recentClaims = await _context.Claims
            .Include(c => c.User)
            .Where(c => c.CreatedAt != null)
            .OrderByDescending(c => c.CreatedAt)
            .Take(count / 4)
            .ToListAsync();

        activities.AddRange(recentClaims.Select(c => new RecentActivityDto
        {
            ActivityType = "Claim",
            EntityId = c.ClaimId,
            Description = $"Claim filed: {c.ClaimAmount:C} - Status: {c.Status}",
            Timestamp = c.CreatedAt!.Value,
            UserName = c.User.FullName
        }));

        // Recent Payments
        var recentPayments = await _context.PremiumPayments
            .Include(p => p.User)
            .OrderByDescending(p => p.PaymentDate)
            .Take(count / 4)
            .ToListAsync();

        activities.AddRange(recentPayments.Select(p => new RecentActivityDto
        {
            ActivityType = "Payment",
            EntityId = p.PaymentId,
            Description = $"Payment received: {p.AmountPaid:C} via {p.PaymentMethod}",
            Timestamp = p.PaymentDate ?? DateTime.UtcNow,
            UserName = p.User.FullName
        }));

        // Recent Loans
        var recentLoans = await _context.PolicyLoans
            .Include(l => l.User)
            .OrderByDescending(l => l.ApplicationDate)
            .Take(count / 4)
            .ToListAsync();

        activities.AddRange(recentLoans.Select(l => new RecentActivityDto
        {
            ActivityType = "Loan",
            EntityId = l.LoanId,
            Description = $"Loan application: {l.LoanAmount:C} - Status: {l.LoanStatus}",
            Timestamp = DateTime.Parse(l.ApplicationDate.ToString()),
            UserName = l.User.FullName
        }));

        return activities.OrderByDescending(a => a.Timestamp).Take(count).ToList();
    }

    public async Task<ComprehensiveReportDto> GetComprehensiveReportAsync(int year)
    {
        var report = new ComprehensiveReportDto
        {
            OverallStats = await GetDashboardStatsAsync(),
            MonthlyRevenue = await GetMonthlyRevenueAsync(year),
            CategoryDistribution = await GetPolicyCategoryDistributionAsync(),
            ClaimStatistics = await GetClaimStatisticsAsync(),
            RecentActivities = await GetRecentActivitiesAsync(50)
        };

        return report;
    }

    public async Task<List<UserStatisticsDto>> GetTopUsersAsync(int count = 10)
    {
        var users = await _context.Users
            .Where(u => u.Role == "Customer")
            .Select(u => new UserStatisticsDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                PolicyCount = u.Policies.Count,
                TotalPremiumPaid = u.PremiumPayments
                    .Where(p => p.Status == "Success" || p.Status == "Completed")
                    .Sum(p => p.AmountPaid),
                ClaimCount = u.Claims.Count,
                LoanCount = u.PolicyLoans.Count
            })
            .OrderByDescending(u => u.TotalPremiumPaid)
            .Take(count)
            .ToListAsync();

        return users;
    }
}
