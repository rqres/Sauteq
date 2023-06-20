'use server'

import { revalidatePath } from 'next/cache'

import { RecipeBody } from '@/types/recipe'

/**
 * Gets recipe body from GPT API
 *
 * @param ingredients The ingredients required for the recipe
 * @returns The recipe parsed as JSON
 */

export const flushCache = () => {
  revalidatePath('/eat')
}

const getRecipeBody = async (
  title: string,
  ingredients: string[]
): Promise<RecipeBody> => {
  console.warn('Connecting to GPT body')
  const res = await fetch('http://localhost:3000/api/openai/body', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      ingredients: ingredients,
    }),
    // cache: 'no-store',
    // next: { tags: ['bodies'] },
  })

  if (!res.ok) {
    throw new Error('Failed to connect to OpenAI/text ' + res.statusText)
  }

  const GPTText: string = await res.json()
  const parsedRecipe = sanitizeAndParseGPTText(GPTText)

  return parsedRecipe
}

const getRecipeTitle = async (recipeIngredients: string[]): Promise<string> => {
  console.warn('Connecting to GPT title...')
  const res = await fetch('http://localhost:3000/api/openai/title', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: recipeIngredients }),
    // cache: 'no-store',
    // next: { tags: ['titles'] },
  })

  if (!res.ok) {
    throw new Error(
      'Failed to connect to OpenAI/text/recipeTitle ' + res.statusText
    )
  }

  const GPTTitle: string = await res.json()

  return GPTTitle
}

const getRecipeImage = async (recipeTitle: string): Promise<string> => {
  console.warn('Connecting to GPT image')
  const res = await fetch('http://localhost:3000/api/openai/image', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: recipeTitle }),
    // cache: 'no-store',
    // next: { tags: ['images'] },
  })

  if (!res.ok) {
    throw new Error('Failed to connect to OpenAI/image ' + res.statusText)
  }

  const recipeImageURL: string = await res.json()

  return recipeImageURL
}
function sanitizeAndParseGPTText(recipeContent: string): RecipeBody {
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
    // console.log('Valid JSON object:', jsonObject)
    removeListNumbering(jsonObject.directions)
    return jsonObject
  } catch (error) {
    console.log('Invalid JSON object:', error)
    throw new Error('Error parsing GPT response')
  }
}

function removeListNumbering(recipeDirections: RecipeBody['directions']): void {
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

export { getRecipeBody, getRecipeImage, getRecipeTitle }
