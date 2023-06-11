import { getRecipe } from "./actions"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  const recipe = await getRecipe(params.id)
  return (
    <div>
      <h1>recipes/{recipe.id}</h1>
      <p>{recipe.content}</p>
    </div>
  )
}
