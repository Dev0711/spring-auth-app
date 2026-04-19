# 🔐 Spring Boot Auth App — Google OAuth2 + OTP Email

A full-stack authentication system using **Spring Boot 3** (backend) and **React + Vite** (frontend).

## Features
- ✅ Google OAuth2 login via Spring Security
- ✅ 6-digit OTP email authentication via Gmail SMTP
- ✅ JWT token generation & validation (JJWT 0.12)
- ✅ PostgreSQL user storage via Spring Data JPA
- ✅ React frontend with protected routes

---

## 🗂 Project Structure
```
├── backend/          # Spring Boot 3.3 + Java 21
│   └── src/main/java/com/devoza/authapp/
│       ├── config/       # Security, JWT filter, OAuth2 handler
│       ├── controller/   # AuthController
│       ├── dto/          # Request/Response DTOs
│       ├── entity/       # User entity
│       ├── repository/   # UserRepository
│       ├── service/      # AuthService, EmailService, OtpService
│       └── util/         # JwtUtil
└── frontend/         # React 18 + Vite
    └── src/
        ├── context/      # AuthContext (token/user state)
        ├── pages/        # LoginPage, DashboardPage, OAuthCallback
        ├── services/     # Axios API client
        └── components/   # PrivateRoute
```

---

## ⚙️ Prerequisites
- Java 21+, Maven 3.9+
- Node.js 20+, npm
- PostgreSQL running on `localhost:5432`
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled
- Google Cloud Console project with OAuth2 credentials

---

## 🔑 Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g., `auth-app`)
3. Enable **Google+ API** or **People API**
4. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
7. Copy `Client ID` and `Client Secret` into `application.yml`

---

## 🚀 Running Locally

### Backend
```bash
cd backend
# Edit src/main/resources/application.yml with your credentials
mvn spring-boot:run
```
Runs at: http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at: http://localhost:5173

---

## 📡 REST API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/oauth2/authorization/google` | No | Initiates Google OAuth2 flow |
| GET | `/auth/google/login` | No | Info endpoint about Google login |
| POST | `/auth/send-otp` | No | Send 6-digit OTP to email |
| POST | `/auth/verify-otp` | No | Verify OTP → returns JWT |
| GET | `/auth/me` | Bearer JWT | Get current user profile |

---

## 🔐 Security Notes
- Never commit real credentials — use environment variables in production
- Replace in-memory OTP store with **Redis** for multi-instance deployments
- JWT secret must be at least 256-bit (32 chars) for HS256
- Gmail App Password ≠ Gmail account password

---

## 🛠 Tech Stack
| Layer | Technology |
|-------|----------|
| Backend | Spring Boot 3.3, Java 21 |
| Security | Spring Security 6, OAuth2 Client |
| Database | PostgreSQL + Spring Data JPA |
| JWT | JJWT 0.12.5 |
| Email | Spring Mail + Gmail SMTP |
| Frontend | React 18, Vite 5, React Router v6 |

---

## 📄 License
MIT
