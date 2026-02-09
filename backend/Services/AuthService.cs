using InsuranceService.API.DTOs;
using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace InsuranceService.API.Services;

public class AuthService : IAuthService
{
    private readonly InsuranceDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    public AuthService(InsuranceDbContext context, IConfiguration configuration, ITokenService tokenService)
    {
        _context = context;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string ipAddress)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Email already exists"
            };
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            Address = request.Address,
            City = request.City,
            Role = "Customer",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        await _tokenService.SaveRefreshTokenAsync(user.UserId, refreshToken, ipAddress);

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationHours = Convert.ToDouble(jwtSettings["ExpirationInHours"] ?? "24");

        return new AuthResponseDto
        {
            Success = true,
            Message = "Registration successful",
            Token = accessToken,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(expirationHours),
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        await _tokenService.SaveRefreshTokenAsync(user.UserId, refreshToken, ipAddress);

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationHours = Convert.ToDouble(jwtSettings["ExpirationInHours"] ?? "24");

        return new AuthResponseDto
        {
            Success = true,
            Message = "Login successful",
            Token = accessToken,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(expirationHours),
            User = MapToUserDto(user)
        };
    }

    public async Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken, string ipAddress)
    {
        return await _tokenService.RefreshTokenAsync(refreshToken, ipAddress);
    }

    public async Task<bool> RevokeTokenAsync(string token, string ipAddress)
    {
        return await _tokenService.RevokeTokenAsync(token, ipAddress, "Revoked by user");
    }

    public async Task<bool> LogoutAsync(int userId, string ipAddress)
    {
        return await _tokenService.RevokeAllUserTokensAsync(userId, ipAddress, "User logged out");
    }

    public async Task<ValidateTokenResponseDto> ValidateTokenAsync(string token)
    {
        return await _tokenService.ValidateAccessTokenAsync(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string passwordHash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == passwordHash;
    }

    private UserDto MapToUserDto(User user)
    {
        return new UserDto
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
            CreatedAt = user.CreatedAt
        };
    }
}
