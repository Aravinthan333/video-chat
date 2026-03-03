import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
// import { prisma } from './config/prismaClient.js'
import authRoutes from './auth/router/auth.ts'
import userRoutes from './auth/router/user.ts'
import helmet from 'helmet'
import passport from './auth/config/passport.ts'
import { errorHandler } from './auth/middleware/error.ts'
import { env } from './auth/config/checkEnv.ts'

import session from 'express-session'
import redisClient from './config/redis.ts'
import { RedisStore } from 'connect-redis'

dotenv.config({ path: './.env.dev' })
const app = express()

// Extend Express session to include our user
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: string // user.id stored in session
    }
  }
}

app.use(helmet())

app.use(express.json())
// app.use(cors())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  session({
    secret: env.sessionSecret,
    resave: false, // Don't save session if nothing changed
    saveUninitialized: false, // Don't create session until user logs in
    rolling: true, // Reset expiry on every request (sliding expiry)
    store: new RedisStore({
      client: redisClient,
      prefix: 'sess',
      ttl: 7 * 24 * 60 * 60
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // JS cannot access cookie (XSS protection)
      secure: env.nodeEnv === 'production', // HTTPS only in production
      sameSite: env.nodeEnv === 'production' ? 'none' : 'lax' // CSRF protection
    }
  })
)

app.use(passport.initialize())
app.use(passport.session()) // Enables persistent login sessions

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening!')
})
