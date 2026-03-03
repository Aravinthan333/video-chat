# Convert Session-Based Auth to JWT Auth

Replace the broken `@quixo3/prisma-session-store` session system with stateless JWT tokens stored in `httpOnly` cookies. The Google OAuth flow via Passport stays the same — only the "how we persist login state" changes.

## How It Works

```
User → Google OAuth → Passport verifies → Backend signs JWT → Sets httpOnly cookie → Frontend calls /auth/me → Backend verifies JWT → Returns user
```

No session table, no session store, no serialize/deserialize.

---

## Proposed Changes

### Backend Core

#### [MODIFY] [server.ts](file:///e:/Projects/Personal/videoChat/backend/src/server.ts)

- **Remove**: `express-session`, `PrismaSessionStore`, session middleware, `passport.session()`, session type declaration
- **Keep**: `cookie-parser` (needed for JWT cookies), `passport.initialize()`
- No session config at all — JWT is fully stateless

---

#### [MODIFY] [passport.ts](file:///e:/Projects/Personal/videoChat/backend/src/auth/config/passport.ts)

- **Remove**: `passport.serializeUser()` and `passport.deserializeUser()` (not needed for JWT)
- **Remove**: Debug console.logs
- **Keep**: Google OAuth strategy (it still handles the OAuth flow and user upsert)

---

#### [MODIFY] [auth.ts controller](file:///e:/Projects/Personal/videoChat/backend/src/auth/controller/auth.ts)

- **[googleCallback](file:///e:/Projects/Personal/videoChat/backend/src/auth/controller/auth.ts#4-9)**: After passport authenticates, sign a JWT with the user's ID and set it as an `httpOnly` cookie, then redirect to frontend
- **[getMe](file:///e:/Projects/Personal/videoChat/backend/src/auth/controller/auth.ts#10-14)**: Read user from `req.user` (set by the new middleware)
- **[logout](file:///e:/Projects/Personal/videoChat/frontend/src/services/auth.service.ts#21-24)**: Simply clear the JWT cookie — no session to destroy

---

#### [MODIFY] [auth.ts middleware](file:///e:/Projects/Personal/videoChat/backend/src/auth/middleware/auth.ts)

- **Replace** `req.isAuthenticated()` with JWT verification
- Verify the JWT from `req.cookies.token`, look up the user from DB, and attach to `req.user`
- Remove debug console.logs

---

#### [MODIFY] [auth.ts router](file:///e:/Projects/Personal/videoChat/backend/src/auth/router/auth.ts)

- Set `session: false` in passport.authenticate for the Google callback
- Add [requireAuth](file:///e:/Projects/Personal/videoChat/backend/src/auth/middleware/auth.ts#3-14) middleware to `/me` and `/logout` (already present)

---

#### [MODIFY] [checkEnv.ts](file:///e:/Projects/Personal/videoChat/backend/src/auth/config/checkEnv.ts)

- Rename `sessionSecret` → `jwtSecret` for clarity (env var `JWT_SECRET` already exists)

---

### Frontend (Restore Debug Changes)

#### [MODIFY] [ProtectedRoute.tsx](file:///e:/Projects/Personal/videoChat/frontend/src/components/ProtectedRoute.tsx)

- Restore the loading spinner (uncomment the `loading` check)
- Remove all debug `console.log` statements

---

#### [MODIFY] [AuthContext.tsx](file:///e:/Projects/Personal/videoChat/frontend/src/context/AuthContext.tsx)

- Uncomment the `useEffect` that calls `refreshUser()` on mount — this is essential for JWT auth to work (the frontend needs to call `/auth/me` on page load to check if the JWT cookie is valid)

---

## Verification Plan

### Manual Browser Test

1. Start the backend: `npm run dev` in `e:\Projects\Personal\videoChat\backend`
2. Start the frontend: `npm run dev` in `e:\Projects\Personal\videoChat\frontend`
3. Open `http://localhost:5173/login` in the browser
4. Click **Login with Google** → should redirect to Google consent screen
5. After consenting → should redirect back to `http://localhost:5173/dashboard` with user info displayed
6. Refresh the page → should **stay on dashboard** (JWT cookie persists)
7. Click **Logout** → should redirect to `/login`
8. Try navigating directly to `/dashboard` → should redirect to `/login` (protected route works)
