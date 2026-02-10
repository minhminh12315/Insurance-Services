# Insurance Service API - Complete Documentation

## 📋 Tổng quan

API quản lý hệ thống bảo hiểm đầy đủ với các tính năng:
- ✅ Xác thực và phân quyền (JWT)
- ✅ Quản lý danh mục bảo hiểm
- ✅ Quản lý gói bảo hiểm
- ✅ Tính toán phí bảo hiểm
- ✅ Quản lý hợp đồng (Life, Medical, Motor, Home)
- ✅ Xử lý bồi thường (Claims)
- ✅ Thanh toán phí bảo hiểm
- ✅ Vay vốn theo hợp đồng
- ✅ Tin tức và thông báo

---

## 🔐 Authentication & Authorization

### Base URL
```
https://localhost:5001/api
```

### Authentication Header
```
Authorization: Bearer {your-jwt-token}
```

### Roles
- **Customer**: Người dùng thường
- **Employee**: Nhân viên
- **Admin**: Quản trị viên

---

## 📚 API Endpoints

### 1. AUTHENTICATION

#### 1.1 Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "phoneNumber": "0123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "address": "123 Street",
  "city": "Hà Nội"
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
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "role": "Customer"
  }
}
```

#### 1.2 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

#### 1.3 Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### 1.4 Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### 1.5 Validate Token
```http
POST /api/auth/validate-token
Content-Type: application/json

{
  "token": "your-access-token"
}
```

#### 1.6 Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

### 2. INSURANCE CATEGORIES (Danh mục bảo hiểm)

#### 2.1 Get All Categories
```http
GET /api/insurancecategory
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Bảo hiểm nhân thọ",
      "description": "Bảo hiểm cho cuộc sống",
      "schemeCount": 5
    }
  ]
}
```

#### 2.2 Get Category by ID
```http
GET /api/insurancecategory/{id}
```

#### 2.3 Create Category (Admin/Employee only)
```http
POST /api/insurancecategory
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryName": "Bảo hiểm nhân thọ",
  "description": "Bảo hiểm cho cuộc sống"
}
```

#### 2.4 Update Category (Admin/Employee only)
```http
PUT /api/insurancecategory/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryName": "Bảo hiểm nhân thọ",
  "description": "Updated description"
}
```

#### 2.5 Delete Category (Admin only)
```http
DELETE /api/insurancecategory/{id}
Authorization: Bearer {token}
```

---

### 3. INSURANCE SCHEMES (Gói bảo hiểm)

#### 3.1 Get All Schemes
```http
GET /api/insurancescheme?categoryId=1&isActive=true
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "schemeId": 1,
      "categoryId": 1,
      "categoryName": "Bảo hiểm nhân thọ",
      "schemeName": "Gói An Sinh Vàng",
      "description": "Bảo hiểm toàn diện",
      "minTerm": 5,
      "maxTerm": 30,
      "minInvestmentAmount": 10000000,
      "maxInvestmentAmount": 1000000000,
      "profitRatio": 5.5,
      "isActive": true,
      "policyCount": 120
    }
  ]
}
```

#### 3.2 Get Scheme by ID
```http
GET /api/insurancescheme/{id}
```

#### 3.3 Create Scheme (Admin/Employee only)
```http
POST /api/insurancescheme
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": 1,
  "schemeName": "Gói An Sinh Vàng",
  "description": "Bảo hiểm toàn diện",
  "minTerm": 5,
  "maxTerm": 30,
  "minInvestmentAmount": 10000000,
  "maxInvestmentAmount": 1000000000,
  "profitRatio": 5.5,
  "isActive": true
}
```

#### 3.4 Update Scheme (Admin/Employee only)
```http
PUT /api/insurancescheme/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### 3.5 Delete Scheme (Admin only)
```http
DELETE /api/insurancescheme/{id}
Authorization: Bearer {token}
```

#### 3.6 Calculate Premium
```http
POST /api/insurancescheme/calculate-premium
Content-Type: application/json

{
  "schemeId": 1,
  "sumAssured": 100000000,
  "termYears": 10,
  "paymentFrequency": "Monthly"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "schemeId": 1,
    "schemeName": "Gói An Sinh Vàng",
    "sumAssured": 100000000,
    "termYears": 10,
    "paymentFrequency": "Monthly",
    "annualPremium": 550000,
    "premiumPerInstallment": 45833.33,
    "numberOfInstallments": 120,
    "totalPremiumPayable": 5500000,
    "calculationDetails": "Calculation: Sum Assured (100,000,000) × Profit Ratio (5.5%) ÷ Term (10 years)..."
  }
}
```

---

### 4. POLICIES (Hợp đồng bảo hiểm)

#### 4.1 Get All Policies (Admin/Employee only)
```http
GET /api/policy?userId=1&status=Active
Authorization: Bearer {token}
```

