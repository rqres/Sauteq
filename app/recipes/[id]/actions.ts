import { DBRecipeRecord } from "@/types/recipe"

async function getRecipeRecord(recipeId: string) {
  console.log(">> Fetching recipe record...")
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const message = "Error fetching recipe record from database"
    throw new Error(message)
  }

  const recipe: DBRecipeRecord = await res.json()

  return recipe
}

async function getRecipeText(
  recipeIngredients: string
): Promise<DBRecipeRecord["data"]> {
  console.warn("Connecting to GPT text")
  const res = await fetch("http://localhost:3000/api/openai/text", {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ promptIngredients: recipeIngredients }),
  })

  if (!res.ok) {
    throw new Error("Failed to connect to OpenAI/text " + res.statusText)
  }

  const GPTText: string = await res.json()
  const parsedRecipe = sanitizeAndParseGPTText(GPTText)

  return parsedRecipe
}

async function getRecipeImage(recipeTitle: string): Promise<string> {
  console.warn("Connecting to GPT image")
  const res = await fetch("http://localhost:3000/api/openai/image", {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: recipeTitle }),
  })

  if (!res.ok) {
    throw new Error("Failed to connect to OpenAI/image " + res.statusText)
  }

  const recipeImageURL: string = await res.json()

  return recipeImageURL
}

async function updateRecipeRecord(
  recipeId: string,
  fields: {
    rawRecipeContent?: string
    recipeText?: DBRecipeRecord["data"]
    recipeImageURL?: DBRecipeRecord["imageUrl"]
    title?: string
  }
): Promise<DBRecipeRecord> {
  console.log(">> Updating recipe...")
  const oldRecord = await getRecipeRecord(recipeId)
  const dbUpdateRes = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: fields.recipeText || oldRecord.data,
        rawData: fields.rawRecipeContent || oldRecord.rawData,
        imageUrl: fields.recipeImageURL || oldRecord.imageUrl,
        ready: true,
        title: fields.title || oldRecord.title,
      }),
    }
  )

  if (!dbUpdateRes.ok) {
    throw new Error("Failed to update Recipe Record" + dbUpdateRes.statusText)
  }

  const updatedRecord: DBRecipeRecord = await dbUpdateRes.json()
  return updatedRecord
}

async function clearRecipeRecord(recipeId: string): Promise<void> {
  console.log(">> Clearing recipe...")
  const dbClearRes = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {},
        imageUrl: "",
        title: "",
      }),
    }
  )

  if (!dbClearRes.ok) {
    throw new Error("Failed to clear Recipe Record" + dbClearRes.statusText)
  }
}

function sanitizeAndParseGPTText(
  recipeContent: string
): DBRecipeRecord["data"] {
  const startIndex = recipeContent.indexOf("{")

  // Find the last occurrence of }
  const endIndex = recipeContent.lastIndexOf("}")

  // Check if { and } are found
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "Invalid text response from GPT, no JSON object detected (missing `{`, `}`)"
    )
  }
  // Extract the JSON object
  const sanitizedObject = recipeContent.substring(startIndex, endIndex + 1)

  try {
    // Validate the JSON object
    const jsonObject = JSON.parse(sanitizedObject)
    console.log("Valid JSON object:", jsonObject)
    return jsonObject
  } catch (error) {
    console.log("Invalid JSON object:", error)
    throw new Error("Error parsing GPT response")
  }
}
export {
  getRecipeRecord,
  getRecipeText,
  getRecipeImage,
  updateRecipeRecord,
  clearRecipeRecord,
}
