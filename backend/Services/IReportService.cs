using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IReportService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int year);
    Task<List<PolicyCategoryDistributionDto>> GetPolicyCategoryDistributionAsync();
    Task<List<ClaimStatisticsDto>> GetClaimStatisticsAsync();
    Task<List<RecentActivityDto>> GetRecentActivitiesAsync(int count = 20);
    Task<ComprehensiveReportDto> GetComprehensiveReportAsync(int year);
    Task<List<UserStatisticsDto>> GetTopUsersAsync(int count = 10);
}
