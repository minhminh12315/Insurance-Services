# 🏥 Insurance Service API

[![.NET](https://img.shields.io/badge/.NET-10.0-purple)](https://dotnet.microsoft.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Hệ thống quản lý bảo hiểm đầy đủ với RESTful API, hỗ trợ 4 loại bảo hiểm: Nhân thọ, Y tế, Xe cơ giới, và Nhà ở.

## 🌟 Tính năng chính

- ✅ **Xác thực & Phân quyền** - JWT-based authentication với refresh token
- ✅ **Quản lý Gói bảo hiểm** - 4 loại: Life, Medical, Motor, Home
- ✅ **Tính toán Phí tự động** - Dựa trên gói, thời hạn, tần suất thanh toán
- ✅ **Quản lý Hợp đồng** - Tạo, xem, cập nhật trạng thái
- ✅ **Bồi thường** - Gửi yêu cầu, xét duyệt, theo dõi
- ✅ **Thanh toán** - Nhiều phương thức, tạo biên lai tự động
- ✅ **Vay vốn** - Vay theo hợp đồng bảo hiểm
- ✅ **Tin tức** - Thông báo chương trình, khuyến mãi

## 🚀 Quick Start

### Prerequisites

- .NET 10 SDK
- SQL Server
- Visual Studio 2022 hoặc VS Code

### Installation

1. Clone repository
```bash
git clone https://github.com/minhminh12315/Insurance-Services.git
cd Insurance-Services/backend
```

2. Restore packages
```bash
dotnet restore
```

3. Update connection string trong `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsuranceDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

4. Apply migrations
```bash
dotnet ef database update
```

5. Run application
```bash
dotnet run
```

6. Truy cập Swagger
```
https://localhost:5001/swagger
```

## 📚 Documentation

- [📖 API Documentation](API_DOCUMENTATION.md) - Tài liệu API đầy đủ
- [🔐 JWT Guide](JWT_README.md) - Hướng dẫn JWT Authentication
- [📝 Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Tổng kết implementation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client Layer                   │git 
│         (Web, Mobile, Third-party Apps)         │
└─────────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────┐
│              API Layer (Controllers)             │
│  Auth │ Category │ Scheme │ Policy │ Claim │... │
└─────────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────┐
│            Business Logic (Services)             │
│   Authentication │ Premium Calc │ Validation    │
└─────────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────┐
│           Data Access (EF Core + SQL)            │
│        Users │ Policies │ Claims │ Payments      │
└─────────────────────────────────────────────────┘
```

## 📊 API Endpoints

### Authentication (6 endpoints)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/validate-token
GET    /api/auth/me
```

### Insurance Management (23 endpoints)
```
# Categories
GET    /api/insurancecategory
POST   /api/insurancecategory
PUT    /api/insurancecategory/{id}
DELETE /api/insurancecategory/{id}

# Schemes
GET    /api/insurancescheme
POST   /api/insurancescheme
PUT    /api/insurancescheme/{id}
DELETE /api/insurancescheme/{id}
POST   /api/insurancescheme/calculate-premium

# Policies
GET    /api/policy/my-policies
POST   /api/policy
PATCH  /api/policy/{id}/status
POST   /api/policy/{id}/cancel
```

### Operations (15 endpoints)
```
# Claims, Payments, Loans, News
GET/POST/PATCH endpoints for each module
```

**Total: 44 API Endpoints**

## 🔐 Security

- **JWT Authentication** - Stateless authentication
- **Refresh Tokens** - Secure token rotation
- **Role-based Authorization** - Customer, Employee, Admin
- **Password Hashing** - SHA256
- **HTTPS** - Encrypted communication
- **CORS** - Configured for security

## 💾 Database Schema

### Core Tables
- **Users** - User accounts
- **RefreshTokens** - Token management
- **InsuranceCategories** - Insurance types
- **InsuranceSchemes** - Insurance packages
- **Policies** - Insurance contracts
- **PolicyDetails[Life|Medical|Motor|Home]** - Type-specific details
- **Claims** - Claim requests
- **PremiumPayments** - Payment records
- **PolicyLoans** - Loan applications
- **NewsAndAnnouncements** - News & updates

## 🧪 Testing

### Using Swagger UI
1. Navigate to `https://localhost:5001/swagger`
2. Register a new account
3. Login and copy the JWT token
4. Click "Authorize" button
5. Paste token (format: `Bearer {your-token}`)
6. Test all endpoints

### Using HTTP Files
```bash
# Open Tests/API_Tests.http in VS Code
# Install REST Client extension
# Execute requests
```

## 📈 Features Checklist

### Authentication & Authorization
- [x] User registration
- [x] Login with JWT
- [x] Refresh token mechanism
- [x] Token revocation
- [x] Role-based access control
- [x] Password security

### Insurance Management
- [x] Category CRUD
- [x] Scheme CRUD with validation
- [x] Premium calculation
- [x] Policy creation (all 4 types)
- [x] Policy status management

### Operations
- [x] Claim submission & approval
- [x] Premium payments
- [x] Policy loans
- [x] News & announcements

### System Features
- [x] Background token cleanup
- [x] Comprehensive error handling
- [x] Input validation
- [x] Swagger documentation
- [x] CORS support

## 🛠️ Technologies

- **Framework**: .NET 10
- **ORM**: Entity Framework Core 10
- **Database**: SQL Server
- **Authentication**: JWT Bearer
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture, Repository Pattern

## 📝 Example Usage

### Register & Login
```bash
# Register
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!","fullName":"Test User"}'

# Login
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}'
```

### Create Policy
```bash
curl -X POST https://localhost:5001/api/policy \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "schemeId": 1,
    "termYears": 10,
    "sumAssured": 100000000,
    "paymentFrequency": "Monthly",
    "lifeDetails": {
      "nomineeName": "John Doe",
      "nomineeRelation": "Spouse"
    }
  }'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Backend Development Team**

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ using .NET 10
