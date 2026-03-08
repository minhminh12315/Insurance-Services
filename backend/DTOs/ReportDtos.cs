namespace InsuranceService.API.DTOs;

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public int ExpiredPolicies { get; set; }
    public int TotalClaims { get; set; }
    public int PendingClaims { get; set; }
    public int ApprovedClaims { get; set; }
    public decimal TotalPremiumCollected { get; set; }
    public decimal TotalClaimsPaid { get; set; }
    public int TotalLoans { get; set; }
    public decimal TotalLoanAmount { get; set; }
}

public class MonthlyRevenueDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int PolicyCount { get; set; }
}

public class PolicyCategoryDistributionDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int PolicyCount { get; set; }
    public decimal TotalPremium { get; set; }
    public double Percentage { get; set; }
}

public class ClaimStatisticsDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalAmount { get; set; }
}

public class RecentActivityDto
{
    public string ActivityType { get; set; } = string.Empty; // Policy, Claim, Payment, Loan
    public int EntityId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string UserName { get; set; } = string.Empty;
}

public class ComprehensiveReportDto
{
    public DashboardStatsDto OverallStats { get; set; } = new();
    public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new();
    public List<PolicyCategoryDistributionDto> CategoryDistribution { get; set; } = new();
    public List<ClaimStatisticsDto> ClaimStatistics { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
}

public class UserStatisticsDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int PolicyCount { get; set; }
    public decimal TotalPremiumPaid { get; set; }
    public int ClaimCount { get; set; }
    public int LoanCount { get; set; }
}
