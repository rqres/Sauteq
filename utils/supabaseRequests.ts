'use server'

import { revalidateTag } from 'next/cache'

import { auth } from '@clerk/nextjs'

import { RecipeBody } from '@/types/recipe'

import supabaseClient from './supabaseClient'

const RECIPE_MASTER = 'user_2U7kZDUcrxAnHFDV5m2wgdTnJjI'

export async function getAllRecipes() {
  const supabase = supabaseClient()

  const { data, error } = await supabase.from('recipes').select('*')

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function getPreviewRecipes({ limit }: { limit: number }) {
  const supabase = supabaseClient()

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('preview', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return []
  }

  return data
}

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
export async function getUserFavRecipeCount({ userId }: { userId: string }) {
  const supabase = supabaseClient()
  const { count, error } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    return 0
  }

  if (count === null) return 0

  return count
}

export async function getUserFavoriteRecipes({
  userId,
  token,
}: {
  userId: string
  token?: string
}) {
  const supabase = supabaseClient(token)

  let { data: favRecipes, error } = await supabase
    .from('bookmarks')
    .select('recipe_id')
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    return
  }

  let dataPromises: Promise<
    | {
        body: RecipeBody
        description: string
        created_at: string | null
        id: number
        image_url: string | null
        ingredients: string
        title: string
        user_id: string
      }
    | null
    | undefined
  >[] = []

  if (!favRecipes) return []

  for (let i = favRecipes.length - 1; i >= 0; i--) {
    const favRec = favRecipes[i]
    const rec = getRecipe({ recipeId: favRec.recipe_id })
    dataPromises.push(rec)
  }
  const data = Promise.all(dataPromises)

  return data
}

export async function addRecipe({
  token,
  ingredients,
  title,
  description,
  recipeBody,
  image_url,
  mealType,
}: {
  token?: string
  ingredients: string
  title: string
  description: string
  recipeBody: RecipeBody
  image_url?: string
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'any'
}) {
  const supabase = supabaseClient(token)

  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        ingredients: ingredients,
        description: description,
        title: title,
        body: recipeBody,
        image_url: image_url,
        meal_type: mealType,
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

async function toggleBookmark({
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
    return false
  }

  if (!data) return false

  return data.length > 0 ? true : false
}

export async function getBookmarkCount({ recipeId }: { recipeId: number }) {
  const supabase = supabaseClient()
  const { count, error } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId)

  if (error) {
    console.error(error)
    return 0
  }

  if (count === null) return 0

  return count
}

export async function addFollower({
  followerId,
  followeeId,
  token,
}: {
  followerId: string
  followeeId: string
  token: string
}) {
  const supabase = supabaseClient(token)
  const { error } = await supabase
    .from('followers')
    .insert({ follower_id: followerId, followee_id: followeeId })
  if (error) {
    console.error(error)
    return
  }
}

export async function removeFollower({
  followerId,
  followeeId,
  token,
}: {
  followerId: string
  followeeId: string
  token: string
}) {
  const supabase = supabaseClient(token)
  const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', followerId)
    .eq('followee_id', followeeId)

  if (error) {
    console.error(error)
    return
  }
}

export async function checkFollower({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) {
  const supabase = supabaseClient()
  let { data, error } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', followerId)
    .eq('followee_id', followeeId)

  if (error) {
    console.error(error)
    return false
  }

  if (!data) return false
  return data.length === 1
}

export async function getFollowerCount({ userId }: { userId: string }) {
  const supabase = supabaseClient()
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('followee_id', userId)

  if (error) {
    console.error(error)
    return 0
  }

  if (count === null) return 0

  return count
}

export async function getFollowingCount({ userId }: { userId: string }) {
  const supabase = supabaseClient()
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  if (error) {
    console.error(error)
    return 0
  }

  if (count === null) return 0

  return count
}

export async function getFollowerList({ userId }: { userId: string }) {
  const supabase = supabaseClient()

  const { data, error } = await supabase
    .from('followers')
    .select('follower_id')
    .eq('followee_id', userId)

  if (error) {
    console.error(error)
    return
  }

  return data
}

export async function getFollowingList({ userId }: { userId: string }) {
  const supabase = supabaseClient()

  const { data, error } = await supabase
    .from('followers')
    .select('followee_id')
    .eq('follower_id', userId)

  if (error) {
    console.error(error)
    return
  }

  return data
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

export const bookmarkRecipe = async (recipeId: number, isBookmark: boolean) => {
  const { userId, getToken } = auth()
  flushCache()
  if (!userId) {
    return -1 //no user
  }

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

  if (userId === RECIPE_MASTER) {
    togglePreview({ recipeId, token, toggle: !isBookmark })
  }
}

async function togglePreview({
  recipeId,
  token,
  toggle,
}: {
  recipeId: number
  token: string
  toggle: boolean
}) {
  const supabase = supabaseClient(token)

  if (toggle) {
    const { error } = await supabase
      .from('recipes')
      .update({ preview: true })
      .eq('id', recipeId)

    if (error) {
      console.error(error)
    }
  } else {
    const { error } = await supabase
      .from('recipes')
      .update({ preview: false })
      .eq('id', recipeId)

    if (error) {
      console.error(error)
    }
  }
}

export const flushCache = () => {
  revalidateTag('openai')
}
