using System.ComponentModel.DataAnnotations;

namespace InsuranceService.API.DTOs;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = null!;
}

public class RevokeTokenRequestDto
{
    [Required]
    public string Token { get; set; } = null!;
}

public class TokenResponseDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public DateTime AccessTokenExpiration { get; set; }
    public DateTime RefreshTokenExpiration { get; set; }
}

public class ValidateTokenRequestDto
{
    [Required]
    public string Token { get; set; } = null!;
}

public class ValidateTokenResponseDto
{
    public bool IsValid { get; set; }
    public string? Message { get; set; }
    public int? UserId { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public DateTime? ExpiresAt { get; set; }
}