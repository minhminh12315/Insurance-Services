using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InsuranceService.API.Models;

public class RefreshToken
{
    [Key]
    public int RefreshTokenId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Token { get; set; } = null!;

    [Required]
    public DateTime ExpiresAt { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    [MaxLength(500)]
    public string? ReplacedByToken { get; set; }

    [MaxLength(255)]
    public string? ReasonRevoked { get; set; }

    [MaxLength(100)]
    public string? CreatedByIp { get; set; }

    [MaxLength(100)]
    public string? RevokedByIp { get; set; }

    [NotMapped]
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    [NotMapped]
    public bool IsRevoked => RevokedAt != null;

    [NotMapped]
    public bool IsActive => !IsRevoked && !IsExpired;

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}