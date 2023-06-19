import { DBRecipeRecord } from '@/types/recipe'

import supabaseClient from './supabaseClient'

export async function getRecipe({
  recipeId,
  token,
}: {
  recipeId: number
  token?: string
}) {
  const supabase = await supabaseClient(/*token*/)

  let { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .limit(1)

  if (error) {
    throw error
  }

  // if (error) {
  //   console.error(error)
  //   return
  // }

  return recipe ? recipe[0] : null
}

export async function addRecipe({
  token,
  ingredients,
  title,
  recipeBody,
  image_url,
  user_id,
}: {
  token?: string
  ingredients: string
  title: string
  recipeBody: DBRecipeRecord['data']
  image_url?: string
  user_id?: string
}) {
  const supabase = await supabaseClient(/*token*/)

  const { data: recipe, error } = await supabase
    .from('recipes')
    .insert([
      {
        ingredients: ingredients,
        title: title,
        body: recipeBody,
        image_url: image_url,
        user_id: user_id,
      },
    ])
    .select()

  if (error) {
    throw error
  }

  // if (error) {
  //   console.error(error)
  //   return
  // }
  return recipe[0]
}
