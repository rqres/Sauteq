import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import redis from '@/utils/redis'
import { auth } from '@clerk/nextjs'
import { Ratelimit } from '@upstash/ratelimit'
import { Configuration, OpenAIApi } from 'openai'
import { Config } from 'sst/node/config'

const configuration = new Configuration({
  apiKey: Config.OPENAI_KEY,
})

// Ratelimiter allows 5 requests per 24 hours for anonymous users
// and 40 requests per 24 hours for logged in users
// and 80 requests per 24 hours for admin users
const ratelimit = redis
  ? {
      anon: new Ratelimit({
        redis: redis,
        limiter: Ratelimit.fixedWindow(5, '1440 m'),
        prefix: 'ratelimit:anon',
        analytics: true,
      }),
      loggedIn: new Ratelimit({
        redis,
        analytics: true,
        prefix: 'ratelimit:loggedIn',
        limiter: Ratelimit.fixedWindow(40, '1440m'),
      }),
      admin: new Ratelimit({
        redis,
        analytics: true,
        prefix: 'ratelimit:admin',
        limiter: Ratelimit.fixedWindow(80, '1440m'),
      }),
    }
  : undefined

interface Payload {
  ingredients: string[]
  mealType: string
}
const openai = new OpenAIApi(configuration)

const systemPrompt =
  'You are a talented chef who can come up with exquisite recipes, no matter the ingredients. The user will send you a list of ingredients they have available in their pantry/fridge, along with the type of this meal (breakfast, lunch, dinner or any). Your goal is to think of a recipe they can cook at home using ONLY the given ingredients, suitable for the specified time of day. Your response should be just the title of this recipe.'

const admins = [
  'user_2U7aR7jpcFRryWp9V7YzlEQXBk9',
  'user_2U7kZDUcrxAnHFDV5m2wgdTnJjI',
  'user_2RLxIgPrTHpkuiOaR7B7lnv7tu5' /* rares - dev env */,
]

export const POST = async (req: NextRequest) => {
  console.log('1. calling title...')
  // https://github.com/Nutlope/roomGPT/blob/main/app/generate/route.ts
  if (ratelimit) {
    // TODO: check if logged in
    const { userId } = auth()
    if (!userId) {
      // for anon
      const headersList = headers()
      const ipIdentifier = headersList.get('x-real-ip')

      const result = await ratelimit.anon.limit(ipIdentifier ?? '')

      if (!result.success) {
        return NextResponse.json(
          'Too many requests in 1 day. Please try again in 24 hours.',
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': result.limit,
              'X-RateLimit-Remaining': result.remaining,
            } as any,
          }
        )
      }
    } else if (admins.includes(userId)) {
      // for admin users
      const result = await ratelimit.admin.limit(userId)
      if (!result.success) {
        return NextResponse.json(
          'Too many requests in 1 day. Please try again in 24 hours.',
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': result.limit,
              'X-RateLimit-Remaining': result.remaining,
            } as any,
          }
        )
      }
    } else {
      // for logged in
      const result = await ratelimit.loggedIn.limit(userId)
      if (!result.success) {
        return NextResponse.json(
          'Too many requests in 1 day. Please try again in 24 hours.',
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': result.limit,
              'X-RateLimit-Remaining': result.remaining,
            } as any,
          }
        )
      }
    }
  }

  // --------------------

  const { ingredients, mealType }: Payload = await req.json()

  if (!ingredients || !ingredients.length) {
    return NextResponse.json('No ingredients provided', { status: 400 })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: String(ingredients + '. Meal Type: ' + mealType),
      },
    ],
  })

  const textResponse =
    res.data.choices[0].message?.content?.trim() ||
    'Problem fetching OpenAI data.'

  console.log('>> finished 1.')

  const sanitizedTitle = sanitizeTitle(textResponse)

  return NextResponse.json(sanitizedTitle)
}

/**
 * Removes &, commas, fullstops, quotation marks and slashes
 * @param unsafeTitle
 * @returns sanitized title
 */
const sanitizeTitle = (unsafeTitle: string) =>
  unsafeTitle.replace(/[&,.\'\"\/\\]/g, '')
