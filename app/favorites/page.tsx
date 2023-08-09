import { notFound } from 'next/navigation'

import { getUserFavoriteRecipes } from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

import FavoriteItem from './FavoriteItem'

export default async function FavoritesPage() {
  const { userId, getToken } = auth()

  if (!userId) {
    notFound()
  }

  const token = await getToken({ template: 'supabase' })

  if (!token) {
    notFound()
  }

  const recipes = await getUserFavoriteRecipes({ userId: userId, token: token })
  return (
    <>
      <h1 className="my-6 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl">
        Favorites
      </h1>
      <p className="m-auto mb-6 w-72 text-center leading-7 text-stone-600 dark:text-stone-400 md:w-full [&:not(:first-child)]:mt-6">
        Favorite recipes will be publicly displayed on your profile.
      </p>
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recipes?.map((r) => (
          <FavoriteItem recipe={r} />
        ))}
      </div>
    </>
  )
}
