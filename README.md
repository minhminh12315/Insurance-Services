# Insurance Services (Fullstack)

This repository contains a .NET 10 Web API backend and a React + TypeScript + Vite frontend for a sample insurance platform.

Contents
- `backend/` — ASP.NET Core Web API, EF Core migrations, services and background tasks. See [backend/README.md](backend/README.md) for detailed API docs.
- `client/` — React + TypeScript + Vite frontend. See [client/README.md](client/README.md) for frontend notes.

This README helps a newcomer clone the repo, configure environment, and run both backend and frontend locally.

**Quick links**
- API Swagger (when running backend): `https://localhost:5001/swagger`
- Contact endpoint: `POST /api/contact` (used by Home page form)

## Prerequisites
- .NET 10 SDK — verify with `dotnet --version`
- Node.js (LTS recommended, Node 18+), `npm`
- SQL Server or a Docker container running SQL Server (the project uses SQL Server by default)
- (Optional) `dotnet-ef` tool for migrations: `dotnet tool install --global dotnet-ef`

## Clone

```bash
git clone https://github.com/minhminh12315/Insurance-Services.git
cd Insurance-Services
```

## Backend (API)

1. Open `backend` folder

```bash
cd backend
```

2. Restore packages

```bash
dotnet restore
```

3. Configure database

- Default connection string is in [backend/appsettings.json](backend/appsettings.json) and [backend/appsettings.Development.json](backend/appsettings.Development.json). By default it targets LocalDB (Windows):

```json
"ConnectionStrings": {
	"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsuranceDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

- On Linux or if you prefer Docker, start SQL Server via Docker:

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=YourStrong!Passw0rd' -p 1433:1433 --name ins-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

Then update the connection string to point to `Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;Database=InsuranceDB;TrustServerCertificate=True;` in `backend/appsettings.Development.json`.

4. Apply EF Core migrations (creates DB schema)

```bash
dotnet ef database update
```

5. (Optional) The app runs a database seeder on startup (`DatabaseSeeder.SeedAsync`). Ensure the DB user has permissions.

6. Configure Email (SMTP)

- SMTP settings are read from `EmailSettings` in `appsettings.Development.json`. Example keys:

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

- For Gmail, create an App Password and set `SmtpUsername` to your Gmail address and `SmtpPassword` to the app password. See [backend/QUICK_START_GUIDE.md](backend/QUICK_START_GUIDE.md) for troubleshooting tips.

7. Run the API

```bash
dotnet run
```

- By default the API listens on `https://localhost:5001` (see swagger at `https://localhost:5001/swagger`).

## Frontend (client)

1. Install deps and run

```bash
cd client
npm install
npm run dev
```

2. Configure API base URL

- Frontend reads `VITE_API_BASE_URL` from environment. Default is `http://localhost:5000/api` (see `client/src/services/api.ts`). To point to your running backend set an env var before starting Vite, for example:

```bash
export VITE_API_BASE_URL="https://localhost:5001/api"
npm run dev
```

3. The Home page contains a "Get A Quote" contact form which sends `POST /api/contact` (the backend endpoint uses `EmailService` to notify admin and send acknowledgment to the user).

## Important files
- Backend API docs and quickstart: [backend/README.md](backend/README.md)
- Contact DTO: [backend/DTOs/ContactDto.cs](backend/DTOs/ContactDto.cs)
- Contact controller: [backend/Controllers/ContactController.cs](backend/Controllers/ContactController.cs)
- Email service: [backend/Services/EmailService.cs](backend/Services/EmailService.cs)
- Frontend Home page (contact form): [client/src/pages/Home.tsx](client/src/pages/Home.tsx)
- Frontend API client: [client/src/services/api.ts](client/src/services/api.ts)

## Testing the Contact flow quickly

1. Start backend and frontend (see commands above).
2. Open `http://localhost:5173` (or the Vite dev URL) and go to Home.
3. Fill the "Get A Quote" form and submit — you should see success or error messages inline.

Alternatively, call the contact endpoint directly (example using `curl`):

```bash
curl -k -X POST https://localhost:5001/api/contact \
	-H "Content-Type: application/json" \
	-d '{"name":"Test User","email":"test@example.com","message":"Hello from curl"}'
```

## Troubleshooting
- If the API cannot connect to DB, check connection string and ensure SQL Server is running.
- If emails are not sent, confirm SMTP settings and credentials. For Gmail, enable 2FA and use an App Password.
- For CORS issues, backend has an `AllowAll` policy configured in `Program.cs`.

## Development notes
- The backend seeds some initial data at startup (`Program.cs` -> `DatabaseSeeder.SeedAsync`).
- Swagger UI is available during development at `/swagger`.

## Contributing
- See [backend/README.md](backend/README.md) for more architecture and API docs.

---

If you want, I can also add a short `DEV_SETUP.md` with copyable commands for Linux-specific steps (Docker SQL Server commands, example `.env`), or open a PR that updates the `appsettings.Development.json` to use environment variables. Which would you prefer? 

