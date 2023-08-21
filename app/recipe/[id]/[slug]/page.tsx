import { notFound } from 'next/navigation'

import {
  getBookmark,
  getBookmarkCount,
  getRecipe,
} from '@/utils/supabaseRequests'
import { auth, clerkClient } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/dist/types/server'

import RecipeSheet from '@/components/RecipeSheet'

export default async function RPage({ params }: { params: { id: number } }) {
  const recipe = await getRecipe({ recipeId: params.id })
  if (!recipe) {
    notFound()
  }

  let bookmark = false
  const { userId, getToken } = auth()
  if (userId) {
    const token = await getToken({ template: 'supabase' })
    if (token) {
      bookmark = (await getBookmark({
        recipeId: params.id,
        userId: userId,
        token: token,
      }))
        ? true
        : false
    }
  }

  const bookmarkCount = await getBookmarkCount({ recipeId: params.id })

  let creator: User | undefined = undefined
  try {
    creator =
      recipe.user_id === 'server'
        ? undefined
        : await clerkClient.users.getUser(recipe.user_id)
  } catch (error) {
    creator = undefined
  }

  const creatorUsername = creator ? creator.username! : undefined
  const creatorAvatar = creator ? creator.imageUrl : undefined
  return (
    <div className="flex justify-center">
      <RecipeSheet
        noReturnButton
        noRegen
        title={recipe.title}
        body={recipe.body}
        image={recipe.image_url || ''}
        recipeId={params.id}
        initialBookmark={bookmark}
        mealType={recipe.meal_type}
        bookmarkCount={bookmarkCount}
        description={recipe.description || recipe.body.description || ''}
        creatorUsername={creatorUsername}
        creatorAvatar={creatorAvatar}
      />
    </div>
  )
}
