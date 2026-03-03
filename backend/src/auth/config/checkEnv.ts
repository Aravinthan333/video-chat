import dotenv from 'dotenv'

dotenv.config({ path: '.env.dev' })

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL'
]

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL!,
  sessionSecret: process.env.JWT_SECRET!,
  google: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!
  },
  clientUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5173'
} as const
