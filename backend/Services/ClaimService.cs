using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Services;

public class ClaimService : IClaimService
{
    private readonly InsuranceDbContext _context;

    public ClaimService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ClaimDto>> GetAllClaimsAsync(int? userId = null, string? status = null)
    {
        var query = _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(c => c.UserId == userId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(c => c.Status == status);

        return await query.Select(c => new ClaimDto
        {
            ClaimId = c.ClaimId,
            PolicyId = c.PolicyId,
            PolicyNumber = c.Policy.PolicyNumber,
            UserId = c.UserId,
            UserName = c.User.FullName,
            ClaimDate = c.ClaimDate,
            ClaimAmount = c.ClaimAmount,
            Reason = c.Reason,
            Status = c.Status,
            AdminComment = c.AdminComment
        }).ToListAsync();
    }

    public async Task<ClaimDto?> GetClaimByIdAsync(int claimId)
    {
        var claim = await _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.ClaimId == claimId);

        if (claim == null)
            return null;

        return new ClaimDto
        {
            ClaimId = claim.ClaimId,
            PolicyId = claim.PolicyId,
            PolicyNumber = claim.Policy.PolicyNumber,
            UserId = claim.UserId,
            UserName = claim.User.FullName,
            ClaimDate = claim.ClaimDate,
            ClaimAmount = claim.ClaimAmount,
            Reason = claim.Reason,
            Status = claim.Status,
            AdminComment = claim.AdminComment
        };
    }

    public async Task<IEnumerable<ClaimDto>> GetUserClaimsAsync(int userId)
    {
        return await GetAllClaimsAsync(userId, null);
    }

    public async Task<ClaimDto> CreateClaimAsync(int userId, CreateClaimDto dto)
    {
        // Validate policy exists and belongs to user
        var policy = await _context.Policies
            .FirstOrDefaultAsync(p => p.PolicyId == dto.PolicyId && p.UserId == userId);

        if (policy == null)
            throw new InvalidOperationException("Policy not found or does not belong to you");

        if (policy.PolicyStatus != "Active")
            throw new InvalidOperationException("Can only file claims for active policies");

        // Validate claim amount doesn't exceed sum assured
        if (dto.ClaimAmount > policy.SumAssured)
            throw new InvalidOperationException($"Claim amount cannot exceed sum assured ({policy.SumAssured:C})");

        var claim = new Models.Claim
        {
            PolicyId = dto.PolicyId,
            UserId = userId,
            ClaimDate = DateOnly.FromDateTime(DateTime.Today),
            ClaimAmount = dto.ClaimAmount,
            Reason = dto.Reason,
            Status = "Submitted"
        };

        _context.Claims.Add(claim);
        await _context.SaveChangesAsync();

        return (await GetClaimByIdAsync(claim.ClaimId))!;
    }

    public async Task<ClaimDto?> UpdateClaimStatusAsync(int claimId, UpdateClaimStatusDto dto)
    {
        var claim = await _context.Claims.FindAsync(claimId);
        if (claim == null)
            return null;

        var validStatuses = new[] { "Submitted", "UnderReview", "Approved", "Rejected", "Paid" };
        if (!validStatuses.Contains(dto.Status))
            throw new InvalidOperationException($"Invalid status. Must be one of: {string.Join(", ", validStatuses)}");

        claim.Status = dto.Status;
        claim.AdminComment = dto.AdminComment;

        await _context.SaveChangesAsync();

        return await GetClaimByIdAsync(claimId);
    }
}
