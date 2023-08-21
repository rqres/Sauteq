import { Redis } from '@upstash/redis'

const redis =
  !!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL &&
  !!process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
        token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
      })
    : undefined

export default redis
