using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IUserService
{
    Task<UserProfileDto?> GetUserProfileAsync(int userId);
    Task<UserProfileDto?> UpdateUserProfileAsync(int userId, UpdateUserProfileDto dto);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(string? role = null);
    Task<UserProfileDto?> GetUserByIdAsync(int userId);
}
