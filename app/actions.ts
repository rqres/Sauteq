'use server'

import { revalidatePath } from 'next/cache'

import { toggleBookmark } from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

import { RecipeBody } from '@/types/recipe'

export const flushCache = () => {
  revalidatePath('/eat')
}

const getRecipeBody = async (
  title: string,
  ingredients: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
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
      mealType: mealType,
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to connect to OpenAI/text ' + res.statusText)
  }

  const GPTText: string = await res.json()
  const parsedRecipe = sanitizeAndParseGPTText(GPTText)

  return parsedRecipe
}

const getRecipeTitle = async (
  recipeIngredients: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
): Promise<string> => {
  console.warn('Connecting to GPT title...')
  const res = await fetch('http://localhost:3000/api/openai/title', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: recipeIngredients,
      mealType: mealType,
    }),
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

export const bookmarkRecipe = async (recipeId: number, isBookmark: boolean) => {
  const { userId, getToken } = auth()
  flushCache()
  if (!userId) {
    return -1 //no user
  }

  console.log('Bookmarking recipe: ' + recipeId)
  const token = await getToken({ template: 'supabase' })

  if (!token) {
    console.error('Unable to fetch token')
    return -1 //no token
  }

  toggleBookmark({
    recipeId: recipeId,
    userId: userId,
    token: token,
    toggle: !isBookmark,
  })
}

export { getRecipeBody, getRecipeImage, getRecipeTitle }
