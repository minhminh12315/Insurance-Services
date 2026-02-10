# 🚀 Deployment Guide - Insurance Service API

## 📋 Pre-deployment Checklist

- [ ] Update `appsettings.Production.json`
- [ ] Change JWT secret key
- [ ] Configure production database
- [ ] Set up HTTPS certificate
- [ ] Configure CORS for production domains
- [ ] Enable logging
- [ ] Set up monitoring

---

## 🔧 Configuration

### 1. Update appsettings.Production.json

Create `appsettings.Production.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=InsuranceDB;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "CHANGE_THIS_TO_A_SECURE_RANDOM_KEY_AT_LEAST_32_CHARACTERS_LONG",
    "Issuer": "InsuranceServiceAPI",
    "Audience": "InsuranceServiceClients",
    "ExpirationInHours": "24"
  }
}
```

### 2. Update CORS Policy

In `Program.cs`, update CORS to allow specific domains:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins(
            "https://yourdomain.com",
            "https://www.yourdomain.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// In middleware
app.UseCors("Production");
```

---

## 🗄️ Database Setup

### SQL Server Setup

1. **Create Database**
```sql
CREATE DATABASE InsuranceDB;
GO
```

2. **Create User** (if needed)
```sql
CREATE LOGIN InsuranceUser WITH PASSWORD = 'YourStrongPassword123!';
GO
USE InsuranceDB;
GO
CREATE USER InsuranceUser FOR LOGIN InsuranceUser;
GO
ALTER ROLE db_owner ADD MEMBER InsuranceUser;
GO
```

3. **Run Migrations**
```bash
dotnet ef database update --configuration Production
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["InsuranceService.API.csproj", "./"]
RUN dotnet restore "InsuranceService.API.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "InsuranceService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InsuranceService.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InsuranceService.API.dll"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=https://+:443;http://+:80
      - ASPNETCORE_Kestrel__Certificates__Default__Password=YourCertPassword
      - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
    volumes:
      - ./https:/https:ro
    depends_on:
      - sqlserver

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sqldata:/var/opt/mssql

volumes:
  sqldata:
```

### 3. Build and Run

```bash
# Build Docker image
docker-compose build

# Run containers
docker-compose up -d

# Check logs
docker-compose logs -f api
```

---

## ☁️ Azure Deployment

### 1. Publish to Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name InsuranceAPI-RG --location eastus

# Create App Service plan
az appservice plan create --name InsuranceAPI-Plan --resource-group InsuranceAPI-RG --sku B1 --is-linux

# Create Web App
az webapp create --resource-group InsuranceAPI-RG --plan InsuranceAPI-Plan --name insurance-api-app --runtime "DOTNETCORE:10.0"

# Configure connection string
az webapp config connection-string set --resource-group InsuranceAPI-RG --name insurance-api-app --connection-string-type SQLAzure --settings DefaultConnection="Your-Connection-String"

# Deploy
dotnet publish -c Release
cd bin/Release/net10.0/publish
az webapp deployment source config-zip --resource-group InsuranceAPI-RG --name insurance-api-app --src publish.zip
```

### 2. Azure SQL Database

```bash
# Create SQL Server
az sql server create --name insurance-sql-server --resource-group InsuranceAPI-RG --location eastus --admin-user sqladmin --admin-password YourPassword123!

# Create Database
az sql db create --resource-group InsuranceAPI-RG --server insurance-sql-server --name InsuranceDB --service-objective S0

# Configure firewall
az sql server firewall-rule create --resource-group InsuranceAPI-RG --server insurance-sql-server --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

---

## 🖥️ IIS Deployment

### 1. Install Prerequisites

- IIS with ASP.NET Core Module
- .NET 10 Hosting Bundle

### 2. Publish Application

```bash
dotnet publish -c Release -o ./publish
```

### 3. Configure IIS

1. Create new website in IIS Manager
2. Point to publish folder
3. Set application pool to "No Managed Code"
4. Configure bindings (HTTP/HTTPS)
5. Set appropriate permissions

### 4. web.config (auto-generated)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\InsuranceService.API.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit sensitive data. Use environment variables:

```bash
# Linux/Mac
export ConnectionStrings__DefaultConnection="Server=..."
export JwtSettings__SecretKey="..."

# Windows
setx ConnectionStrings__DefaultConnection "Server=..."
setx JwtSettings__SecretKey "..."
```

### 2. Use Secrets Manager

**Development:**
```bash
dotnet user-secrets init
dotnet user-secrets set "JwtSettings:SecretKey" "YourSecretKey"
```

**Production:**
- Azure: Use Azure Key Vault
- AWS: Use AWS Secrets Manager
- Docker: Use Docker secrets

### 3. HTTPS Configuration

```csharp
// In Program.cs
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
```

---

## 📊 Monitoring & Logging

### 1. Application Insights (Azure)

```bash
# Install package
dotnet add package Microsoft.ApplicationInsights.AspNetCore

# Add to Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

### 2. Serilog Configuration

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

```csharp
// In Program.cs
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
```

---

## 🧪 Health Checks

Add health check endpoint:

```csharp
// In Program.cs
builder.Services.AddHealthChecks()
    .AddDbContextCheck<InsuranceDbContext>();

app.MapHealthChecks("/health");
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '10.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --configuration Release --no-restore
    
    - name: Test
      run: dotnet test --no-restore --verbosity normal
    
    - name: Publish
      run: dotnet publish -c Release -o ./publish
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'insurance-api-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./publish
```

---

## 📝 Post-Deployment

### 1. Verify Deployment

```bash
# Check API health
curl https://yourdomain.com/health

# Test authentication
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}'
```

### 2. Monitor Logs

```bash
# Azure
az webapp log tail --name insurance-api-app --resource-group InsuranceAPI-RG

# Docker
docker-compose logs -f api
```

### 3. Database Backup

```bash
# Azure SQL
az sql db export --resource-group InsuranceAPI-RG \
  --server insurance-sql-server \
  --name InsuranceDB \
  --admin-user sqladmin \
  --admin-password YourPassword \
  --storage-key-type StorageAccessKey \
  --storage-key "YourStorageKey" \
  --storage-uri "https://youraccount.blob.core.windows.net/backups/backup.bacpac"
```

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check connection string
   - Verify firewall rules
   - Ensure database exists

2. **JWT Token Invalid**
   - Check secret key matches
   - Verify token not expired
   - Check issuer/audience settings

3. **CORS Errors**
   - Update CORS policy
   - Check allowed origins
   - Verify credentials setting

### Debug Commands

```bash
# Check environment
dotnet --info

# List environment variables
printenv | grep -i aspnet  # Linux
set | findstr ASPNET       # Windows

# Test database connection
sqlcmd -S your-server -U your-user -P your-password -Q "SELECT 1"
```

---

## 📚 Additional Resources

- [ASP.NET Core Deployment](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [Docker Documentation](https://docs.docker.com/)
- [Entity Framework Migrations](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)

---

**Good luck with your deployment! 🚀**
