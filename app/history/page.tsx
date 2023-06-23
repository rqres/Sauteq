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
      <h1>History</h1>
      {recipes && recipes.length > 0 ? (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <div className="flex justify-between">
                <p>{r.title}</p>
                <p>{r.created_at}</p>
              </div>
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
