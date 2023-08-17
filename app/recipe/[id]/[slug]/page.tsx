import { notFound } from 'next/navigation'

import {
  getBookmark,
  getBookmarkCount,
  getRecipe,
} from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

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
      />
    </div>
  )
}
