# Convert Session Store from Prisma to Redis

Replace the broken `@quixo3/prisma-session-store` with `connect-redis`. The Passport + express-session flow stays identical — we only swap the backing store to Redis.

## Proposed Changes

### Backend

#### [MODIFY] [server.ts](file:///e:/Projects/Personal/videoChat/backend/src/server.ts)

- **Remove**: `PrismaSessionStore` import and usage
- **Add**: `connect-redis` + `ioredis` client as the session store
- **Keep**: Everything else (session config, passport.session(), cookie config)

#### [MODIFY] [passport.ts](file:///e:/Projects/Personal/videoChat/backend/src/auth/config/passport.ts)

- Remove debug `console.log` statements

#### [MODIFY] [checkEnv.ts](file:///e:/Projects/Personal/videoChat/backend/src/auth/config/checkEnv.ts)

- Add `REDIS_URL` to required env vars and export it

#### [NEW] [redis.ts](file:///e:/Projects/Personal/videoChat/backend/src/config/redis.ts)

- Redis client setup using `ioredis`, exported for reuse

### Frontend (Restore Debug Changes)

#### [MODIFY] [ProtectedRoute.tsx](file:///e:/Projects/Personal/videoChat/frontend/src/components/ProtectedRoute.tsx)

- Restore loading spinner, remove debug console.logs

#### [MODIFY] [AuthContext.tsx](file:///e:/Projects/Personal/videoChat/frontend/src/context/AuthContext.tsx)

- Uncomment the `useEffect` that calls `refreshUser()` on mount

### Infrastructure

- Install `connect-redis` and `ioredis` packages
- Redis server must be running (Docker or local) on `localhost:6379`

## Verification Plan

1. Start Redis → Start backend → Start frontend
2. Login with Google → Should redirect to dashboard with user info
3. Refresh page → Should stay logged in (session persists in Redis)
4. Logout → Should redirect to login, protected routes blocked
