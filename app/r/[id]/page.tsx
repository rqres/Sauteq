import { notFound } from 'next/navigation'

import { getRecipe } from '@/utils/supabaseRequests'

import RecipeSheet from '@/components/RecipeSheet'

export default async function RPage({ params }: { params: { id: number } }) {
  const recipe = await getRecipe({ recipeId: params.id })

  if (!recipe) {
    notFound()
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
        initialBookmark={recipe?.bookmark || false}
      />
    </div>
  )
}
