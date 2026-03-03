using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace InsuranceService.API.Services;

public class UserService : IUserService
{
    private readonly InsuranceDbContext _context;

    public UserService(InsuranceDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto?> GetUserProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            return null;

        return MapToDto(user);
    }

    public async Task<UserProfileDto?> UpdateUserProfileAsync(int userId, UpdateUserProfileDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            return null;

        // Update user properties
        user.FullName = dto.FullName;
        user.PhoneNumber = dto.PhoneNumber;
        user.DateOfBirth = dto.DateOfBirth;
        user.Gender = dto.Gender;
        user.Address = dto.Address;
        user.City = dto.City;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
            return false;

        // Verify current password
        if (!VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect");

        // Update password
        user.PasswordHash = HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(string? role = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role))
            query = query.Where(u => u.Role == role);

        var users = await query.OrderByDescending(u => u.CreatedAt).ToListAsync();

        return users.Select(MapToDto);
    }

    public async Task<UserProfileDto?> GetUserByIdAsync(int userId)
    {
        return await GetUserProfileAsync(userId);
    }

    private UserProfileDto MapToDto(User user)
    {
        return new UserProfileDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Address = user.Address,
            City = user.City,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == hash;
    }
}
