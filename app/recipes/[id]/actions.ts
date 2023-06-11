interface RecipeRecord {
  id: string
  data: ParsedRecipe
  rawData: string
  ready: boolean
  ingredients: string
}
interface ParsedRecipe {
  "recipe-name": string
  description: string
  "prep-time": string
  "cook-time": string
  serves: number
  ingredients: string[]
  directions: string[]
  optional: string[]
}

async function getRecipe(recipeId: string) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`
  )
  const recipe: RecipeRecord = await res.json()
  if (!recipe.ready) {
    const res = await generateRecipe(recipe)
    return res
  }
  return recipe
}

function sanitizeAndParseGPTResponse(recipeContent: string) {
  const startIndex = recipeContent.indexOf("{")

  // Find the last occurrence of }
  const endIndex = recipeContent.lastIndexOf("}")

  // Check if { and } are found
  if (startIndex === -1 || endIndex === -1) {
    console.log(
      "Invalid JSON string. It should start and end with curly braces."
    )
    // Handle the invalid string as needed
    throw new Error("invalid response from gpt")
  } else {
    // Step 3: Extract the JSON object
    const sanitizedObject = recipeContent.substring(startIndex, endIndex + 1)

    try {
      // Step 4: Validate the JSON object
      const jsonObject: ParsedRecipe = JSON.parse(sanitizedObject)
      console.log("Valid JSON object:", jsonObject)
      // Use the parsed JSON object as needed
      return jsonObject
    } catch (error) {
      console.log("Invalid JSON object:", error)
      // Handle the invalid JSON object as needed
      throw new Error("error parsing GPT response")
    }
  }
}

async function generateRecipe(recipe: RecipeRecord) {
  const gptResponse = await getGPTResponse(recipe.ingredients)
  const recipeContent: string = await gptResponse.json()
  const parsedRecipeContent = sanitizeAndParseGPTResponse(recipeContent)
  const generatedRecipe = await updateRecipeRecord(
    recipe.id,
    recipeContent,
    parsedRecipeContent
  )
  return generatedRecipe
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

async function updateRecipeRecord(
  recipeId: string,
  rawRecipeContent: string,
  recipeContent: ParsedRecipe
) {
  const dbUpdateRes = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: recipeContent,
        rawData: rawRecipeContent,
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
