using System;
using System.Collections.Generic;

namespace InsuranceService.API.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public DateOnly DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Role { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();

    public virtual ICollection<NewsAndAnnouncement> NewsAndAnnouncements { get; set; } = new List<NewsAndAnnouncement>();

    public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();

    public virtual ICollection<PolicyLoan> PolicyLoans { get; set; } = new List<PolicyLoan>();

    public virtual ICollection<PremiumPayment> PremiumPayments { get; set; } = new List<PremiumPayment>();
}
