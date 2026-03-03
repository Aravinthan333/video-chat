import { createClient } from 'redis'

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  // password: process.env.REDIS_PASSWORD, // uncomment if using auth
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 3) {
        console.error('Redis: max retries reached, giving up')
        return new Error('Max retries reached')
      }
      return Math.min(retries * 200, 2000) // retry with backoff
    }
  }
})

redisClient.on('connect', () => console.log('✅ Redis connected'))
redisClient.on('error', (err: Error) => console.error('❌ Redis error:', err.message))

redisClient.connect().catch(console.error)

export default redisClient
