# Advanced MERN Authentication — 2FA & Security

A production-grade authentication service built on the MERN stack, implementing modern backend security standards from the ground up. Every security feature is purpose-built and tested — not a boilerplate copy-paste.

---

## Features

- **Two-Factor Authentication (2FA)** — OTP sent via email on every login, verified before access is granted
- **JWT Access + Refresh Tokens** — short-lived access tokens (15 min) with automatic silent refresh
- **Refresh Token Rotation** — every refresh invalidates the old token and issues a new one; stolen tokens become useless the moment the legitimate user makes a request
- **Redis Session Management** — refresh tokens stored in Redis with TTL; logging in from a new device invalidates all previous sessions
- **CSRF Protection** — double submit cookie pattern using `csrf-csrf`; every state-changing request requires a signed token that cross-origin scripts can never read
- **Bcrypt Password Hashing** — salted hashing with configurable rounds; plaintext passwords never touch the database
- **Role-Based Authorization** — `isRole()` middleware supports single and multi-role protection on any route
- **Secure HttpOnly Cookies** — access and refresh tokens stored in HttpOnly cookies; inaccessible to JavaScript entirely
- **Helmet.js Security Headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`, and more set automatically
- **IP/Email Rate Limiting** — Redis-backed rate limiting on register and login endpoints to prevent brute-force attacks
- **Input Validation** — Zod schema validation on all auth endpoints; malformed requests rejected before hitting the database
- **MongoDB Sanitization** — `mongo-sanitize` strips `$` operators from user input to prevent NoSQL injection
- **Email Verification** — new accounts are stored in Redis until the user clicks the verification link; unverified accounts never touch MongoDB
- **Protected Routes (Client)** — `PrivateRoute` component guards authenticated pages; unauthenticated users are redirected to login
- **Axios Interceptor** — automatic token refresh on 401; queued requests are retried after refresh succeeds

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Cache / Sessions | Redis (Upstash) |
| Auth | JWT (`jsonwebtoken`), Bcrypt |
| Security | `csrf-csrf`, Helmet.js, `mongo-sanitize` |
| Validation | Zod |
| Email | Nodemailer (SMTP) |
| Dev | Vite, Nodemon |

---

## Project Structure

```
Mern Authentication 2FA/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── apiInterceptor.js    # Axios instance + CSRF + refresh interceptor
│   │   ├── components/
│   │   │   └── PrivateRoute.jsx     # Auth guard for protected pages
│   │   ├── context/
│   │   │   └── AppContext.jsx       # Global auth state + CSRF token fetch
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── VerifyOtp.jsx        # 2FA OTP entry
│   │       ├── Verify.jsx           # Email verification link handler
│   │       └── Dashboard.jsx        # Protected page with logout
│   └── .env                         # VITE_API_URL
│
└── server/                          # Express backend
    ├── config/
    │   ├── csrf.js                  # doubleCsrf setup
    │   ├── generateToken.js         # Access + refresh token generation & rotation
    │   ├── mongodb.js               # Mongoose connection
    │   ├── nodemailer.js            # SMTP transport
    │   ├── redis.js                 # Redis client (Upstash)
    │   └── zod.js                   # Validation schemas
    ├── controllers/
    │   └── userAuth.controllers.js  # All auth handlers
    ├── middleware/
    │   ├── isAuth.js                # JWT verification + Redis cache
    │   ├── isRole.js                # Role-based access control
    │   └── tryCatch.js              # Async error wrapper
    ├── models/
    │   └── users.models.js          # User schema (name, email, password, role)
    ├── routes/
    │   └── userAuth.routes.js       # All auth routes
    └── .env                         # Secrets (never committed)
```

---

## Authentication Flow

### Registration
```
POST /register
  → Zod validates input
  → Email rate limit checked (Redis)
  → Bcrypt hashes password
  → User data + verification token stored in Redis (5 min TTL)
  → Verification email sent with link to /verify/:token
  → User clicks link → POST /verify/:token
  → Redis data pulled → User created in MongoDB
  → Redis entry deleted
