import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getUserRecipes } from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

export default async function HistoryPage() {
  const { userId, getToken } = auth()

  if (!userId) {
    //TODO:
    notFound()
  }

  const token = await getToken({ template: 'supabase' })

  if (!token) {
    notFound()
  }

  const recipes = await getUserRecipes({ userId: userId, token: token })

  return (
    <div>
      <h1 className="mb-6 mt-3 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl">
        History
      </h1>
      {recipes && recipes.length > 0 ? (
        <ul className="mx-4 mb-6 space-y-2">
          {recipes
            .sort((a, b) => b.id - a.id)
            .map((r) => (
              <li key={r.id}>
                <Link href={`/r/${r.id}`}>
                  <div
                    className={`flex justify-between rounded-lg border px-4 py-2 transition-colors hover:bg-stone-100 ${
                      r.bookmark && 'border-pink-300'
                    }`}
                  >
                    <p>{r.title}</p>
                    <p>{r.created_at}</p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      ) : (
        <>
          <p>No recipes yet!</p>
          <p>
            Generate some at <Link href={'/eat'}></Link>
          </p>
        </>
      )}
    </div>
  )
}
