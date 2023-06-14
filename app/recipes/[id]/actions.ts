interface DBRecipeRecord {
  id: string
  title: string
  data: ParsedRecipe["text"]
  rawData: string
  ready: boolean
  ingredients: string
  imageUrl: string
}

interface ParsedRecipe {
  text: {
    "recipe-name": string
    description: string
    "prep-time": string
    "cook-time": string
    serves: number
    ingredients: string[]
    directions: string[]
    optional: string[]
  }
  image: string
}

async function getRecipeRecord(recipeId: string) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    { cache: "no-store" }
  )
  const recipe: DBRecipeRecord = await res.json()

  return recipe
}

async function getRecipeTextData(recipeId: string) {
  const recipe = await getRecipeRecord(recipeId)

  if (recipe.ready && Object.keys(recipe.data).length) {
    console.log(">> Recipe already in DB, skipping generation...")
    return recipe.data
  }

  const [rawGeneratedRecipeText, parsedGeneratedRecipeText] =
    await getParsedRecipeText(recipe.ingredients)

  console.log(parsedGeneratedRecipeText["recipe-name"])

  // push updates to DB
  const updateResponse = await updateRecipeRecord(recipeId, {
    title: parsedGeneratedRecipeText["recipe-name"],
    rawRecipeContent: rawGeneratedRecipeText,
    recipeContent: parsedGeneratedRecipeText,
  })

  if (!updateResponse.ok) {
    throw new Error("Unable to update Database with generated recipe text")
  }

  return parsedGeneratedRecipeText
}

async function getRecipeImageData(recipeId: string) {
  console.log("called getRecipeImage")

  const recipe = await getRecipeRecord(recipeId)

  if (recipe.ready && recipe.imageUrl) {
    console.log(">> Image already generated, skipping...")
    return recipe.imageUrl
  }

  if (!recipe.title)
    throw new Error(
      "getRecipeImage should be called after determining the title of the recipe!"
    )
  console.log(">> GPT Image not generated yet, generating...")
  const gptImageResponse = await getGPTImageResponse(recipe.title)
  const recipeImageURL: string = await gptImageResponse.json()

  const updateResponse = await updateRecipeRecord(recipeId, {
    recipeImageURL: recipeImageURL,
  })

  if (!updateResponse.ok) {
    throw new Error("Unable to update Database with generated recipe image")
  }

  return recipeImageURL
}

function sanitizeAndParseGPTResponse(
  recipeContent: string
): ParsedRecipe["text"] {
  const startIndex = recipeContent.indexOf("{")

  // Find the last occurrence of }
  const endIndex = recipeContent.lastIndexOf("}")

  // Check if { and } are found
  if (startIndex === -1 || endIndex === -1) {
    // Handle the invalid string as needed
    throw new Error(
      "Invalid text response from GPT, no JSON object detected (missing `{`, `}`)"
    )
  } else {
    // Step 3: Extract the JSON object
    const sanitizedObject = recipeContent.substring(startIndex, endIndex + 1)

    try {
      // Step 4: Validate the JSON object
      const jsonObject = JSON.parse(sanitizedObject)
      console.log("Valid JSON object:", jsonObject)
      // Use the parsed JSON object as needed
      return jsonObject
    } catch (error) {
      console.log("Invalid JSON object:", error)
      // Handle the invalid JSON object as needed
      throw new Error("Error parsing GPT response")
    }
  }
}

async function getParsedRecipeText(
  recipeIngredients: string
): Promise<[string, ParsedRecipe["text"]]> {
  const gptTextResponse = await getGPTTextResponse(recipeIngredients)
  // recipeContent, unparsed json (stringified)
  const recipeContent: string = await gptTextResponse.json()
  const parsedRecipeContent = sanitizeAndParseGPTResponse(recipeContent)

  return [recipeContent, parsedRecipeContent]
}

async function getGPTTextResponse(recipeIngredients: string) {
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
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to connect to OpenAI/text" + res.statusText)
  }
  return res
}

async function getGPTImageResponse(recipeTitle: string) {
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
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to connect to OpenAI/image" + res.statusText)
  }
  return res
}

async function updateRecipeRecord(
  recipeId: string,
  fields: {
    title?: string
    rawRecipeContent?: string
    recipeContent?: ParsedRecipe["text"]
    recipeImageURL?: ParsedRecipe["image"]
  }
) {
  const prevRecordData = await getRecipeRecord(recipeId)
  const dbUpdateRes = await fetch(
    `http://127.0.0.1:8090/api/collections/recipes/records/${recipeId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: fields.recipeContent || prevRecordData.data,
        rawData: fields.rawRecipeContent || prevRecordData.rawData,
        imageUrl: fields.recipeImageURL || prevRecordData.imageUrl,
        ready: true,
        title: fields.title || prevRecordData.title,
      }),
    }
  )

  if (!dbUpdateRes.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to connect to PocketBase" + dbUpdateRes.statusText)
  }

  return dbUpdateRes
}

export {
  getRecipeTextData as getRecipeText,
  getRecipeImageData as getRecipeImage,
  getRecipeRecord,
}

export type { DBRecipeRecord }
