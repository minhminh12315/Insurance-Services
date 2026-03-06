using InsuranceService.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace InsuranceService.API.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(InsuranceDbContext context)
    {
        // Clear existing data (optional - comment out if you want to keep existing data)
        // await ClearDataAsync(context);

        // Check if data already exists
        if (await context.Users.AnyAsync())
        {
            Console.WriteLine("Database already seeded. Skipping...");
            return;
        }

        Console.WriteLine("Seeding database...");

        // 1. Seed Users
        var users = SeedUsers(context);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Users seeded");

        // 2. Seed Insurance Categories
        var categories = SeedInsuranceCategories(context);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Categories seeded");

        // 3. Seed Insurance Schemes
        var schemes = SeedInsuranceSchemes(context, categories);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Schemes seeded");

        // 4. Seed Policies
        var policies = SeedPolicies(context, users, schemes);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Policies seeded");

        // 5. Seed Policy Details
        SeedPolicyDetails(context, policies);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Policy Details seeded");

        // 6. Seed Claims
        SeedClaims(context, policies, users);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Claims seeded");

        // 7. Seed Premium Payments
        SeedPremiumPayments(context, policies, users);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Payments seeded");

        // 8. Seed Policy Loans
        SeedPolicyLoans(context, policies, users);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ Loans seeded");

        // 9. Seed News
        SeedNews(context, users);
        await context.SaveChangesAsync();
        Console.WriteLine("✓ News seeded");

        Console.WriteLine("Database seeding completed successfully!");
    }

    private static List<User> SeedUsers(InsuranceDbContext context)
    {
        var users = new List<User>
        {
            // Admin User
            new User
            {
                FullName = "Admin User",
                Email = "admin@insurance.com",
                PasswordHash = HashPassword("Admin@123"),
                PhoneNumber = "0901234567",
                DateOfBirth = new DateOnly(1985, 1, 15),
                Gender = "Male",
                Address = "123 Admin Street",
                City = "Hà Nội",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Employee User
            new User
            {
                FullName = "Nguyễn Thị Hoa",
                Email = "employee@insurance.com",
                PasswordHash = HashPassword("Employee@123"),
                PhoneNumber = "0902345678",
                DateOfBirth = new DateOnly(1990, 5, 20),
                Gender = "Female",
                Address = "456 Employee Avenue",
                City = "Hồ Chí Minh",
                Role = "Employee",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Customer Users
            new User
            {
                FullName = "Trần Văn A",
                Email = "customer1@example.com",
                PasswordHash = HashPassword("Customer@123"),
                PhoneNumber = "0903456789",
                DateOfBirth = new DateOnly(1988, 3, 10),
                Gender = "Male",
                Address = "789 Customer Road",
                City = "Đà Nẵng",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Lê Thị B",
                Email = "customer2@example.com",
                PasswordHash = HashPassword("Customer@123"),
                PhoneNumber = "0904567890",
                DateOfBirth = new DateOnly(1992, 7, 25),
                Gender = "Female",
                Address = "321 Main Street",
                City = "Hà Nội",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Phạm Minh C",
                Email = "customer3@example.com",
                PasswordHash = HashPassword("Customer@123"),
                PhoneNumber = "0905678901",
                DateOfBirth = new DateOnly(1995, 11, 5),
                Gender = "Male",
                Address = "654 Park Avenue",
                City = "Hải Phòng",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        return users;
    }

    private static List<InsuranceCategory> SeedInsuranceCategories(InsuranceDbContext context)
    {
        var categories = new List<InsuranceCategory>
        {
            new InsuranceCategory
            {
                CategoryName = "Bảo hiểm nhân thọ",
                Description = "Bảo hiểm bảo vệ cuộc sống và tương lai của bạn và gia đình"
            },
            new InsuranceCategory
            {
                CategoryName = "Bảo hiểm y tế",
                Description = "Bảo hiểm chi phí y tế, khám chữa bệnh và nằm viện"
            },
            new InsuranceCategory
            {
                CategoryName = "Bảo hiểm xe cơ giới",
                Description = "Bảo hiểm cho ô tô, xe máy và các phương tiện giao thông"
            },
            new InsuranceCategory
            {
                CategoryName = "Bảo hiểm nhà ở",
                Description = "Bảo hiểm tài sản nhà ở, căn hộ và bất động sản"
            }
        };

        context.InsuranceCategories.AddRange(categories);
        return categories;
    }

    private static List<InsuranceScheme> SeedInsuranceSchemes(InsuranceDbContext context, List<InsuranceCategory> categories)
    {
        var schemes = new List<InsuranceScheme>
        {
            // Life Insurance Schemes
            new InsuranceScheme
            {
                Category = categories[0],
                SchemeName = "Gói An Sinh Vàng",
                Description = "Bảo hiểm nhân thọ toàn diện với quyền lợi cao",
                MinTerm = 5,
                MaxTerm = 30,
                MinInvestmentAmount = 10000000,
                MaxInvestmentAmount = 1000000000,
                ProfitRatio = 5.5m,
                NewLaunchDate = new DateOnly(2024, 1, 1),
                IsActive = true
            },
            new InsuranceScheme
            {
                Category = categories[0],
                SchemeName = "Gói Bảo Vệ Tương Lai",
                Description = "Kế hoạch tài chính dài hạn cho gia đình",
                MinTerm = 10,
                MaxTerm = 40,
                MinInvestmentAmount = 20000000,
                MaxInvestmentAmount = 2000000000,
                ProfitRatio = 6.0m,
                NewLaunchDate = new DateOnly(2024, 1, 15),
                IsActive = true
            },
            // Medical Insurance Schemes
            new InsuranceScheme
            {
                Category = categories[1],
                SchemeName = "Sức Khỏe Toàn Diện",
                Description = "Bảo hiểm y tế bao gồm khám chữa bệnh và nằm viện",
                MinTerm = 1,
                MaxTerm = 5,
                MinInvestmentAmount = 5000000,
                MaxInvestmentAmount = 100000000,
                ProfitRatio = 4.0m,
                NewLaunchDate = new DateOnly(2024, 2, 1),
                IsActive = true
            },
            new InsuranceScheme
            {
                Category = categories[1],
                SchemeName = "Gia Đình Khỏe Mạnh",
                Description = "Bảo hiểm y tế cho cả gia đình",
                MinTerm = 1,
                MaxTerm = 3,
                MinInvestmentAmount = 10000000,
                MaxInvestmentAmount = 200000000,
                ProfitRatio = 4.5m,
                NewLaunchDate = new DateOnly(2024, 2, 15),
                IsActive = true
            },
            // Motor Insurance Schemes
            new InsuranceScheme
            {
                Category = categories[2],
                SchemeName = "Bảo Hiểm Ô Tô Vật Chất",
                Description = "Bảo vệ toàn diện cho xe ô tô của bạn",
                MinTerm = 1,
                MaxTerm = 3,
                MinInvestmentAmount = 15000000,
                MaxInvestmentAmount = 500000000,
                ProfitRatio = 3.5m,
                NewLaunchDate = new DateOnly(2024, 3, 1),
                IsActive = true
            },
            new InsuranceScheme
            {
                Category = categories[2],
                SchemeName = "Xe Máy An Toàn",
                Description = "Bảo hiểm xe máy với giá cả phải chăng",
                MinTerm = 1,
                MaxTerm = 2,
                MinInvestmentAmount = 5000000,
                MaxInvestmentAmount = 50000000,
                ProfitRatio = 3.0m,
                NewLaunchDate = new DateOnly(2024, 3, 15),
                IsActive = true
            },
            // Home Insurance Schemes
            new InsuranceScheme
            {
                Category = categories[3],
                SchemeName = "Bảo Vệ Ngôi Nhà",
                Description = "Bảo hiểm tài sản nhà ở trước mọi rủi ro",
                MinTerm = 1,
                MaxTerm = 10,
                MinInvestmentAmount = 50000000,
                MaxInvestmentAmount = 5000000000,
                ProfitRatio = 4.0m,
                NewLaunchDate = new DateOnly(2024, 4, 1),
                IsActive = true
            },
            new InsuranceScheme
            {
                Category = categories[3],
                SchemeName = "Căn Hộ An Toàn",
                Description = "Bảo hiểm chung cư, căn hộ cao cấp",
                MinTerm = 1,
                MaxTerm = 5,
                MinInvestmentAmount = 30000000,
                MaxInvestmentAmount = 3000000000,
                ProfitRatio = 3.8m,
                NewLaunchDate = new DateOnly(2024, 4, 15),
                IsActive = true
            }
        };

        context.InsuranceSchemes.AddRange(schemes);
        return schemes;
    }

    private static List<Policy> SeedPolicies(InsuranceDbContext context, List<User> users, List<InsuranceScheme> schemes)
    {
        var policies = new List<Policy>
        {
            // Life Insurance Policy
            new Policy
            {
                User = users[2], // Customer 1
                Scheme = schemes[0],
                PolicyNumber = "POL-LIF-20240101-000001",
                StartDate = new DateOnly(2024, 1, 1),
                MaturityDate = new DateOnly(2034, 1, 1),
                TermYears = 10,
                PaymentFrequency = "Monthly",
                SumAssured = 100000000,
                PremiumAmount = 45833.33m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new Policy
            {
                User = users[3], // Customer 2
                Scheme = schemes[1],
                PolicyNumber = "POL-LIF-20240115-000002",
                StartDate = new DateOnly(2024, 1, 15),
                MaturityDate = new DateOnly(2044, 1, 15),
                TermYears = 20,
                PaymentFrequency = "Quarterly",
                SumAssured = 200000000,
                PremiumAmount = 150000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            // Medical Insurance Policy
            new Policy
            {
                User = users[2], // Customer 1
                Scheme = schemes[2],
                PolicyNumber = "POL-MED-20240201-000003",
                StartDate = new DateOnly(2024, 2, 1),
                MaturityDate = new DateOnly(2025, 2, 1),
                TermYears = 1,
                PaymentFrequency = "Yearly",
                SumAssured = 50000000,
                PremiumAmount = 2000000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new Policy
            {
                User = users[4], // Customer 3
                Scheme = schemes[3],
                PolicyNumber = "POL-MED-20240210-000004",
                StartDate = new DateOnly(2024, 2, 10),
                MaturityDate = new DateOnly(2027, 2, 10),
                TermYears = 3,
                PaymentFrequency = "Yearly",
                SumAssured = 100000000,
                PremiumAmount = 1500000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            // Motor Insurance Policy
            new Policy
            {
                User = users[3], // Customer 2
                Scheme = schemes[4],
                PolicyNumber = "POL-MOT-20240301-000005",
                StartDate = new DateOnly(2024, 3, 1),
                MaturityDate = new DateOnly(2025, 3, 1),
                TermYears = 1,
                PaymentFrequency = "Yearly",
                SumAssured = 300000000,
                PremiumAmount = 10500000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new Policy
            {
                User = users[4], // Customer 3
                Scheme = schemes[5],
                PolicyNumber = "POL-MOT-20240315-000006",
                StartDate = new DateOnly(2024, 3, 15),
                MaturityDate = new DateOnly(2026, 3, 15),
                TermYears = 2,
                PaymentFrequency = "Yearly",
                SumAssured = 20000000,
                PremiumAmount = 300000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            // Home Insurance Policy
            new Policy
            {
                User = users[2], // Customer 1
                Scheme = schemes[6],
                PolicyNumber = "POL-HOM-20240401-000007",
                StartDate = new DateOnly(2024, 4, 1),
                MaturityDate = new DateOnly(2029, 4, 1),
                TermYears = 5,
                PaymentFrequency = "Yearly",
                SumAssured = 500000000,
                PremiumAmount = 4000000m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new Policy
            {
                User = users[3], // Customer 2
                Scheme = schemes[7],
                PolicyNumber = "POL-HOM-20240415-000008",
                StartDate = new DateOnly(2024, 4, 15),
                MaturityDate = new DateOnly(2027, 4, 15),
                TermYears = 3,
                PaymentFrequency = "Yearly",
                SumAssured = 200000000,
                PremiumAmount = 2533333m,
                PolicyStatus = "Active",
                CreatedAt = DateTime.UtcNow
            },
            // Lapsed Policy
            new Policy
            {
                User = users[4], // Customer 3
                Scheme = schemes[0],
                PolicyNumber = "POL-LIF-20230101-000009",
                StartDate = new DateOnly(2023, 1, 1),
                MaturityDate = new DateOnly(2033, 1, 1),
                TermYears = 10,
                PaymentFrequency = "Monthly",
                SumAssured = 80000000,
                PremiumAmount = 36666.67m,
                PolicyStatus = "Lapsed",
                CreatedAt = DateTime.UtcNow.AddYears(-1)
            }
        };

        context.Policies.AddRange(policies);
        return policies;
    }

    private static void SeedPolicyDetails(InsuranceDbContext context, List<Policy> policies)
    {
        // Life Insurance Details
        context.PolicyDetailsLives.AddRange(new[]
        {
            new PolicyDetailsLife
            {
                Policy = policies[0],
                NomineeName = "Nguyễn Thị Lan",
                NomineeRelation = "Vợ"
            },
            new PolicyDetailsLife
            {
                Policy = policies[1],
                NomineeName = "Trần Văn Nam",
                NomineeRelation = "Chồng"
            },
            new PolicyDetailsLife
            {
                Policy = policies[8],
                NomineeName = "Phạm Thị Hương",
                NomineeRelation = "Mẹ"
            }
        });

        // Medical Insurance Details
        context.PolicyDetailsMedicals.AddRange(new[]
        {
            new PolicyDetailsMedical
            {
                Policy = policies[2],
                PreExistingDiseases = "Không có",
                HospitalNetworkTier = "Premium",
                IsFamilyFloater = false
            },
            new PolicyDetailsMedical
            {
                Policy = policies[3],
                PreExistingDiseases = "Tiểu đường type 2",
                HospitalNetworkTier = "Standard",
                IsFamilyFloater = true
            }
        });

        // Motor Insurance Details
        context.PolicyDetailsMotors.AddRange(new[]
        {
            new PolicyDetailsMotor
            {
                Policy = policies[4],
                VehicleRegNumber = "30A-12345",
                VehicleModel = "Toyota Camry 2022",
                VehicleType = "Sedan",
                EngineNumber = "1G1BL52P7TR115520",
                ChassisNumber = "4Y1SL65848Z411439",
                ManufacturingYear = 2022
            },
            new PolicyDetailsMotor
            {
                Policy = policies[5],
                VehicleRegNumber = "29C-98765",
                VehicleModel = "Honda Wave Alpha",
                VehicleType = "Motorcycle",
                EngineNumber = "WAVE110-54321",
                ChassisNumber = "WAVE110-12345",
                ManufacturingYear = 2023
            }
        });

        // Home Insurance Details
        context.PolicyDetailsHomes.AddRange(new[]
        {
            new PolicyDetailsHome
            {
                Policy = policies[6],
                PropertyAddress = "789 Customer Road, Quận Hải Châu, Đà Nẵng",
                PropertyValue = 500000000,
                StructureType = "Bê tông cốt thép",
                BuiltYear = 2018
            },
            new PolicyDetailsHome
            {
                Policy = policies[7],
                PropertyAddress = "321 Main Street, Quận Ba Đình, Hà Nội",
                PropertyValue = 200000000,
                StructureType = "Chung cư cao cấp",
                BuiltYear = 2020
            }
        });
    }

    private static void SeedClaims(InsuranceDbContext context, List<Policy> policies, List<User> users)
    {
        var claims = new List<Claim>
        {
            new Claim
            {
                Policy = policies[2], // Medical policy
                User = users[2],
                ClaimDate = new DateOnly(2024, 6, 15),
                ClaimAmount = 5000000,
                Reason = "Nhập viện điều trị viêm phổi cấp",
                Status = "Approved",
                AdminComment = "Đã xét duyệt và chấp nhận yêu cầu bồi thường"
            },
            new Claim
            {
                Policy = policies[4], // Motor policy
                User = users[3],
                ClaimDate = new DateOnly(2024, 7, 20),
                ClaimAmount = 15000000,
                Reason = "Tai nạn giao thông, xe bị hư hỏng phần đầu",
                Status = "UnderReview",
                AdminComment = "Đang xem xét hồ sơ và giám định thiệt hại"
            },
            new Claim
            {
                Policy = policies[0], // Life policy
                User = users[2],
                ClaimDate = new DateOnly(2024, 8, 5),
                ClaimAmount = 3000000,
                Reason = "Chi phí phẫu thuật bệnh tim",
                Status = "Submitted",
                AdminComment = null
            },
            new Claim
            {
                Policy = policies[3], // Medical policy
                User = users[4],
                ClaimDate = new DateOnly(2024, 5, 10),
                ClaimAmount = 8000000,
                Reason = "Điều trị bệnh tiểu đường, nằm viện 10 ngày",
                Status = "Paid",
                AdminComment = "Đã thanh toán đầy đủ theo hợp đồng"
            },
            new Claim
            {
                Policy = policies[6], // Home policy
                User = users[2],
                ClaimDate = new DateOnly(2024, 9, 1),
                ClaimAmount = 20000000,
                Reason = "Hư hại do mưa bão, mái nhà bị tốc",
                Status = "Rejected",
                AdminComment = "Không thuộc phạm vi bảo hiểm theo điều khoản hợp đồng"
            }
        };

        context.Claims.AddRange(claims);
    }

    private static void SeedPremiumPayments(InsuranceDbContext context, List<Policy> policies, List<User> users)
    {
        var payments = new List<PremiumPayment>
        {
            // Payments for Policy 1 (Monthly)
            new PremiumPayment
            {
                Policy = policies[0],
                User = users[2],
                AmountPaid = 45833.33m,
                PaymentDate = new DateTime(2024, 1, 5),
                PaymentMethod = "CreditCard",
                TransactionReference = "TXN-20240105-ABC123",
                Status = "Completed"
            },
            new PremiumPayment
            {
                Policy = policies[0],
                User = users[2],
                AmountPaid = 45833.33m,
                PaymentDate = new DateTime(2024, 2, 5),
                PaymentMethod = "CreditCard",
                TransactionReference = "TXN-20240205-DEF456",
                Status = "Completed"
            },
            new PremiumPayment
            {
                Policy = policies[0],
                User = users[2],
                AmountPaid = 45833.33m,
                PaymentDate = new DateTime(2024, 3, 5),
                PaymentMethod = "BankTransfer",
                TransactionReference = "TXN-20240305-GHI789",
                Status = "Completed"
            },
            // Payments for Policy 2 (Quarterly)
            new PremiumPayment
            {
                Policy = policies[1],
                User = users[3],
                AmountPaid = 150000m,
                PaymentDate = new DateTime(2024, 1, 20),
                PaymentMethod = "BankTransfer",
                TransactionReference = "TXN-20240120-JKL012",
                Status = "Completed"
            },
            new PremiumPayment
            {
                Policy = policies[1],
                User = users[3],
                AmountPaid = 150000m,
                PaymentDate = new DateTime(2024, 4, 20),
                PaymentMethod = "BankTransfer",
                TransactionReference = "TXN-20240420-MNO345",
                Status = "Completed"
            },
            // Payments for Policy 3 (Yearly)
            new PremiumPayment
            {
                Policy = policies[2],
                User = users[2],
                AmountPaid = 2000000m,
                PaymentDate = new DateTime(2024, 2, 5),
                PaymentMethod = "DebitCard",
                TransactionReference = "TXN-20240205-PQR678",
                Status = "Completed"
            },
            // Payments for Policy 5 (Motor - Yearly)
            new PremiumPayment
            {
                Policy = policies[4],
                User = users[3],
                AmountPaid = 10500000m,
                PaymentDate = new DateTime(2024, 3, 5),
                PaymentMethod = "BankTransfer",
                TransactionReference = "TXN-20240305-STU901",
                Status = "Completed"
            },
            // Pending payment
            new PremiumPayment
            {
                Policy = policies[6],
                User = users[2],
                AmountPaid = 4000000m,
                PaymentDate = DateTime.UtcNow,
                PaymentMethod = "CreditCard",
                TransactionReference = "TXN-20240910-VWX234",
                Status = "Pending"
            }
        };

        context.PremiumPayments.AddRange(payments);
    }

    private static void SeedPolicyLoans(InsuranceDbContext context, List<Policy> policies, List<User> users)
    {
        var loans = new List<PolicyLoan>
        {
            new PolicyLoan
            {
                Policy = policies[0], // Old enough policy for loan
                User = users[2],
                LoanAmount = 40000000, // 40% of sum assured
                InterestRate = 8.5m,
                ApplicationDate = new DateOnly(2024, 6, 1),
                ApprovalDate = new DateOnly(2024, 6, 5),
                LoanStatus = "Disbursed"
            },
            new PolicyLoan
            {
                Policy = policies[1],
                User = users[3],
                LoanAmount = 80000000,
                InterestRate = 8.5m,
                ApplicationDate = new DateOnly(2024, 7, 15),
                ApprovalDate = new DateOnly(2024, 7, 20),
                LoanStatus = "Approved"
            },
            new PolicyLoan
            {
                Policy = policies[6],
                User = users[2],
                LoanAmount = 200000000,
                InterestRate = 8.5m,
                ApplicationDate = new DateOnly(2024, 8, 1),
                ApprovalDate = null,
                LoanStatus = "Requested"
            },
            new PolicyLoan
            {
                Policy = policies[0],
                User = users[2],
                LoanAmount = 20000000,
                InterestRate = 8.5m,
                ApplicationDate = new DateOnly(2024, 5, 1),
                ApprovalDate = new DateOnly(2024, 5, 3),
                LoanStatus = "Repaid"
            }
        };

        context.PolicyLoans.AddRange(loans);
    }

    private static void SeedNews(InsuranceDbContext context, List<User> users)
    {
        var news = new List<NewsAndAnnouncement>
        {
            new NewsAndAnnouncement
            {
                Title = "Chương trình khuyến mãi mừng Tết Nguyên Đán 2024",
                Content = "Giảm 20% phí bảo hiểm cho tất cả khách hàng đăng ký mới các gói bảo hiểm nhân thọ trong tháng 1/2024. Áp dụng cho các gói: An Sinh Vàng, Bảo Vệ Tương Lai. Thời gian áp dụng từ 01/01/2024 đến 31/01/2024.",
                PublishedDate = new DateTime(2024, 1, 1),
                Author = users[0] // Admin
            },
            new NewsAndAnnouncement
            {
                Title = "Ra mắt gói bảo hiểm y tế Gia Đình Khỏe Mạnh",
                Content = "Chúng tôi vui mừng giới thiệu gói bảo hiểm y tế mới 'Gia Đình Khỏe Mạnh' - giải pháp bảo vệ sức khỏe toàn diện cho cả gia đình với mức phí cạnh tranh. Gói bảo hiểm bao gồm: khám chữa bệnh ngoại trú, nội trú, phẫu thuật, và nhiều quyền lợi khác.",
                PublishedDate = new DateTime(2024, 2, 15),
                Author = users[1] // Employee
            },
            new NewsAndAnnouncement
            {
                Title = "Hướng dẫn quy trình yêu cầu bồi thường trực tuyến",
                Content = "Để thuận tiện cho khách hàng, chúng tôi đã cập nhật quy trình yêu cầu bồi thường trực tuyến. Khách hàng có thể gửi yêu cầu bồi thường ngay trên website hoặc ứng dụng di động. Thời gian xử lý nhanh chóng trong vòng 3-5 ngày làm việc.",
                PublishedDate = new DateTime(2024, 3, 10),
                Author = users[1]
            },
            new NewsAndAnnouncement
            {
                Title = "Thông báo nghỉ lễ 30/4 và 1/5",
                Content = "Kính gửi quý khách hàng, công ty chúng tôi xin thông báo lịch nghỉ lễ 30/4 và 1/5/2024. Trong thời gian này, các dịch vụ trực tuyến vẫn hoạt động bình thường. Mọi yêu cầu khẩn cấp vui lòng liên hệ hotline 1900-xxxx.",
                PublishedDate = new DateTime(2024, 4, 20),
                Author = users[0]
            },
            new NewsAndAnnouncement
            {
                Title = "Mở rộng mạng lưới bệnh viện hợp tác",
                Content = "Chúng tôi vui mừng thông báo đã hợp tác với thêm 50 bệnh viện trên toàn quốc, nâng tổng số lên 200 bệnh viện. Khách hàng có thể sử dụng dịch vụ y tế tại các bệnh viện này với quy trình thanh toán bảo lãnh trực tiếp.",
                PublishedDate = new DateTime(2024, 5, 1),
                Author = users[1]
            },
            new NewsAndAnnouncement
            {
                Title = "Chính sách ưu đãi cho khách hàng thân thiết",
                Content = "Tri ân khách hàng gắn bó lâu năm, chúng tôi áp dụng chương trình ưu đãi: Giảm 10% phí gia hạn cho khách hàng có thâm niên từ 3 năm trở lên, giảm 15% cho khách hàng từ 5 năm, và giảm 20% cho khách hàng từ 10 năm.",
                PublishedDate = new DateTime(2024, 6, 15),
                Author = users[0]
            },
            new NewsAndAnnouncement
            {
                Title = "Cập nhật ứng dụng di động phiên bản 2.0",
                Content = "Phiên bản mới của ứng dụng Insurance App đã có mặt với nhiều tính năng tiện ích: Xem hợp đồng, thanh toán phí, yêu cầu bồi thường, chat với tư vấn viên 24/7. Hãy cập nhật ngay để trải nghiệm!",
                PublishedDate = new DateTime(2024, 7, 1),
                Author = users[1]
            }
        };

        context.NewsAndAnnouncements.AddRange(news);
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private static async Task ClearDataAsync(InsuranceDbContext context)
    {
        context.Claims.RemoveRange(context.Claims);
        context.PremiumPayments.RemoveRange(context.PremiumPayments);
        context.PolicyLoans.RemoveRange(context.PolicyLoans);
        context.PolicyDetailsLives.RemoveRange(context.PolicyDetailsLives);
        context.PolicyDetailsMedicals.RemoveRange(context.PolicyDetailsMedicals);
        context.PolicyDetailsMotors.RemoveRange(context.PolicyDetailsMotors);
        context.PolicyDetailsHomes.RemoveRange(context.PolicyDetailsHomes);
        context.Policies.RemoveRange(context.Policies);
        context.InsuranceSchemes.RemoveRange(context.InsuranceSchemes);
        context.InsuranceCategories.RemoveRange(context.InsuranceCategories);
        context.NewsAndAnnouncements.RemoveRange(context.NewsAndAnnouncements);
        context.RefreshTokens.RemoveRange(context.RefreshTokens);
        context.Users.RemoveRange(context.Users);

        await context.SaveChangesAsync();
    }
}