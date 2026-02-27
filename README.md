# SecureBlog — Rival Assessment Submission

A production-ready blog platform built with **NestJS + Prisma + PostgreSQL** (backend) and **Next.js 15 App Router + TypeScript** (frontend).

---

## 🚀 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | https://rival-secure-script-hg.vercel.app/ |
| Backend  | https://rival-securescript-hg.onrender.com/api |
| Database | PostgreSQL (Neon) |

---

## 🏗 Architecture Overview

```
rival_SecureScript_HG/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── auth/          # JWT auth, guards, strategies, decorators
│   │   ├── blog/          # CRUD + BullMQ async summary job
│   │   ├── comment/       # Comments system
│   │   ├── like/          # Like/unlike with duplicate prevention
│   │   ├── public/        # Public feed + blog-by-slug (no auth)
│   │   └── prisma/        # Global PrismaService
│   └── prisma/
│       └── schema.prisma  # User, Blog, Like, Comment + indexes
└── frontend/              # Next.js 15 (App Router)
    └── src/
        ├── app/           # Pages (feed, blog/[slug], dashboard, login, register)
        ├── components/    # BlogCard, LikeButton, CommentItem, CommentSection, BlogEditor, Navbar
        ├── contexts/      # AuthContext (JWT stored in localStorage)
        └── lib/           # api-client.ts + auth-api.ts + blog-api.ts
```

---

## ✅ Features Implemented

### Authentication
- ✅ Register / Login with bcrypt password hashing (salt rounds: 12)
- ✅ JWT access tokens (7d) + refresh tokens (30d) with auto-refresh on 401
- ✅ `JwtAuthGuard` + `@Public()` decorator for route-level protection
- ✅ `@GetUser()` decorator for clean controller DI
- ✅ Proper 401/403 error responses (no sensitive data leakage)

### Blog Management (Private Dashboard)
- ✅ `POST /api/blogs` — Create blog
- ✅ `GET /api/blogs` — List own blogs
- ✅ `PATCH /api/blogs/:id` — Edit blog (owner only)
- ✅ `DELETE /api/blogs/:id` — Delete blog (owner only)
- ✅ Auto-generated unique slugs via slugify
- ✅ Publish/unpublish toggle
- ✅ Validation with class-validator DTOs

### Public Access
- ✅ `GET /api/public/feed` — Paginated published blogs with author info, like/comment counts
- ✅ `GET /api/public/blogs/:slug` — Single blog by slug (404 if unpublished)
- ✅ Optimized Prisma queries (no N+1 — uses `_count` aggregations)

### Like System
- ✅ `POST /api/blogs/:id/like` — Like a post (auth required)
- ✅ `DELETE /api/blogs/:id/like` — Unlike a post
- ✅ `GET /api/blogs/:id/like/status` — Check like status
- ✅ DB-level unique constraint `(userId, blogId)` prevents duplicates
- ✅ Optimistic UI updates on frontend

### Comment System
- ✅ `POST /api/blogs/:id/comments` — Create comment (auth required)
- ✅ `GET /api/blogs/:id/comments` — List comments (public, paginated)
- ✅ Sorted by newest first; indexed on `blogId` and `createdAt`

### Advanced (Bonus)
- ✅ **Async Job Processing** — BullMQ queue (`blog` queue) auto-generates blog summary on publish without blocking HTTP response
- ✅ **Rate Limiting** — `@nestjs/throttler`: Auth (5-10 req/min), Feed/Detail (60 req/min), global 100 req/min
- ✅ **Structured Logging** — `nestjs-pino` + `pino-pretty` in dev, JSON in production

---

## 🔐 Security Practices

| Practice | Implementation |
|----------|---------------|
| Password hashing | bcrypt, 12 salt rounds |
| JWT validation | passport-jwt strategy, verifies on every request |
| Input validation | class-validator + class-transformer, whitelist: true |
| Ownership guards | Service-level userId check before any mutation |
| Duplicate likes | PostgreSQL unique constraint + P2002 Prisma error handling |
| Sensitive data | `passwordHash` never returned in any response |
| CORS | Configurable `FRONTEND_URL` env var |
| Rate limiting | Per-route throttler with 429 responses |

---

## 🖥 Frontend Architecture