#### 4.2 Get Policy by ID
```http
GET /api/policy/{id}
Authorization: Bearer {token}
```

#### 4.3 Get Policy by Number
```http
GET /api/policy/by-number/{policyNumber}
Authorization: Bearer {token}
```

#### 4.4 Get My Policies
```http
GET /api/policy/my-policies?activeOnly=true
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "policyId": 1,
      "userId": 1,
      "userName": "Nguyễn Văn A",
      "schemeId": 1,
      "schemeName": "Gói An Sinh Vàng",
      "categoryName": "Bảo hiểm nhân thọ",
      "policyNumber": "POL-LIF-20240210-000001",
      "startDate": "2024-01-01",
      "maturityDate": "2034-01-01",
      "termYears": 10,
      "paymentFrequency": "Monthly",
      "sumAssured": 100000000,
      "premiumAmount": 45833.33,
      "policyStatus": "Active",
      "policyDetails": {
        "nomineeName": "Nguyễn Thị B",
        "nomineeRelation": "Wife"
      }
    }
  ]
}
```

#### 4.5 Create Policy (Life Insurance Example)
```http
POST /api/policy
Authorization: Bearer {token}
Content-Type: application/json

{
  "schemeId": 1,
  "termYears": 10,
  "paymentFrequency": "Monthly",
  "sumAssured": 100000000,
  "lifeDetails": {
    "nomineeName": "Nguyễn Thị B",
    "nomineeRelation": "Wife"
  }
}
```

#### 4.6 Create Policy (Medical Insurance Example)
```http
POST /api/policy
Authorization: Bearer {token}
Content-Type: application/json

{
  "schemeId": 2,
  "termYears": 1,
  "paymentFrequency": "Yearly",
  "sumAssured": 50000000,
  "medicalDetails": {
    "preExistingDiseases": "Diabetes",
    "hospitalNetworkTier": "Premium",
    "isFamilyFloater": true
  }
}
```

#### 4.7 Create Policy (Motor Insurance Example)
```http
POST /api/policy
Authorization: Bearer {token}
Content-Type: application/json

{
  "schemeId": 3,
  "termYears": 1,
  "paymentFrequency": "Yearly",
  "sumAssured": 30000000,
  "motorDetails": {
    "vehicleRegNumber": "29A-12345",
    "vehicleModel": "Honda City",
    "vehicleType": "Sedan",
    "engineNumber": "ENG123456",
    "chassisNumber": "CHS123456",
    "manufacturingYear": 2020
  }
}
```

#### 4.8 Create Policy (Home Insurance Example)
```http
POST /api/policy
Authorization: Bearer {token}
Content-Type: application/json

{
  "schemeId": 4,
  "termYears": 5,
  "paymentFrequency": "Yearly",
  "sumAssured": 200000000,
  "homeDetails": {
    "propertyAddress": "123 Main Street, District 1, HCMC",
    "propertyValue": 200000000,
    "structureType": "Concrete",
    "builtYear": 2015
  }
}
```

#### 4.9 Update Policy Status (Admin/Employee only)
```http
PATCH /api/policy/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Lapsed"
}
```
Status options: Active, Lapsed, Matured, Surrendered, Cancelled

#### 4.10 Cancel Policy
```http
POST /api/policy/{id}/cancel
Authorization: Bearer {token}
```

---

### 5. CLAIMS (Bồi thường)

#### 5.1 Get All Claims (Admin/Employee only)
```http
GET /api/claim?userId=1&status=Submitted
Authorization: Bearer {token}
```

#### 5.2 Get Claim by ID
```http
GET /api/claim/{id}
Authorization: Bearer {token}
```

#### 5.3 Get My Claims
```http
GET /api/claim/my-claims
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "claimId": 1,
      "policyId": 1,
      "policyNumber": "POL-LIF-20240210-000001",
      "userId": 1,
      "userName": "Nguyễn Văn A",
      "claimDate": "2024-02-10",
      "claimAmount": 5000000,
      "reason": "Hospitalization due to accident",
      "status": "Submitted",
      "adminComment": null
    }
  ]
}
```

#### 5.4 Submit Claim
```http
POST /api/claim
Authorization: Bearer {token}
Content-Type: application/json

{
  "policyId": 1,
  "claimAmount": 5000000,
  "reason": "Hospitalization due to accident"
}
```

#### 5.5 Update Claim Status (Admin/Employee only)
```http
PATCH /api/claim/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Approved",
  "adminComment": "Claim approved after document verification"
}
```
Status options: Submitted, UnderReview, Approved, Rejected, Paid

---

### 6. PREMIUM PAYMENTS (Thanh toán phí)

