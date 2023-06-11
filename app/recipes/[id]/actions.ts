interface RecipeRecord {
  id: string
  content: string
  ready: boolean
  ingredients: string
}

async function getRecipe(recipeId: string) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`
  )
  const recipe: RecipeRecord = await res.json()
  if (!recipe.ready) {
    const gptResponse = await getGPTResponse(recipe.ingredients)
    const recipeContent: string = await gptResponse.json()
    const generatedRecipe = await updateRecipeRecord(recipeId, recipeContent)
    return generatedRecipe
  }
  return recipe
}

async function getGPTResponse(recipeIngredients: string) {
  const res = await fetch("http://localhost:3000/api/openai", {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ promptIngredients: recipeIngredients }),
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }
  return res
}

async function updateRecipeRecord(recipeId: string, recipeContent: string) {
  const dbUpdateRes = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: recipeContent,
        ready: true,
      }),
    }
  )

  if (!dbUpdateRes.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  const updatedRecipe: RecipeRecord = await dbUpdateRes.json()
  return updatedRecipe
}

export { getRecipe }