```

### Login + 2FA
```
POST /login
  → IP rate limit checked (Redis)
  → User fetched from MongoDB
  → Bcrypt compares password
  → 6-digit OTP generated → stored in Redis (5 min TTL)
  → OTP sent to user's email
  → POST /verify (OTP submission)
  → OTP compared → Redis entry deleted
  → Access token (15 min) + Refresh token (7 days) set as HttpOnly cookies
  → Refresh token stored in Redis
```

### Silent Token Refresh (Rotation)
```
Request made → isAuth reads accessToken cookie → JWT expired → 401
  → Axios interceptor catches 401
  → POST /refresh
  → verifyRefreshToken: JWT verified + Redis token matched
  → OLD refresh token deleted from Redis
  → NEW access token issued (cookie updated)
  → NEW refresh token issued (cookie + Redis updated)
  → Original request retried automatically
```

### CSRF Protection Flow
```
App loads → GET /csrfToken
  → Server generates token → sets signed HttpOnly cookie
  → Token value returned in response body
  → Client stores token in memory (Axios interceptor variable)
  → Every POST/PUT/DELETE → x-csrf-token header attached automatically
  → Server validates header against cookie using HMAC
  → Mismatch or missing → 403 rejected
```

---

## API Endpoints

| Method | Endpoint | Auth | CSRF | Description |
|---|---|---|---|---|
| POST | `/api/v1/register` | — | ✅ | Register new user |
| POST | `/api/v1/verify/:token` | — | ✅ | Verify email |
| POST | `/api/v1/login` | — | ✅ | Login (triggers OTP) |
| POST | `/api/v1/verify` | — | ✅ | Verify OTP + issue tokens |
| POST | `/api/v1/refresh` | — | — | Rotate refresh token |
| GET | `/api/v1/csrfToken` | — | — | Fetch CSRF token |
| GET | `/api/v1/myProfile` | ✅ | — | Get authenticated user |
| GET | `/api/v1/logout` | ✅ | — | Revoke tokens + clear cookies |
| GET | `/api/v1/admin` | ✅ Admin | ✅ | Admin-only route (example) |
| GET | `/api/v1/editor` | ✅ Admin/Editor | ✅ | Multi-role route (example) |

---

## Environment Variables

### `server/.env`

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
REDIS_URL=your_redis_url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
CSRF_SECRET=generate_with_node_crypto_randomBytes_32
NODE_ENV=development
```

### `client/.env`

```env
VITE_API_URL=http://localhost:4000
```

Generate a secure `CSRF_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Gmail account with App Password enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mern-auth-2fa.git
cd mern-auth-2fa

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the project

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## Security Design Decisions

**Why HttpOnly cookies instead of localStorage?**
localStorage is accessible by any JavaScript on the page. A single XSS vulnerability exposes every token stored there. HttpOnly cookies are completely invisible to JavaScript — the browser handles them automatically and they can never be read or stolen via script injection.

**Why short-lived access tokens with refresh rotation?**
A 15-minute access token limits the damage window if it's ever intercepted. Refresh token rotation means every token is single-use — if an attacker steals a refresh token and uses it, the legitimate user's next request will fail (their token was just rotated away), alerting them that something is wrong. Without rotation, a stolen refresh token grants access for the full 7 days silently.

**Why Redis for session management?**
JWTs are stateless by design — once issued, they're valid until expiry. Redis gives us a stateful layer on top: storing refresh tokens lets us invalidate them instantly on logout, password change, or suspicious activity. Logging in from a new device overwrites the Redis entry, automatically logging out the previous session.

**Why CSRF protection if we use HttpOnly cookies?**
HttpOnly prevents JavaScript from reading cookies, but the browser still sends them automatically on every request — including cross-origin ones triggered by a malicious site. CSRF protection ensures that even if the cookies are sent, the request is rejected without the signed token that only our frontend can obtain.

---

## License

MIT
