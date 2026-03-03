using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace InsuranceService.API.Models;

public partial class InsuranceDbContext : DbContext
{
    public InsuranceDbContext()
    {
    }

    public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options)
        : base(options)
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
    
    public virtual DbSet<Notification> Notifications { get; set; }
    
    public virtual DbSet<PolicyRider> PolicyRiders { get; set; }
    
    public virtual DbSet<PolicyRenewal> PolicyRenewals { get; set; }
    
    public virtual DbSet<PolicyBeneficiary> PolicyBeneficiaries { get; set; }
    
    public virtual DbSet<ClaimApprovalHistory> ClaimApprovalHistories { get; set; }
    
    public virtual DbSet<PaymentReceipt> PaymentReceipts { get; set; }
    
    public virtual DbSet<PolicySurrender> PolicySurrenders { get; set; }
    
    public virtual DbSet<LoanRepaymentSchedule> LoanRepaymentSchedules { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=InsuranceDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Claim>(entity =>
        {
            entity.HasKey(e => e.ClaimId).HasName("PK__Claims__F9CC0896144DC79A");

            entity.Property(e => e.ClaimId).HasColumnName("claim_id");
            entity.Property(e => e.AdminComment).HasColumnName("admin_comment");
            entity.Property(e => e.ClaimAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("claim_amount");
            entity.Property(e => e.ClaimDate).HasColumnName("claim_date");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Submitted")
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.DocumentPath)
                .HasMaxLength(500)
                .HasColumnName("document_path");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Policy).WithMany(p => p.Claims)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Claims__policy_i__18EBB532");

            entity.HasOne(d => d.User).WithMany(p => p.Claims)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Claims__user_id__19DFD96B");
        });

        modelBuilder.Entity<InsuranceCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Insuranc__D54EE9B40360DABD");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(50)
                .HasColumnName("category_name");
            entity.Property(e => e.Description).HasColumnName("description");
        });

        modelBuilder.Entity<InsuranceScheme>(entity =>
        {
            entity.HasKey(e => e.SchemeId).HasName("PK__Insuranc__8DF8FA63B4C6C668");

            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.MaxInvestmentAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("max_investment_amount");
            entity.Property(e => e.MaxTerm).HasColumnName("max_term");
            entity.Property(e => e.MinInvestmentAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("min_investment_amount");
            entity.Property(e => e.MinTerm).HasColumnName("min_term");
            entity.Property(e => e.NewLaunchDate).HasColumnName("new_launch_date");
            entity.Property(e => e.ProfitRatio)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("profit_ratio");
            entity.Property(e => e.SchemeName)
                .HasMaxLength(100)
                .HasColumnName("scheme_name");

            entity.HasOne(d => d.Category).WithMany(p => p.InsuranceSchemes)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Insurance__categ__693CA210");
        });

        modelBuilder.Entity<NewsAndAnnouncement>(entity =>
        {
            entity.HasKey(e => e.NewsId).HasName("PK__NewsAndA__4C27CCD8E2DD9B95");

            entity.Property(e => e.NewsId).HasColumnName("news_id");
            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.PublishedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("published_date");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Author).WithMany(p => p.NewsAndAnnouncements)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__NewsAndAn__autho__14270015");
        });

        modelBuilder.Entity<Policy>(entity =>
        {
            entity.HasKey(e => e.PolicyId).HasName("PK__Policies__47DA3F0311C450B0");

            entity.HasIndex(e => e.PolicyNumber, "UQ__Policies__9691687297386018").IsUnique();

            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.MaturityDate).HasColumnName("maturity_date");
            entity.Property(e => e.PaymentFrequency)
                .HasMaxLength(20)
                .HasColumnName("payment_frequency");
            entity.Property(e => e.PolicyNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("policy_number");
            entity.Property(e => e.PolicyStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Pending")
                .HasColumnName("policy_status");
            entity.Property(e => e.PremiumAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("premium_amount");
            entity.Property(e => e.SchemeId).HasColumnName("scheme_id");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.SumAssured)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("sum_assured");
            entity.Property(e => e.TermYears).HasColumnName("term_years");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Scheme).WithMany(p => p.Policies)
                .HasForeignKey(d => d.SchemeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Policies__scheme__71D1E811");

            entity.HasOne(d => d.User).WithMany(p => p.Policies)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Policies__user_i__70DDC3D8");
        });

        modelBuilder.Entity<PolicyDetailsHome>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PK__PolicyDe__38E9A2245B17D7E2");

            entity.ToTable("PolicyDetails_Home");

            entity.HasIndex(e => e.PolicyId, "UQ__PolicyDe__47DA3F0228F3C749").IsUnique();

            entity.Property(e => e.DetailId).HasColumnName("detail_id");
            entity.Property(e => e.BuiltYear).HasColumnName("built_year");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.PropertyAddress).HasColumnName("property_address");
            entity.Property(e => e.PropertyValue)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("property_value");
            entity.Property(e => e.StructureType)
                .HasMaxLength(50)
                .HasColumnName("structure_type");

            entity.HasOne(d => d.Policy).WithOne(p => p.PolicyDetailsHome)
                .HasForeignKey<PolicyDetailsHome>(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PolicyDet__polic__02FC7413");
        });

        modelBuilder.Entity<PolicyDetailsLife>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PK__PolicyDe__38E9A22438F371FB");

            entity.ToTable("PolicyDetails_Life");

            entity.HasIndex(e => e.PolicyId, "UQ__PolicyDe__47DA3F02CF575983").IsUnique();

            entity.Property(e => e.DetailId).HasColumnName("detail_id");
            entity.Property(e => e.NomineeName)
                .HasMaxLength(100)
                .HasColumnName("nominee_name");
            entity.Property(e => e.NomineeRelation)
                .HasMaxLength(50)
                .HasColumnName("nominee_relation");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");

            entity.HasOne(d => d.Policy).WithOne(p => p.PolicyDetailsLife)
                .HasForeignKey<PolicyDetailsLife>(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PolicyDet__polic__75A278F5");
        });

        modelBuilder.Entity<PolicyDetailsMedical>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PK__PolicyDe__38E9A22431A48E84");

            entity.ToTable("PolicyDetails_Medical");

            entity.HasIndex(e => e.PolicyId, "UQ__PolicyDe__47DA3F02095C5CAC").IsUnique();

            entity.Property(e => e.DetailId).HasColumnName("detail_id");
            entity.Property(e => e.HospitalNetworkTier)
                .HasMaxLength(50)
                .HasColumnName("hospital_network_tier");
            entity.Property(e => e.IsFamilyFloater)
                .HasDefaultValue(false)
                .HasColumnName("is_family_floater");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.PreExistingDiseases).HasColumnName("pre_existing_diseases");
            entity.Property(e => e.AnnualLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("annual_limit");
            entity.Property(e => e.UsedAmount)
                .HasColumnType("decimal(15, 2)")
                .HasDefaultValue(0m)
                .HasColumnName("used_amount");
            entity.Property(e => e.RoomAndBoardLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("room_and_board_limit");
            entity.Property(e => e.SurgeryLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("surgery_limit");
            entity.Property(e => e.OutpatientLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("outpatient_limit");
            entity.Property(e => e.DentalLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("dental_limit");
            entity.Property(e => e.MaternityLimit)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("maternity_limit");
            entity.Property(e => e.HasDirectBilling)
                .HasDefaultValue(false)
                .HasColumnName("has_direct_billing");
            entity.Property(e => e.CardTier)
                .HasMaxLength(20)
                .HasColumnName("card_tier");
            entity.Property(e => e.WaitingPeriodDays)
                .HasDefaultValue(30)
                .HasColumnName("waiting_period_days");

            entity.HasOne(d => d.Policy).WithOne(p => p.PolicyDetailsMedical)
                .HasForeignKey<PolicyDetailsMedical>(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PolicyDet__polic__7A672E12");
        });

        modelBuilder.Entity<PolicyDetailsMotor>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("PK__PolicyDe__38E9A22426EED2C7");

            entity.ToTable("PolicyDetails_Motor");

            entity.HasIndex(e => e.PolicyId, "UQ__PolicyDe__47DA3F02C801E076").IsUnique();

            entity.Property(e => e.DetailId).HasColumnName("detail_id");
            entity.Property(e => e.ChassisNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("chassis_number");
            entity.Property(e => e.EngineNumber)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("engine_number");
            entity.Property(e => e.ManufacturingYear).HasColumnName("manufacturing_year");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.VehicleModel)
                .HasMaxLength(50)
                .HasColumnName("vehicle_model");
            entity.Property(e => e.VehicleRegNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("vehicle_reg_number");
            entity.Property(e => e.VehicleType)
                .HasMaxLength(10)
                .HasColumnName("vehicle_type");

            entity.HasOne(d => d.Policy).WithOne(p => p.PolicyDetailsMotor)
                .HasForeignKey<PolicyDetailsMotor>(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PolicyDet__polic__7F2BE32F");
        });

        modelBuilder.Entity<PolicyLoan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("PK__PolicyLo__A1F79554F1962F1B");

            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.ApplicationDate).HasColumnName("application_date");
            entity.Property(e => e.ApprovalDate).HasColumnName("approval_date");
            entity.Property(e => e.InterestRate)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("interest_rate");
            entity.Property(e => e.LoanAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("loan_amount");
            entity.Property(e => e.LoanStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Requested")
                .HasColumnName("loan_status");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Policy).WithMany(p => p.PolicyLoans)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PolicyLoa__polic__0F624AF8");

            entity.HasOne(d => d.User).WithMany(p => p.PolicyLoans)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PolicyLoa__user___10566F31");
        });

        modelBuilder.Entity<PremiumPayment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__PremiumP__ED1FC9EA4E0C5346");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.AmountPaid)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("amount_paid");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("payment_method");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Pending")
                .HasColumnName("status");
            entity.Property(e => e.TransactionReference)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("transaction_reference");
            entity.Property(e => e.OrderCode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("order_code");
            entity.Property(e => e.Gateway)
                .HasMaxLength(50)
                .HasColumnName("gateway");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Policy).WithMany(p => p.PremiumPayments)
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PremiumPa__polic__09A971A2");

            entity.HasOne(d => d.User).WithMany(p => p.PremiumPayments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PremiumPa__user___0A9D95DB");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F35449800");

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E61644DCC5FA2").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .HasColumnName("city");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("phone_number");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValue("Customer")
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId);

            entity.Property(e => e.NotificationId).HasColumnName("notification_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsRequired()
                .HasColumnName("title");
            entity.Property(e => e.Message)
                .HasMaxLength(1000)
                .IsRequired()
                .HasColumnName("message");
            entity.Property(e => e.NotificationType)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("notification_type");
            entity.Property(e => e.RelatedEntityId).HasColumnName("related_entity_id");
            entity.Property(e => e.RelatedEntityType)
                .HasMaxLength(50)
                .HasColumnName("related_entity_type");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ReadAt)
                .HasColumnType("datetime")
                .HasColumnName("read_at");
            entity.Property(e => e.EmailSent)
                .HasDefaultValue(false)
                .HasColumnName("email_sent");
            entity.Property(e => e.EmailSentAt)
                .HasColumnType("datetime")
                .HasColumnName("email_sent_at");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Notifications_Users");
        });

        modelBuilder.Entity<PolicyRider>(entity =>
        {
            entity.HasKey(e => e.RiderId);

            entity.Property(e => e.RiderId).HasColumnName("rider_id");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.RiderName)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("rider_name");
            entity.Property(e => e.RiderType)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("rider_type");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.RiderPremium)
                .HasColumnType("decimal(15, 2)")
                .IsRequired()
                .HasColumnName("rider_premium");
            entity.Property(e => e.CoverageAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("coverage_amount");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");

            entity.HasOne(d => d.Policy)
                .WithMany()
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PolicyRiders_Policies");
        });

        modelBuilder.Entity<PolicyRenewal>(entity =>
        {
            entity.HasKey(e => e.RenewalId);

            entity.Property(e => e.RenewalId).HasColumnName("renewal_id");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RenewalDate).HasColumnName("renewal_date");
            entity.Property(e => e.PreviousMaturityDate).HasColumnName("previous_maturity_date");
            entity.Property(e => e.NewMaturityDate).HasColumnName("new_maturity_date");
            entity.Property(e => e.PreviousPremium)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("previous_premium");
            entity.Property(e => e.NewPremium)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("new_premium");
            entity.Property(e => e.RenewalTermYears).HasColumnName("renewal_term_years");
            entity.Property(e => e.RenewalStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Pending")
                .HasColumnName("renewal_status");
            entity.Property(e => e.RenewalNotes)
                .HasMaxLength(1000)
                .HasColumnName("renewal_notes");
            entity.Property(e => e.RequestedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("requested_at");
            entity.Property(e => e.ProcessedAt)
                .HasColumnType("datetime")
                .HasColumnName("processed_at");
            entity.Property(e => e.ProcessedBy).HasColumnName("processed_by");

            entity.HasOne(d => d.Policy)
                .WithMany()
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PolicyRenewals_Policies");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_PolicyRenewals_Users");
        });

        modelBuilder.Entity<PolicyBeneficiary>(entity =>
        {
            entity.HasKey(e => e.BeneficiaryId);

            entity.Property(e => e.BeneficiaryId).HasColumnName("beneficiary_id");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.BeneficiaryName)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("beneficiary_name");
            entity.Property(e => e.Relationship)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("relationship");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.BenefitPercentage)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("benefit_percentage");
            entity.Property(e => e.IsPrimary)
                .HasDefaultValue(true)
                .HasColumnName("is_primary");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.IdentificationNumber)
                .HasMaxLength(50)
                .HasColumnName("identification_number");
            entity.Property(e => e.IdentificationType)
                .HasMaxLength(50)
                .HasColumnName("identification_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Policy)
                .WithMany()
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PolicyBeneficiaries_Policies");
        });

        modelBuilder.Entity<ClaimApprovalHistory>(entity =>
        {
            entity.HasKey(e => e.ApprovalId);

            entity.Property(e => e.ApprovalId).HasColumnName("approval_id");
            entity.Property(e => e.ClaimId).HasColumnName("claim_id");
            entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");
            entity.Property(e => e.Action)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("action");
            entity.Property(e => e.PreviousStatus)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("previous_status");
            entity.Property(e => e.NewStatus)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("new_status");
            entity.Property(e => e.Comments)
                .HasMaxLength(1000)
                .HasColumnName("comments");
            entity.Property(e => e.ApprovedAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("approved_amount");
            entity.Property(e => e.ActionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("action_date");
            entity.Property(e => e.DocumentsVerified)
                .HasMaxLength(500)
                .HasColumnName("documents_verified");
            entity.Property(e => e.RejectionReason)
                .HasMaxLength(500)
                .HasColumnName("rejection_reason");

            entity.HasOne(d => d.Claim)
                .WithMany()
                .HasForeignKey(d => d.ClaimId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ClaimApprovalHistory_Claims");

            entity.HasOne(d => d.Approver)
                .WithMany()
                .HasForeignKey(d => d.ApprovedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_ClaimApprovalHistory_Users");
        });

        modelBuilder.Entity<PaymentReceipt>(entity =>
        {
            entity.HasKey(e => e.ReceiptId);

            entity.Property(e => e.ReceiptId).HasColumnName("receipt_id");
            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.ReceiptNumber)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("receipt_number");
            entity.Property(e => e.GeneratedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("generated_at");
            entity.Property(e => e.ReceiptPdfPath)
                .HasMaxLength(500)
                .HasColumnName("receipt_pdf_path");
            entity.Property(e => e.ReceiptHtml)
                .HasColumnType("ntext")
                .HasColumnName("receipt_html");
            entity.Property(e => e.EmailSent)
                .HasDefaultValue(false)
                .HasColumnName("email_sent");
            entity.Property(e => e.EmailSentAt)
                .HasColumnType("datetime")
                .HasColumnName("email_sent_at");

            entity.HasOne(d => d.Payment)
                .WithMany()
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PaymentReceipts_PremiumPayments");

            entity.HasIndex(e => e.ReceiptNumber).IsUnique();
        });

        modelBuilder.Entity<PolicySurrender>(entity =>
        {
            entity.HasKey(e => e.SurrenderId);

            entity.Property(e => e.SurrenderId).HasColumnName("surrender_id");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RequestDate).HasColumnName("request_date");
            entity.Property(e => e.TotalPremiumPaid)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("total_premium_paid");
            entity.Property(e => e.SurrenderValue)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("surrender_value");
            entity.Property(e => e.SurrenderCharges)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("surrender_charges");
            entity.Property(e => e.NetPayable)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("net_payable");
            entity.Property(e => e.PolicyHeldYears).HasColumnName("policy_held_years");
            entity.Property(e => e.PolicyHeldMonths).HasColumnName("policy_held_months");
            entity.Property(e => e.SurrenderStatus)
                .HasMaxLength(20)
                .HasDefaultValue("Pending")
                .HasColumnName("surrender_status");
            entity.Property(e => e.SurrenderReason)
                .HasMaxLength(500)
                .HasColumnName("surrender_reason");
            entity.Property(e => e.AdminNotes)
                .HasMaxLength(1000)
                .HasColumnName("admin_notes");
            entity.Property(e => e.RequestedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("requested_at");
            entity.Property(e => e.ProcessedAt)
                .HasColumnType("datetime")
                .HasColumnName("processed_at");
            entity.Property(e => e.ProcessedBy).HasColumnName("processed_by");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("payment_method");
            entity.Property(e => e.PaymentReference)
                .HasMaxLength(200)
                .HasColumnName("payment_reference");

            entity.HasOne(d => d.Policy)
                .WithMany()
                .HasForeignKey(d => d.PolicyId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PolicySurrenders_Policies");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_PolicySurrenders_Users");
        });

        modelBuilder.Entity<LoanRepaymentSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId);

            entity.Property(e => e.ScheduleId).HasColumnName("schedule_id");
            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.InstallmentNumber).HasColumnName("installment_number");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.PrincipalAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("principal_amount");
            entity.Property(e => e.InterestAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("interest_amount");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("total_amount");
            entity.Property(e => e.OutstandingBalance)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("outstanding_balance");
            entity.Property(e => e.IsPaid)
                .HasDefaultValue(false)
                .HasColumnName("is_paid");
            entity.Property(e => e.PaidDate)
                .HasColumnType("datetime")
                .HasColumnName("paid_date");
            entity.Property(e => e.PaidAmount)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("paid_amount");
            entity.Property(e => e.PaymentReference)
                .HasMaxLength(200)
                .HasColumnName("payment_reference");
            entity.Property(e => e.DaysOverdue).HasColumnName("days_overdue");
            entity.Property(e => e.LateFee)
                .HasColumnType("decimal(15, 2)")
                .HasColumnName("late_fee");

            entity.HasOne(d => d.Loan)
                .WithMany()
                .HasForeignKey(d => d.LoanId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_LoanRepaymentSchedule_PolicyLoans");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
