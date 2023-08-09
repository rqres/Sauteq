import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getUserRecipes } from '@/utils/supabaseRequests'
import { auth } from '@clerk/nextjs'

export default async function HistoryPage() {
  const { userId, getToken } = auth()

  if (!userId) {
    notFound()
  }

  const token = await getToken({ template: 'supabase' })

  if (!token) {
    notFound()
  }

  const recipes = await getUserRecipes({ userId: userId, token: token })

  return (
    <>
      <h1 className="my-6 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl">
        History
      </h1>
      {recipes && recipes.length > 0 ? (
        <ul className="mx-4 mb-6 space-y-2">
          {recipes
            .sort((a, b) => b.id - a.id)
            .map((r) => (
              <li key={r.id}>
                <Link href={`recipe/${r.id}/${r?.title
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}>
                  <div className="flex justify-between rounded-lg border px-4 py-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-600/90">
                    <p>{r.title}</p>
                    <p>{new Date(r.created_at as string).toDateString()}</p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      ) : (
        <>
          <p>No recipes yet!</p>
          <p>
            Generate some <Link href={'/eat'}>here</Link>!
          </p>
        </>
      )}
    </>
  )
}
