import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

interface Payload {
  ingredients: string[]
}
const openai = new OpenAIApi(configuration)

const systemPrompt =
  'You are a talented chef who can come up with exquisite recipes, no matter the ingredients. The user will send you a list of ingredients they have available in their pantry/fridge, and your goal is to think of a recipe they can cook at home using ONLY the given ingredients. Your response should be just the title of this recipe.'

export const POST = async (req: NextRequest) => {
  const { ingredients }: Payload = await req.json()

  if (!ingredients || !ingredients.length) {
    return NextResponse.json('No ingredients provided', { status: 400 })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: String(ingredients) },
    ],
  })

  console.log('CALLED TITLE GPT')

  const textResponse =
    res.data.choices[0].message?.content.trim() ||
    'Problem fetching OpenAI data.'

  return NextResponse.json(textResponse)
}
