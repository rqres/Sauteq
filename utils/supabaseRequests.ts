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

export async function getUserRecipes({
  userId,
  token,
}: {
  userId: string
  token?: string
}) {
  const supabase = supabaseClient(token)

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    return
  }

  return data
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
  image_url?: string
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

  const rec = await getRecipe({ recipeId })
  if (rec?.user_id !== userId && rec?.user_id !== 'server') {
    throw new Error('Recipe belongs to someone else')
  }

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
  userId,
  token,
  toggle,
}: {
  recipeId: number
  userId: string
  token: string
  toggle: boolean
}) {
  const supabase = supabaseClient(token)

  if (toggle) {
    const { error } = await supabase.from('bookmarks').insert([
      {
        user_id: userId,
        recipe_id: recipeId,
      },
    ])
    if (error) {
      console.error(error)
    }
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId)
    if (error) {
      console.error(error)
    }
  }
}

export async function getBookmark({
  recipeId,
  userId,
  token,
}: {
  recipeId: number
  userId: string
  token: string
}) {
  const supabase = supabaseClient(token)
  let { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    return
  }

  if (!data) return false

  return data.length > 0 ? true : false
}

export async function saveImageToStorage({
  recipeId,
  imageUrl,
}: {
  recipeId: number
  imageUrl: string
}) {
  // convert DALL-E image to blob
  const blob = await fetch(imageUrl).then((r) => r.blob())

  const supabase = supabaseClient()

  // save blob to supabase storage
  const { error: storageError } = await supabase.storage
    .from('recipe-images')
    .upload(recipeId + '.png', blob)

  if (storageError) {
    console.error(storageError)
    return
  }
}

export async function updateRecipeImage({
  recipeId,
  token,
}: {
  recipeId: number
  token?: string
}) {
  const supabase = supabaseClient(token)
  // link public url to recipe record
  const { data: publicUrlData } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(recipeId + '.png')

  const { error } = await supabase
    .from('recipes')
    .update({ image_url: publicUrlData.publicUrl })
    .eq('id', recipeId)

  if (error) {
    console.error(error)
  }
}
