import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge'

export const runtime = 'edge'

interface Payload {
  title: string
  description: string
  ingredients: string[]
  mealType: string
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

const systemPrompt =
  'KEEP THIS REPONSE SHORT & CONCISE! You are a talented chef who can come up with exquisite recipes, no matter the ingredients. The user will send you a list of ingredients they have available, the title of their desired recipe, the description of the recipe, along with the type of the desired meal (breakfast, lunch, dinner or any). Your goal is to respond with a recipe they can cook at home, suitable for the desired meal type. Generate a recipe using ONLY the ingredients the user has available right now. Include cook time, prep time, and an outline of the ingredients required (quantities in imperial units) and the steps needed to prepare this meal. You do not HAVE to use all ingredients. If you feel the ingredients mentioned are too constraining, you may add a note stating optional ingredients that the user may incorporate in order to obtain a better result. These optional ingredients must NOT be crucial to the end recipe! Here is the template you should use for answering queries. Your response should be the string of a valid JSON object that can be easily converted with JSON.parse(). Variables (what you need to fill in) are marked by CAPITALS. Notice that "ingredients", "directions" and "optional" take an array of strings. Make sure that "serves" contains a NUMBER! Do not include step numbers before each step in the directions list. PLEASE DO NOT INCLUDE ANY TEXT OTHER THAN THE STRINGIFIED JSON OBJECT AS REQUESTED. Begin template: { "prep-time": "PREP TIME" ,"cook-time": "COOK TIME ","serves": NO-SERVINGS,"ingredients": ["INGREDIENTS...","INGREDIENTS..."],"directions": ["STEP 1...","STEP 2..."],"optional": ["OPTIONAL STEP/INGREDIENT 1...","OPTIONAL STEP/INGREDIENT 2..."]}'

export const POST = async (req: NextRequest) => {
  const { ingredients, title, description, mealType }: Payload =
    await req.json()

  if (!ingredients || !ingredients.length) {
    return NextResponse.json('No ingredients provided', { status: 400 })
  }

  const aiTextResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Title: ${title}. Description: ${description}. Ingredients: ${String(
          ingredients
        )}. Meal Type: ${mealType}`,
      },
    ],
    frequency_penalty: 0.5,
  })

  const data =
    (await aiTextResult.json()) as ResponseTypes['createChatCompletion']

  const textResponse =
    data.choices[0].message?.content?.trim() || 'Problem fetching OpenAI data.'

  console.log(`TOKENS USED FOR COMPLETION: ${data.usage?.completion_tokens}`)

  return NextResponse.json(textResponse)
}
