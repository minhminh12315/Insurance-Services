# Insurance Service API - Authentication

## Tổng quan
API xác thực cho hệ thống bảo hiểm, hỗ trợ đăng ký và đăng nhập người dùng với JWT token.

## Endpoints

### 1. Đăng ký người dùng mới
**POST** `/api/Auth/register`

#### Request Body:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "phoneNumber": "0901234567",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Đường ABC",
  "city": "Hà Nội"
}
```

#### Validation Rules:
- **fullName**: Bắt buộc, 2-100 ký tự
- **email**: Bắt buộc, định dạng email hợp lệ, duy nhất
- **password**: Bắt buộc, tối thiểu 6 ký tự
- **confirmPassword**: Bắt buộc, phải khớp với password
- **phoneNumber**: Tùy chọn, định dạng số điện thoại
- **dateOfBirth**: Bắt buộc
- **gender**: Tùy chọn, tối đa 10 ký tự
- **address**: Tùy chọn, tối đa 200 ký tự
- **city**: Tùy chọn, tối đa 100 ký tự

#### Response (Success - 200 OK):
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phoneNumber": "0901234567",
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "role": "Customer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Response (Error - 400 Bad Request):
```json
{
  "success": false,
  "message": "Email already exists",
  "token": null,
  "user": null
}
```

---

### 2. Đăng nhập
**POST** `/api/Auth/login`

#### Request Body:
```json
{
  "email": "nguyenvana@example.com",
  "password": "Password123!"
}
```

#### Validation Rules:
- **email**: Bắt buộc, định dạng email hợp lệ
- **password**: Bắt buộc

#### Response (Success - 200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phoneNumber": "0901234567",
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "role": "Customer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Response (Error - 401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "token": null,
  "user": null
}
```

---

## Sử dụng JWT Token

Sau khi đăng nhập hoặc đăng ký thành công, bạn sẽ nhận được JWT token. Sử dụng token này cho các API requests khác:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Thông tin trong Token:
- **UserId**: ID người dùng
- **Name**: Tên đầy đủ
- **Email**: Email người dùng
- **Role**: Vai trò (Customer, Admin, etc.)
- **Expiration**: Token hết hạn sau 24 giờ (mặc định)

---

## Cấu hình

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsuranceDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!@#$%",
    "Issuer": "InsuranceServiceAPI",
    "Audience": "InsuranceServiceClients",
    "ExpirationInHours": "24"
  }
}
```

**Lưu ý**: Trong môi trường production, hãy sử dụng biến môi trường hoặc Azure Key Vault để lưu trữ SecretKey.

---

## Bảo mật

### Password Hashing
- Sử dụng SHA256 để hash password
- Password được lưu dưới dạng hash trong database
- Không bao giờ lưu trữ plain text password

### JWT Security
- Token được ký bằng HMAC SHA256
- Token có thời gian hết hạn (mặc định 24 giờ)
- Validate Issuer, Audience, và Signature

---

## Error Codes

| Status Code | Mô tả |
|------------|-------|
| 200 OK | Request thành công |
| 400 Bad Request | Dữ liệu không hợp lệ hoặc email đã tồn tại |
| 401 Unauthorized | Email hoặc password không đúng |
| 500 Internal Server Error | Lỗi server |

---

## Testing

Sử dụng file `Tests/Auth.http` để test các endpoints với Visual Studio hoặc VS Code REST Client extension.

---

## Cấu trúc thư mục

```
InsuranceService.API/
├── Controllers/
│   └── AuthController.cs          # API endpoints
├── Services/
│   ├── IAuthService.cs            # Service interface
│   └── AuthService.cs             # Business logic
├── DTOs/
│   ├── RegisterRequestDto.cs      # Register request model
│   ├── LoginRequestDto.cs         # Login request model
│   └── AuthResponseDto.cs         # Response model
├── Models/
│   ├── User.cs                    # User entity
│   └── InsuranceDbContext.cs      # Database context
└── Tests/
    └── Auth.http                  # HTTP test file
```

---

## Next Steps

1. **Email Verification**: Thêm xác thực email sau khi đăng ký
2. **Password Reset**: Chức năng quên mật khẩu
3. **Refresh Token**: Implement refresh token mechanism
4. **Role-based Authorization**: Phân quyền theo vai trò
5. **Two-Factor Authentication**: Xác thực 2 yếu tố
6. **Account Lockout**: Khóa tài khoản sau nhiều lần đăng nhập sai