#### 6.1 Get All Payments (Admin/Employee only)
```http
GET /api/premiumpayment?userId=1&policyId=1
Authorization: Bearer {token}
```

#### 6.2 Get Payment by ID
```http
GET /api/premiumpayment/{id}
Authorization: Bearer {token}
```

#### 6.3 Get My Payments
```http
GET /api/premiumpayment/my-payments
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "paymentId": 1,
      "policyId": 1,
      "policyNumber": "POL-LIF-20240210-000001",
      "userId": 1,
      "userName": "Nguyễn Văn A",
      "amountPaid": 45833.33,
      "paymentDate": "2024-02-10T10:30:00Z",
      "paymentMethod": "CreditCard",
      "transactionReference": "TXN-20240210103000-ABC12345",
      "status": "Completed"
    }
  ]
}
```

#### 6.4 Make Payment
```http
POST /api/premiumpayment
Authorization: Bearer {token}
Content-Type: application/json

{
  "policyId": 1,
  "amountPaid": 45833.33,
  "paymentMethod": "CreditCard",
  "transactionReference": "TXN123456"
}
```
Payment methods: CreditCard, DebitCard, BankTransfer, UPI, Cash

#### 6.5 Update Payment Status (Admin/Employee only)
```http
PATCH /api/premiumpayment/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Completed"
}
```
Status options: Pending, Completed, Failed, Refunded

---

### 7. POLICY LOANS (Vay vốn)

#### 7.1 Get All Loans (Admin/Employee only)
```http
GET /api/policyloan?userId=1
Authorization: Bearer {token}
```

#### 7.2 Get Loan by ID
```http
GET /api/policyloan/{id}
Authorization: Bearer {token}
```

#### 7.3 Get My Loans
```http
GET /api/policyloan/my-loans
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "loanId": 1,
      "policyId": 1,
      "policyNumber": "POL-LIF-20240210-000001",
      "userId": 1,
      "userName": "Nguyễn Văn A",
      "loanAmount": 40000000,
      "interestRate": 8.5,
      "applicationDate": "2024-02-10",
      "approvalDate": "2024-02-11",
      "loanStatus": "Approved"
    }
  ]
}
```

#### 7.4 Apply for Loan
```http
POST /api/policyloan
Authorization: Bearer {token}
Content-Type: application/json

{
  "policyId": 1,
  "loanAmount": 40000000
}
```
Note: 
- Policy must be at least 3 years old
- Max loan amount is 40% of sum assured

#### 7.5 Update Loan Status (Admin/Employee only)
```http
PATCH /api/policyloan/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "loanStatus": "Approved"
}
```
Status options: Requested, Approved, Rejected, Disbursed, Repaid

---

### 8. NEWS & ANNOUNCEMENTS (Tin tức & Thông báo)

#### 8.1 Get All News
```http
GET /api/news
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "newsId": 1,
      "title": "Chương trình khuyến mãi tháng 2",
      "content": "Giảm 20% phí bảo hiểm cho khách hàng mới...",
      "publishedDate": "2024-02-10T10:00:00Z",
      "authorId": 1,
      "authorName": "Admin"
    }
  ]
}
```

#### 8.2 Get News by ID
```http
GET /api/news/{id}
```

#### 8.3 Create News (Admin/Employee only)
```http
POST /api/news
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Chương trình khuyến mãi tháng 2",
  "content": "Giảm 20% phí bảo hiểm cho khách hàng mới..."
}
```

#### 8.4 Update News (Admin/Employee only)
```http
PUT /api/news/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content"
}
```

#### 8.5 Delete News (Admin only)
```http
DELETE /api/news/{id}
Authorization: Bearer {token}
```

---

## 🔄 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { }
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Success |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## 🚀 Getting Started

1. **Register a new account**
2. **Login to get JWT token**
3. **Use token in Authorization header for protected endpoints**
4. **Explore insurance schemes**
5. **Calculate premium**
6. **Create policy**
7. **Make payments**
8. **Submit claims if needed**

---

## 🛡️ Security Notes

- Always use HTTPS in production
- Store JWT tokens securely (not in localStorage)
- Refresh tokens before expiry
- Log out when done
- Never share your tokens

---

## 📝 Database Migration

Run this command to apply all changes to database:
```bash
dotnet ef database update
```

---

## 🎯 Features Checklist

✅ User Registration & Login with JWT  
✅ Token Refresh & Revocation  
✅ Insurance Categories Management  
✅ Insurance Schemes Management  
✅ Premium Calculation  
✅ Policy Creation (Life, Medical, Motor, Home)  
✅ Claims Management  
✅ Premium Payments  
✅ Policy Loans  
✅ News & Announcements  
✅ Role-based Authorization  
✅ Comprehensive Error Handling  

---

## 📞 Support

For any issues or questions, please contact the development team.
