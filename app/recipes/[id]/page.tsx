async function getRecipe(recipeId: string) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`
  )
  const recipe = await res.json()
  return recipe
}

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
