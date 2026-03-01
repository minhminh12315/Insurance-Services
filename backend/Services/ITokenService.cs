using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using System.Security.Claims;

namespace InsuranceService.API.Services;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<RefreshToken> SaveRefreshTokenAsync(int userId, string token, string ipAddress);
    Task<ValidateTokenResponseDto> ValidateAccessTokenAsync(string token);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken, string ipAddress);
    Task<bool> RevokeTokenAsync(string token, string ipAddress, string reason);
    Task<bool> RevokeAllUserTokensAsync(int userId, string ipAddress, string reason);
    Task CleanupExpiredTokensAsync();
}