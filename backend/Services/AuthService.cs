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
    private readonly IEmailService _emailService;

    public AuthService(InsuranceDbContext context, IConfiguration configuration, ITokenService tokenService, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _tokenService = tokenService;
        _emailService = emailService;
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

    public async Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordRequestDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "User not found"
            };
        }

        if (!VerifyPassword(request.OldPassword, user.PasswordHash))
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Old password is incorrect"
            };
        }

        user.PasswordHash = HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Password updated successfully"
        };
    }

    public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordDto request)
    {
        // Case 1: Send OTP (No OtpCode provided)
        if (string.IsNullOrEmpty(request.OtpCode))
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return new AuthResponseDto { Success = false, Message = "Email không tồn tại trong hệ thống." };
            }

            var otpCode = new Random().Next(100000, 999999).ToString();
            var otpEntry = new UserOtp
            {
                Email = request.Email,
                OtpCode = otpCode,
                ExpiryDate = DateTime.UtcNow.AddMinutes(1)
            };

            _context.UserOtps.Add(otpEntry);
            await _context.SaveChangesAsync();

            await _emailService.SendNotificationEmailAsync(
                request.Email,
                user.FullName,
                "Mã xác thực đặt lại mật khẩu",
                $"Mã OTP của bạn là: <strong>{otpCode}</strong>. Có hiệu lực trong 10 phút."
            );

            return new AuthResponseDto { Success = true, Message = "Mã OTP đã được gửi về email." };
        }

        // Case 2: Verify OTP and Reset Password
        var otpRecord = await _context.UserOtps
            .Where(o => o.Email == request.Email && o.OtpCode == request.OtpCode && !o.IsUsed && o.ExpiryDate > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otpRecord == null)
        {
            return new AuthResponseDto { Success = false, Message = "Mã OTP không hợp lệ hoặc đã hết hạn." };
        }

        if (string.IsNullOrEmpty(request.NewPassword))
        {
            return new AuthResponseDto { Success = false, Message = "Vui lòng nhập mật khẩu mới." };
        }

        var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (dbUser == null) return new AuthResponseDto { Success = false, Message = "Người dùng không tồn tại." };

        dbUser.PasswordHash = HashPassword(request.NewPassword);
        dbUser.UpdatedAt = DateTime.UtcNow;
        otpRecord.IsUsed = true;

        await _context.SaveChangesAsync();
        return new AuthResponseDto { Success = true, Message = "Đặt lại mật khẩu thành công!" };
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