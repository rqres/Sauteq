import { getRecipes } from '@/utils/supabaseRequests'

export default async function sitemap() {
  const allRecipes = await getRecipes()

  const recipes = allRecipes
    .sort((a, b) => a.id - b.id)
    .map((r) => {
      return {
        url: `https://sauteq.com/recipe/${r.id}/${r.title
          .replace(/\s+/g, '-')
          .toLowerCase()}`,
        lastModified: r.created_at,
      }
    })

  return [
    {
      url: 'https://sauteq.com',
      lastModified: new Date(),
    },
    ...recipes,
  ]
}
