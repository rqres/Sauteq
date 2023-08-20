import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi } from 'openai'
import { Config } from 'sst/node/config'

import { RecipeBody } from '@/types/recipe'

interface Payload {
  title: string
  ingredients: string[]
  mealType: string
}

const configuration = new Configuration({
  apiKey: Config.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

const systemPrompt =
  'You are a talented chef who can come up with exquisite recipes, no matter the ingredients. The user will send you a list of ingredients they have available, the title of their desired recipe, along with the type of the desired meal (breakfast, lunch, dinner or any). Your goal is to respond with a recipe they can cook at home, suitable for the desired meal type. Generate a recipe using ONLY the ingredients the user has available right now. Include cook time, prep time, and an outline of the ingredients required (quantities in imperial units) and the steps needed to prepare this meal. You do not HAVE to use all ingredients. If you feel the ingredients mentioned are too constraining, you may add a note stating optional ingredients that the user may incorporate in order to obtain a better result. Here is the template you should use for answering queries. Your response should be the string of a valid JSON object that can be easily converted with JSON.parse(). Variables (what you need to fill in) are marked by CAPITALS. Notice that "ingredients", "directions" and "optional" take an array of strings. Make sure that "serves" contains a NUMBER! Do not include step numbers before each step in the directions list. PLEASE DO NOT INCLUDE ANY TEXT OTHER THAN THE STRINGIFIED JSON OBJECT AS REQUESTED. Begin template: { "prep-time": "PREP TIME" ,"cook-time": "COOK TIME ","serves": NO-SERVINGS,"ingredients": ["INGREDIENTS...","INGREDIENTS..."],"directions": ["STEP 1...","STEP 2..."],"optional": ["OPTIONAL STEP/INGREDIENT 1...","OPTIONAL STEP/INGREDIENT 2..."]}'

export const POST = async (req: NextRequest) => {
  console.log('4. calling body...')
  const { ingredients, title, mealType }: Payload = await req.json()

  if (!ingredients || !ingredients.length) {
    return NextResponse.json('No ingredients provided', { status: 400 })
  }

  const aiTextResult = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Title: ${title}. Ingredients: ${String(
          ingredients
        )}. Meal Type: ${mealType}`,
      },
    ],
    frequency_penalty: 0.5,
  })

  const textResponse =
    aiTextResult.data.choices[0].message?.content?.trim() || ''

  const parsedRecipe = sanitizeAndParseGPTText(textResponse)

  if (
    parsedRecipe['prep-time'] === undefined ||
    parsedRecipe['cook-time'] === undefined ||
    parsedRecipe.serves === undefined ||
    parsedRecipe.ingredients === undefined ||
    parsedRecipe.directions === undefined
  ) {
    console.error('>> (4) Invalid response from OpenAI')
    return NextResponse.json('Invalid response from OpenAI', { status: 400 })
  }

  console.log('>> finished 4.')

  return NextResponse.json(parsedRecipe)
}

const sanitizeAndParseGPTText = (recipeContent: string): RecipeBody => {
  const startIndex = recipeContent.indexOf('{')

  // Find the last occurrence of }
  const endIndex = recipeContent.lastIndexOf('}')

  // Check if { and } are found
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      'Invalid text response from GPT, no JSON object detected (missing `{`, `}`)'
    )
  }
  // Extract the JSON object
  const sanitizedObject = recipeContent.substring(startIndex, endIndex + 1)

  try {
    // Validate the JSON object
    const jsonObject: RecipeBody = JSON.parse(sanitizedObject)
    removeListNumbering(jsonObject.directions)
    return jsonObject
  } catch (error) {
    console.log('Invalid JSON object:', error)
    throw new Error('Error parsing GPT response')
  }
}

const removeListNumbering = (
  recipeDirections: RecipeBody['directions']
): void => {
  const isDigit = (char: string) => {
    return !isNaN(parseInt(char)) && !isNaN(Number(char))
  }

  if (!isDigit(recipeDirections[0].charAt(0))) return

  console.log('>> List numbering detected in directions, cleaning up...')
  for (let i = 0; i < recipeDirections.length; i++) {
    const direction = recipeDirections[i]
    if (isDigit(direction.charAt(0))) recipeDirections[i] = direction.slice(3)
  }
}
