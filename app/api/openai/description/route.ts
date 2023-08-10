import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

interface Payload {
  title: string
  ingredients: string[]
  mealType: string
}
const openai = new OpenAIApi(configuration)

const systemPrompt =
  'You are a talented chef who can come up with exquisite recipes, no matter the ingredients. The user will send you a list of ingredients they have available in their pantry/fridge, along with the type of this meal (breakfast, lunch, dinner or any), and the title of the recipe. Your goal is to think of a recipe they can cook at home using ONLY the given ingredients, suitable for the specified time of day, matching the title provided. Your response should be just a brief description (1-2 lines) of this recipe, similar to a description of a recipe found in a cookbook.'

export const POST = async (req: NextRequest) => {
  const { title, ingredients, mealType }: Payload = await req.json()

  if (!ingredients || !ingredients.length) {
    return NextResponse.json('No ingredients provided', { status: 400 })
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Title: ${title}. Ingredients: ${ingredients}. Meal Type: ${mealType}`,
      },
    ],
  })

  const data = (await res.json()) as ResponseTypes['createChatCompletion']

  console.log('CALLED TITLE GPT')

  const textResponse =
    data.choices[0].message?.content?.trim() || 'Problem fetching OpenAI data.'

  return NextResponse.json(textResponse)
}
