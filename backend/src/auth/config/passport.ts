import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { prisma } from '../../config/prismaClient.js'
import { env } from './checkEnv.ts'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      scope: ['profile', 'email'],
      callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('profile', profile)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        const email = profile.emails?.[0]?.value
        const avatar = profile.photos?.[0]?.value || null

        if (!email) return done(new Error('No email returned from Google'), false)
        console.log('22222222222222222222222222222222222')
        console.log('===================================')
        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: {
            name: profile.displayName
          },
          create: {
            googleId: profile.id,
            email,
            name: profile.displayName,
            displayName: profile.displayName,
            avatar
          }
        })
        console.log('333333333333333333333333333333333')
        console.log('===================================')
        console.log('user: ', user)
        return done(null, user)
      } catch (error) {
        console.log(error)
        return done(error as Error, false)
      }
    }
  )
)

export interface UserProfile {
  id: string
  googleId: string
  email: string
  name: string
  displayName: string | null
  avatar: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

passport.serializeUser((user, done) => done(null, (user as UserProfile).id))

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log("Inside deserializer")
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    done(null, user ?? false)
  } catch (error) {
    console.log('EERROORR: ', error)
    done(error, false)
  }
})

export default passport
