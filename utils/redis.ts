import { Redis } from '@upstash/redis';
import { Config } from 'sst/node/config'

const redis = new Redis({
  url: Config.UPSTASH_REDIS_REST_URL,
  token: Config.UPSTASH_REDIS_REST_TOKEN,
})

export default redis