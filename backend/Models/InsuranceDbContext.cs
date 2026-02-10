using System;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Models;

public class InsuranceDbContext : DbContext
{
    public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Claim> Claims { get; set; }

    public virtual DbSet<InsuranceCategory> InsuranceCategories { get; set; }

    public virtual DbSet<InsuranceScheme> InsuranceSchemes { get; set; }

    public virtual DbSet<NewsAndAnnouncement> NewsAndAnnouncements { get; set; }

    public virtual DbSet<Policy> Policies { get; set; }

    public virtual DbSet<PolicyDetailsHome> PolicyDetailsHomes { get; set; }

    public virtual DbSet<PolicyDetailsLife> PolicyDetailsLives { get; set; }

    public virtual DbSet<PolicyDetailsMedical> PolicyDetailsMedicals { get; set; }

    public virtual DbSet<PolicyDetailsMotor> PolicyDetailsMotors { get; set; }

    public virtual DbSet<PolicyLoan> PolicyLoans { get; set; }

    public virtual DbSet<PremiumPayment> PremiumPayments { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure unique indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Policy>()
            .HasIndex(p => p.PolicyNumber)
            .IsUnique();

        // Configure Policy relationships
        modelBuilder.Entity<Policy>()
            .HasOne(p => p.User)
            .WithMany(u => u.Policies)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Policy>()
            .HasOne(p => p.Scheme)
            .WithMany(s => s.Policies)
            .HasForeignKey(p => p.SchemeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Claim relationships
        modelBuilder.Entity<Claim>()
            .HasOne(c => c.User)
            .WithMany(u => u.Claims)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Claim>()
            .HasOne(c => c.Policy)
            .WithMany(p => p.Claims)
            .HasForeignKey(c => c.PolicyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure PolicyLoan relationships
        modelBuilder.Entity<PolicyLoan>()
            .HasOne(pl => pl.User)
            .WithMany(u => u.PolicyLoans)
            .HasForeignKey(pl => pl.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PolicyLoan>()
            .HasOne(pl => pl.Policy)
            .WithMany(p => p.PolicyLoans)
            .HasForeignKey(pl => pl.PolicyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure PremiumPayment relationships
        modelBuilder.Entity<PremiumPayment>()
            .HasOne(pp => pp.User)
            .WithMany(u => u.PremiumPayments)
            .HasForeignKey(pp => pp.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PremiumPayment>()
            .HasOne(pp => pp.Policy)
            .WithMany(p => p.PremiumPayments)
            .HasForeignKey(pp => pp.PolicyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure NewsAndAnnouncement relationship
        modelBuilder.Entity<NewsAndAnnouncement>()
            .HasOne(na => na.Author)
            .WithMany(u => u.NewsAndAnnouncements)
            .HasForeignKey(na => na.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure InsuranceScheme relationship
        modelBuilder.Entity<InsuranceScheme>()
            .HasOne(s => s.Category)
            .WithMany(c => c.InsuranceSchemes)
            .HasForeignKey(s => s.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure One-to-One relationships for Policy Details (Cascade delete allowed)
        modelBuilder.Entity<PolicyDetailsHome>()
            .HasOne(pdh => pdh.Policy)
            .WithOne(p => p.PolicyDetailsHome)
            .HasForeignKey<PolicyDetailsHome>(pdh => pdh.PolicyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PolicyDetailsLife>()
            .HasOne(pdl => pdl.Policy)
            .WithOne(p => p.PolicyDetailsLife)
            .HasForeignKey<PolicyDetailsLife>(pdl => pdl.PolicyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PolicyDetailsMedical>()
            .HasOne(pdm => pdm.Policy)
            .WithOne(p => p.PolicyDetailsMedical)
            .HasForeignKey<PolicyDetailsMedical>(pdm => pdm.PolicyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PolicyDetailsMotor>()
            .HasOne(pdm => pdm.Policy)
            .WithOne(p => p.PolicyDetailsMotor)
            .HasForeignKey<PolicyDetailsMotor>(pdm => pdm.PolicyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
