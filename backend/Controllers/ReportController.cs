using InsuranceService.API.DTOs;
using InsuranceService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsuranceService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Employee")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Get dashboard statistics overview
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboardStats()
    {
        var stats = await _reportService.GetDashboardStatsAsync();
        return Ok(new { success = true, data = stats });
    }

    /// <summary>
    /// Get monthly revenue report
    /// </summary>
    [HttpGet("monthly-revenue")]
    public async Task<ActionResult> GetMonthlyRevenue([FromQuery] int year = 0)
    {
        if (year == 0)
            year = DateTime.Now.Year;

        var revenue = await _reportService.GetMonthlyRevenueAsync(year);
        return Ok(new { success = true, data = revenue });
    }

    /// <summary>
    /// Get policy category distribution
    /// </summary>
    [HttpGet("category-distribution")]
    public async Task<ActionResult> GetCategoryDistribution()
    {
        var distribution = await _reportService.GetPolicyCategoryDistributionAsync();
        return Ok(new { success = true, data = distribution });
    }

    /// <summary>
    /// Get claim statistics
    /// </summary>
    [HttpGet("claim-statistics")]
    public async Task<ActionResult> GetClaimStatistics()
    {
        var statistics = await _reportService.GetClaimStatisticsAsync();
        return Ok(new { success = true, data = statistics });
    }

    /// <summary>
    /// Get recent activities
    /// </summary>
    [HttpGet("recent-activities")]
    public async Task<ActionResult> GetRecentActivities([FromQuery] int count = 20)
    {
        var activities = await _reportService.GetRecentActivitiesAsync(count);
        return Ok(new { success = true, data = activities });
    }

    /// <summary>
    /// Get comprehensive report
    /// </summary>
    [HttpGet("comprehensive")]
    public async Task<ActionResult> GetComprehensiveReport([FromQuery] int year = 0)
    {
        if (year == 0)
            year = DateTime.Now.Year;

        var report = await _reportService.GetComprehensiveReportAsync(year);
        return Ok(new { success = true, data = report });
    }

    /// <summary>
    /// Get top users by premium paid
    /// </summary>
    [HttpGet("top-users")]
    public async Task<ActionResult> GetTopUsers([FromQuery] int count = 10)
    {
        var users = await _reportService.GetTopUsersAsync(count);
        return Ok(new { success = true, data = users });
    }
}
