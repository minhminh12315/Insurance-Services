# Quick Start Guide - New Features

## 🚀 Setup (5 minutes)

### Step 1: Apply Database Migration

Choose one of these methods:

#### Method A: Using sqlcmd (Command Line)
```bash
cd /home/minh/Desktop/Insurance-Services/backend
sqlcmd -S "(localdb)\MSSQLLocalDB" -d InsuranceDB -i Migrations/SQL_Migration_HighPriorityFeatures.sql
```

#### Method B: Using SQL Server Management Studio
1. Open SSMS
2. Connect to `(localdb)\MSSQLLocalDB`
3. Select database `InsuranceDB`
4. Open file `Migrations/SQL_Migration_HighPriorityFeatures.sql`
5. Click Execute

#### Method C: Using Azure Data Studio
1. Connect to local SQL Server
2. Right-click InsuranceDB → New Query
3. Paste contents of `SQL_Migration_HighPriorityFeatures.sql`
4. Run Query

### Step 2: Create Upload Directory
```bash
cd /home/minh/Desktop/Insurance-Services/backend
mkdir -p Uploads/claims
chmod 755 Uploads
```

### Step 3: Configure Email (Optional)
Edit `appsettings.json`:
```json
"EmailSettings": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": 587,
  "SmtpUsername": "your-email@gmail.com",
  "SmtpPassword": "your-app-password",
  "FromEmail": "noreply@insurance.com",
  "FromName": "Insurance Service",
  "EnableSsl": true
}
```

**Gmail App Password:** https://myaccount.google.com/apppasswords

### Step 4: Run the Application
```bash
cd /home/minh/Desktop/Insurance-Services/backend
dotnet run
```

Access Swagger: http://localhost:5000/swagger

---

## 🧪 Quick Test Commands

### 1. Login to Get Token
```bash
# Login as admin (or any existing user)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'

# Copy the token from response
export TOKEN="your-jwt-token-here"
```

### 2. Test User Profile
```bash
# Get current user profile
curl -X GET http://localhost:5000/api/userprofile/me \
  -H "Authorization: Bearer $TOKEN"

# Update profile
curl -X PUT http://localhost:5000/api/userprofile/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User Updated",
    "phoneNumber": "0901234567",
    "address": "123 Test Street",
    "city": "Hanoi"
  }'
```

### 3. Test Notifications
```bash
# Get notifications
curl -X GET http://localhost:5000/api/notification \
  -H "Authorization: Bearer $TOKEN"

# Get notification summary
curl -X GET http://localhost:5000/api/notification/summary \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Dashboard (Admin/Employee only)
```bash
# Get dashboard statistics
curl -X GET http://localhost:5000/api/report/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Get monthly revenue
curl -X GET "http://localhost:5000/api/report/monthly-revenue?year=2026" \
  -H "Authorization: Bearer $TOKEN"