- **App Router** (Next.js 15) with nested layouts for protected dashboard routes
- **`AuthContext`** — global auth state, token persistence, auto-refresh via axios interceptor
- **API abstraction layer** — `lib/api-client.ts`, `lib/auth-api.ts`, `lib/blog-api.ts`
- **Reusable components** — `BlogCard`, `LikeButton` (optimistic), `CommentItem`, `CommentSection`, `BlogEditor`, `Navbar`
- **Loading/empty states** — `PageLoader`, skeleton loaders in CommentSection
- **Optimistic UI** — `LikeButton` updates count immediately, reverts on error

---

## 📦 Setup Instructions

### Prerequisites
- Node.js 20+
- Docker + Docker Compose (for Postgres & Redis locally)

### 1. Start infrastructure

```bash
docker-compose up -d
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env          # edit DATABASE_URL / JWT_SECRET as needed
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev
```

Backend runs at `http://localhost:3001/api`

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🧪 Automated Testing & Quality Checks

### Backend

```bash
cd backend
npm run test
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run type-check
npm run build
```

### Production Smoke Test (manual)

- Register + login
- Create/edit/delete blog from dashboard
- Verify unpublished blog returns 404 via `/public/blogs/:slug`
- Verify `/public/feed` pagination and newest-first order
- Like/unlike (duplicate like blocked)
- Add/list comments without page reload

---

## 🔌 API Reference

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/auth/refresh` | No | Refresh tokens |

### Blogs (private)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/blogs` | Yes | Create blog |
| GET | `/api/blogs` | Yes | Own blogs |
| PATCH | `/api/blogs/:id` | Yes | Update blog |
| DELETE | `/api/blogs/:id` | Yes | Delete blog |

### Public
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/public/feed?page=1&limit=10` | No | Paginated feed |
| GET | `/api/public/blogs/:slug` | No | Blog by slug |

### Likes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/blogs/:id/like` | Yes | Like |
| DELETE | `/api/blogs/:id/like` | Yes | Unlike |
| GET | `/api/blogs/:id/like/status` | Yes | Like status |

### Comments
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/blogs/:id/comments` | Yes | Create comment |
| GET | `/api/blogs/:id/comments` | No | List comments |

---

## ⚖️ Tradeoffs

1. **Summary auto-generation** — Uses the first 200 characters rather than an LLM, keeping the job side-effect-free without external API keys.
2. **Token storage in `localStorage`** — Simpler to implement vs httpOnly cookies; in production the refresh cookie flow should move to httpOnly.
3. **No React Query / SWR** — Used SWR for cache-invalidation capability; most data is fetched with useEffect to avoid adding complexity.
4. **No RBAC UI** — Role model is in DB schema but admin UI was not required by spec.

---

## 📈 What I'd Improve

- Rate limit storage via Redis (distributed, vs current in-memory)
- Move refresh token to httpOnly cookie + CSRF protection
- OpenAPI/Swagger documentation via `@nestjs/swagger`
- E2E tests with Jest + Supertest
- Real AI summary via OpenAI API in the BullMQ job
- CDN-based image uploads for blog covers
- Real-time comments via WebSockets

---

## 🚀 Scaling to 1M Users

| Concern | Solution |
|---------|---------|
| Database | Read replicas for feed queries; connection pooling (PgBouncer / Neon) |
| Caching | Redis cache for `/public/feed` (TTL 30s), blog pages |
| Queue | BullMQ + Redis cluster for fan-out jobs |
| API | Horizontal scaling behind a load balancer (stateless JWT) |
| CDN | Serve Next.js static assets via Vercel Edge / CloudFront |
| Search | Postgres full-text search → Elasticsearch for blog search at scale |
| Rate limiting | Distributed rate limiting via Redis + `@nestjs/throttler` Redis store |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend framework | NestJS 10 (TypeScript strict) |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT + Passport (access + refresh tokens) |
| Password hashing | bcrypt (12 rounds) |
| Async jobs | BullMQ + Redis |
| Rate limiting | @nestjs/throttler |
| Logging | nestjs-pino (Pino) |
| Frontend | Next.js 15 App Router |
| Styling | Tailwind CSS |
| HTTP client | Axios with interceptors |
| Notifications | react-hot-toast |

Secure Blog Platform (Public + Private + Social Feed)
