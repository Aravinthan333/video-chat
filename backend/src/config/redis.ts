import { createClient } from 'redis'

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'burl-overpowering-unconsentaneously.ngrok-free.dev'}:${process.env.REDIS_PORT || '6379'}`,
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

console.log('redisClient details: ===> ', redisClient)

redisClient.on('connect', () => console.log('Redis connected'))
redisClient.on('error', (err: Error) => console.error('Redis error:', err.message))

if (!redisClient.isOpen) {
  await redisClient.connect().catch(console.error)
}

export default redisClient
