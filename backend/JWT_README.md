# JWT Authentication - Hướng Dẫn Sử Dụng

## Tổng quan
Hệ thống JWT Authentication đầy đủ với các tính năng:
- **Access Token** - Để xác thực requests
- **Refresh Token** - Để làm mới access token khi hết hạn
- **Token Revocation** - Thu hồi token
- **Token Validation** - Xác thực token
- **Automatic Cleanup** - Tự động xóa token hết hạn

## Cấu trúc

### 1. Models
- **RefreshToken** (`Models/RefreshToken.cs`): Lưu trữ refresh tokens trong database

### 2. DTOs
- **TokenDtos** (`DTOs/TokenDtos.cs`): Các DTO cho token operations
  - RefreshTokenRequestDto
  - RevokeTokenRequestDto
  - TokenResponseDto
  - ValidateTokenRequestDto
  - ValidateTokenResponseDto

### 3. Services
- **ITokenService / TokenService** (`Services/TokenService.cs`): Quản lý token logic
  - Tạo access token và refresh token
  - Validate token
  - Refresh token
  - Revoke token
  - Cleanup expired tokens

- **IAuthService / AuthService** (`Services/AuthService.cs`): Xác thực người dùng
  - Register
  - Login
  - Logout
  - Refresh token
  - Validate token

### 4. Controllers
- **AuthController** (`Controllers/AuthController.cs`): API endpoints
  - POST `/api/auth/register` - Đăng ký
  - POST `/api/auth/login` - Đăng nhập
  - POST `/api/auth/refresh-token` - Làm mới token
  - POST `/api/auth/revoke-token` - Thu hồi token
  - POST `/api/auth/logout` - Đăng xuất
  - POST `/api/auth/validate-token` - Kiểm tra token
  - GET `/api/auth/me` - Lấy thông tin user hiện tại

### 5. Background Services
- **TokenCleanupService** (`BackgroundServices/TokenCleanupService.cs`): Tự động xóa token hết hạn mỗi 24h

## API Endpoints

### 1. Register (Đăng ký)
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "email": "test@example.com",
  "password": "Password123!",
  "phoneNumber": "0123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "address": "123 Street",
  "city": "Ho Chi Minh"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abcdef123456...",
  "tokenExpiration": "2024-02-11T10:00:00Z",
  "user": {
    "userId": 1,
    "fullName": "Nguyen Van A",
    "email": "test@example.com",
    "role": "Customer"
  }
}
```

### 2. Login (Đăng nhập)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

Response: giống Register

### 3. Refresh Token (Làm mới token)
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "abcdef123456..."
}
```

Response:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "newtoken123456...",
    "accessTokenExpiration": "2024-02-11T10:00:00Z",
    "refreshTokenExpiration": "2024-02-18T10:00:00Z"
  }
}
```

### 4. Validate Token (Kiểm tra token)
```http
POST /api/auth/validate-token
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "isValid": true,
  "message": "Token is valid",
  "userId": 1,
  "email": "test@example.com",
  "role": "Customer",
  "expiresAt": "2024-02-11T10:00:00Z"
}
```

### 5. Revoke Token (Thu hồi token)
```http
POST /api/auth/revoke-token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "token": "refreshtoken123..."
}
```

### 6. Logout (Đăng xuất - thu hồi tất cả token)
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7. Get Current User (Lấy thông tin user)
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "1",
    "email": "test@example.com",
    "name": "Nguyen Van A",
    "role": "Customer"
  }
}
```

## Sử dụng JWT trong Controllers khác

### Bảo vệ endpoint với [Authorize]
```csharp
[Authorize]
[HttpGet]
public IActionResult GetProtectedData()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var email = User.FindFirst(ClaimTypes.Email)?.Value;
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    
    return Ok(new { userId, email, role });
}
```

### Bảo vệ theo Role
```csharp
[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public IActionResult DeleteUser(int id)
{
    // Chỉ Admin mới được truy cập
    return Ok();
}
```

## Cấu hình

### appsettings.json
```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!@#$%",
    "Issuer": "InsuranceServiceAPI",
    "Audience": "InsuranceServiceClients",
    "ExpirationInHours": "24"
  }
}
```

**Lưu ý**: 
- Access Token hết hạn sau 24 giờ (có thể config)
- Refresh Token hết hạn sau 7 ngày
- Nên thay đổi SecretKey trong production

## Migration

Chạy migration để tạo bảng RefreshTokens:
```bash
dotnet ef database update
```

## Quy trình hoạt động

1. **Đăng ký/Đăng nhập**: Client nhận access token và refresh token
2. **Sử dụng API**: Gửi access token trong header `Authorization: Bearer {token}`
3. **Token hết hạn**: Client dùng refresh token để lấy token mới
4. **Logout**: Client gọi endpoint logout để thu hồi tất cả tokens
5. **Cleanup**: Background service tự động xóa token hết hạn mỗi 24h

## Security Best Practices

1. **Lưu trữ Token**:
   - Access token: Lưu trong memory (không lưu localStorage)
   - Refresh token: Lưu trong httpOnly cookie hoặc secure storage

2. **HTTPS**: Luôn dùng HTTPS trong production

3. **Secret Key**: Dùng secret key mạnh và lưu trong environment variables

4. **Token Rotation**: Refresh token được tự động rotate khi làm mới

5. **IP Tracking**: Hệ thống track IP address của mỗi token operation
