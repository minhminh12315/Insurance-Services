# 📊 Database Seeding Guide

## Tổng quan

Database seeder đã được tạo với **dữ liệu mẫu đầy đủ** cho tất cả các bảng trong hệ thống.

---

## 🎯 Dữ liệu mẫu đã tạo

### 👥 Users (6 users)
1. **Admin User**
   - Email: `admin@insurance.com`
   - Password: `Admin@123`
   - Role: Admin

2. **Employee**
   - Email: `employee@insurance.com`
   - Password: `Employee@123`
   - Role: Employee

3-6. **Customers** (4 người)
   - Email: `customer1@example.com`, `customer2@example.com`, `customer3@example.com`
   - Password: `Customer@123`
   - Role: Customer

### 📋 Insurance Categories (4 categories)
- Bảo hiểm nhân thọ
- Bảo hiểm y tế
- Bảo hiểm xe cơ giới
- Bảo hiểm nhà ở

### 📦 Insurance Schemes (8 schemes)
**Nhân thọ:**
- Gói An Sinh Vàng
- Gói Bảo Vệ Tương Lai

**Y tế:**
- Sức Khỏe Toàn Diện
- Gia Đình Khỏe Mạnh

**Xe cơ giới:**
- Bảo Hiểm Ô Tô Vật Chất
- Xe Máy An Toàn

**Nhà ở:**
- Bảo Vệ Ngôi Nhà
- Căn Hộ An Toàn

### 📄 Policies (9 policies)
- 3 Life insurance policies
- 2 Medical insurance policies
- 2 Motor insurance policies
- 2 Home insurance policies
- 1 Lapsed policy (để test)

Mỗi policy đều có **PolicyDetails** tương ứng với loại bảo hiểm.

### 💰 Claims (5 claims)
- 1 Approved
- 1 Under Review
- 1 Submitted
- 1 Paid
- 1 Rejected

### 💳 Premium Payments (8 payments)
- Payments cho các policies khác nhau
- Nhiều payment methods: CreditCard, BankTransfer, DebitCard
- 1 Pending payment để test

### 🏦 Policy Loans (4 loans)
- 1 Disbursed
- 1 Approved
- 1 Requested
- 1 Repaid

### 📰 News & Announcements (7 news)
- Chương trình khuyến mãi
- Thông báo sản phẩm mới
- Hướng dẫn quy trình
- Thông báo nghỉ lễ
- v.v.

---

## 🚀 Cách chạy Seeder

### Tự động (Recommended)

Seeder sẽ **tự động chạy** khi start application:

```bash
dotnet run
```

Output sẽ hiển thị:
```
Seeding database...
✓ Users seeded
✓ Categories seeded
✓ Schemes seeded
✓ Policies seeded
✓ Policy Details seeded
✓ Claims seeded
✓ Payments seeded
✓ Loans seeded
✓ News seeded
Database seeding completed successfully!
```

### Chạy lại từ đầu

Nếu muốn **xóa và seed lại** database:

1. Mở file `Data/DatabaseSeeder.cs`
2. Uncomment dòng trong method `SeedAsync`:
```csharp
// await ClearDataAsync(context);  // Bỏ comment dòng này
```

3. Run lại application:
```bash
dotnet run
```

---

## 🧪 Test với dữ liệu mẫu

### 1. Login với các accounts

#### Admin
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}
```

#### Employee
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "employee@insurance.com",
  "password": "Employee@123"
}
```

#### Customer
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer1@example.com",
  "password": "Customer@123"
}
```

### 2. Explore Data

#### Xem tất cả schemes
```http
GET /api/insurancescheme
```

#### Xem policies của customer
```http
GET /api/policy/my-policies
Authorization: Bearer {customer-token}
```

#### Xem claims
```http
GET /api/claim/my-claims
Authorization: Bearer {customer-token}
```

#### Xem payments
```http
GET /api/premiumpayment/my-payments
Authorization: Bearer {customer-token}
```

#### Xem loans
```http
GET /api/policyloan/my-loans
Authorization: Bearer {customer-token}
```

#### Xem news (không cần login)
```http
GET /api/news
```

---

## 📝 Data Statistics

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 6 | 1 Admin, 1 Employee, 4 Customers |
| Categories | 4 | Life, Medical, Motor, Home |
| Schemes | 8 | 2 per category |
| Policies | 9 | Various types and statuses |
| Policy Details | 9 | One per policy |
| Claims | 5 | Different statuses |
| Payments | 8 | Various methods |
| Loans | 4 | Different statuses |
| News | 7 | Various announcements |

---

## 🔍 Sample Policy Numbers

Để test, bạn có thể sử dụng các policy numbers sau:

- `POL-LIF-20240101-000001` - Life insurance (Active)
- `POL-MED-20240201-000003` - Medical insurance (Active)
- `POL-MOT-20240301-000005` - Motor insurance (Active)
- `POL-HOM-20240401-000007` - Home insurance (Active)
- `POL-LIF-20230101-000009` - Life insurance (Lapsed)

---

## 💡 Tips

### Kiểm tra dữ liệu trong SQL Server

```sql
-- Check users
SELECT * FROM Users;

-- Check policies
SELECT p.PolicyNumber, u.FullName, s.SchemeName, p.PolicyStatus
FROM Policies p
JOIN Users u ON p.UserId = u.UserId
JOIN InsuranceSchemes s ON p.SchemeId = s.SchemeId;

-- Check claims
SELECT c.ClaimId, p.PolicyNumber, c.ClaimAmount, c.Status
FROM Claims c
JOIN Policies p ON c.PolicyId = p.PolicyId;

-- Check payments
SELECT pp.PaymentId, p.PolicyNumber, pp.AmountPaid, pp.Status
FROM PremiumPayments pp
JOIN Policies p ON pp.PolicyId = p.PolicyId;
```

### Reset database hoàn toàn

```bash
# Drop và recreate database
dotnet ef database drop -f
dotnet ef database update

# Seeder sẽ tự động chạy khi start app
dotnet run
```

---

## 🛠️ Customize Seeder

Nếu muốn thêm hoặc sửa dữ liệu mẫu, edit file `Data/DatabaseSeeder.cs`:

```csharp
private static List<User> SeedUsers(InsuranceDbContext context)
{
    // Thêm users mới ở đây
    var users = new List<User>
    {
        // Your new users...
    };
    
    context.Users.AddRange(users);
    return users;
}
```

---

## ⚠️ Lưu ý

1. **Seeder chỉ chạy khi database trống** - Nếu đã có data, sẽ skip
2. **Passwords** đã được hash bằng SHA256
3. **Foreign keys** được setup đúng
4. **Realistic data** - Dữ liệu mẫu giống thực tế để test tốt hơn

---

## 📞 Troubleshooting

### Lỗi: "Database already seeded"
- Đây là thông báo bình thường nếu database đã có data
- Nếu muốn seed lại, uncomment `ClearDataAsync()`

### Lỗi: Foreign key constraint
- Đảm bảo chạy migration trước: `dotnet ef database update`
- Check connection string trong appsettings.json

### Lỗi: Seeder không chạy
- Check console output khi start app
- Xem logs để tìm lỗi cụ thể

---

## 🎉 Ready to Test!

Bây giờ bạn có thể test toàn bộ API với dữ liệu mẫu đầy đủ!

1. Run app: `dotnet run`
2. Open Swagger: `https://localhost:5001/swagger`
3. Login với account mẫu
4. Test các endpoints!

**Happy Testing! 🚀**
