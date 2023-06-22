'use server'

import { RecipeBody } from '@/types/recipe'

import supabaseClient from './supabaseClient'

export async function getRecipe({
  recipeId,
  token,
}: {
  recipeId: number
  token?: string
}) {
  const supabase = supabaseClient(token)

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)

  if (error) {
    console.error(error)
    return
  }

  return data ? data[0] : null
}

export async function addRecipe({
  token,
  ingredients,
  title,
  recipeBody,
  image_url,
}: {
  token?: string
  ingredients: string
  title: string
  recipeBody: RecipeBody
  image_url: string
}) {
  const supabase = supabaseClient(token)

  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        ingredients: ingredients,
        title: title,
        body: recipeBody,
        image_url: image_url,
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return
  }

  return data[0]
}

export async function linkRecipeToUser({
  recipeId,
  userId,
  token,
}: {
  recipeId: number
  userId: string
  token: string
}) {
  const supabase = supabaseClient(token)
  const { data, error } = await supabase
    .from('recipes')
    .update({ user_id: userId })
    .eq('id', recipeId)
    .select()

  if (error) {
    console.error(error)
    return
  }

  return data[0]
}

export async function toggleBookmark({
  recipeId,
  token,
  toggle,
}: {
  recipeId: number
  token: string
  toggle: boolean
}) {
  const supabase = supabaseClient(token)
  const { data, error } = await supabase
    .from('recipes')
    .update({ bookmark: toggle })
    .eq('id', recipeId)
    .select()

  if (error) {
    console.error(error)
    return
  }

  return data[0]
}