# Get policy distribution
curl -X GET http://localhost:5000/api/report/category-distribution \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Test Rider Templates
```bash
# Get Life insurance rider templates
curl -X GET http://localhost:5000/api/policyrider/templates/Life \
  -H "Authorization: Bearer $TOKEN"

# Get Medical insurance rider templates
curl -X GET http://localhost:5000/api/policyrider/templates/Medical \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Test File Upload
```bash
# Upload document to claim #1
curl -X POST http://localhost:5000/api/claim/1/upload-document \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf"
```

---

## 🎯 Test Scenarios

### Scenario 1: Complete User Profile Flow
1. Login → Get token
2. GET /api/userprofile/me → View profile
3. PUT /api/userprofile/me → Update profile
4. POST /api/userprofile/change-password → Change password
5. Login again with new password

### Scenario 2: Notification Flow
1. Admin creates policy for user
2. Check user's notifications
3. User marks notification as read
4. Check email inbox for notification email

### Scenario 3: File Upload Flow
1. User creates claim
2. Upload document to claim
3. Verify file exists in /Uploads/claims/
4. Retrieve claim → See document_path populated

### Scenario 4: Rider Addition Flow
1. GET rider templates for policy category
2. POST to add rider to policy
3. GET policy with riders
4. Verify total premium includes rider premium

### Scenario 5: Dashboard Reports Flow
1. Login as Admin
2. GET dashboard statistics
3. GET monthly revenue report
4. GET category distribution
5. GET recent activities

---

## ✅ Verification Checklist

After migration and setup, verify:

- [ ] Database has `Notifications` table
- [ ] Database has `PolicyRiders` table
- [ ] Claims table has `document_path` column
- [ ] PolicyDetails_Medical has new limit columns
- [ ] `/Uploads` directory exists and is writable
- [ ] Application starts without errors
- [ ] Swagger UI shows new endpoints
- [ ] User profile endpoints work
- [ ] Notification endpoints work
- [ ] Dashboard endpoints work (for admin)
- [ ] Rider templates return data
- [ ] File upload creates file in directory

---

## 🐛 Troubleshooting

### Migration Fails
```sql
-- Check if tables already exist
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('Notifications', 'PolicyRiders')

-- If exists, either:
-- 1. Drop and recreate, OR
-- 2. Comment out CREATE TABLE sections in SQL
```

### "Cannot find namespace" error
```bash
# Restore packages
dotnet restore

# Clean and rebuild
dotnet clean
dotnet build
```

### Email not sending
- Check SMTP settings are correct
- For Gmail: Enable 2FA and create App Password
- Check firewall allows outbound SMTP (port 587/465)
- Test with: https://www.smtper.net/

### File upload fails
```bash
# Check directory permissions
ls -la Uploads

# Fix permissions
chmod -R 755 Uploads
chown -R $USER:$USER Uploads
```

### 401 Unauthorized
- Token expired → Login again
- Token missing Bearer prefix → Add "Bearer " before token
- Check role permissions for endpoint

### Dashboard returns 0 for everything
- Check database has seeded data
- Run DatabaseSeeder if needed
- Verify user has Admin/Employee role

---

## 📊 Expected Results After Migration

### Database Statistics:
- **Notifications table:** 0 rows (initially)
- **PolicyRiders table:** 0 rows (initially)
- **Claims:** Existing rows with NULL document_path
- **PolicyDetails_Medical:** Existing rows with default values for new columns

### API Endpoints Count:
- **Total Controllers:** 11
- **Total Endpoints:** ~70+
- **New Endpoints:** 25

### File System:
```
backend/
├── Uploads/           # ✅ Created
│   └── claims/        # ✅ Created
├── Migrations/
│   └── SQL_***.sql    # ✅ Ready to execute
```

---

## 🎉 Success Indicators

You're ready to go when:
1. ✅ Migration executed without errors
2. ✅ Application starts successfully
3. ✅ Swagger shows all new endpoints
4. ✅ User can update profile
5. ✅ Admin can see dashboard
6. ✅ File upload creates file in directory
7. ✅ Notifications appear for user actions

---

## 📞 Next Steps

1. **Frontend Integration**
   - Create UI components for:
     - User profile page
     - Notification bell icon
     - Admin dashboard
     - Rider selection during policy purchase
     - Claim document upload

2. **Scheduled Jobs (Optional)**
   - Implement background service for premium reminders
   - Policy expiry notifications
   - Usage limit warnings for medical policies

3. **Production Deployment**
   - Move to cloud-based file storage (S3, Azure Blob)
   - Configure production SMTP service
   - Set up SSL certificates
   - Configure CORS for frontend domain
   - Enable logging and monitoring

---

**Ready to test?** Start with Step 1 above! 🚀

For detailed API documentation, see: [HIGH_PRIORITY_FEATURES_IMPLEMENTATION.md](HIGH_PRIORITY_FEATURES_IMPLEMENTATION.md)
