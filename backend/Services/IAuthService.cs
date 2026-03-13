using InsuranceService.API.DTOs;

namespace InsuranceService.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string ipAddress);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress);
    Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken, string ipAddress);
    Task<bool> RevokeTokenAsync(string token, string ipAddress);
    Task<bool> LogoutAsync(int userId, string ipAddress);
    Task<ValidateTokenResponseDto> ValidateTokenAsync(string token);
    Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request);
    Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto request);
}