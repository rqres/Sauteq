import { notFound } from 'next/navigation'

import { getBookmark, getRecipe, getRecipes } from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

import RecipeSheet from '@/components/RecipeSheet'

export async function generateStaticParams() {
  const recipes = await getRecipes()

  return recipes.map((recipe) => ({
    slug: recipe.title.replace(/\s+/g, '-').toLowerCase(),
  }))
}

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

  return (
    <div className="flex justify-center ">
      <RecipeSheet
        noReturnButton
        noRegen
        title={recipe?.title || ''}
        body={recipe?.body || null}
        image={recipe?.image_url || ''}
        recipeId={params.id}
        initialBookmark={bookmark}
        mealType={recipe?.meal_type}
      />
    </div>
  )
}
