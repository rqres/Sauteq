import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

interface Payload {
  promptIngredients: string[]
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

const basePrompt =
  "Generate a recipe using ONLY the ingredients I have available in my house right now. Include cook time, prep time, and a detailed outline of the ingredients required and the steps needed to prepare this meal. You may include bare basic ingredients that anyone has at home (e.g water). You do not HAVE to use all ingredients, if you come up with a recipe that doesn't require an ingredient mentioned, you may skip it. If you feel the ingredients mentioned are to constraining, you may add a note stating optional ingredients that once may incorporate in order to obtain a better result. These optional ingredients must NOT be crucial to the end recipe! Here is the list of ingredients I have available:"

export async function POST(req: NextRequest) {
  const data: Payload = await req.json()
  const ingredients = data.promptIngredients

  if (!ingredients || !ingredients.length) {
    return NextResponse.json("No ingredients provided", { status: 400 })
  }

  const recipePrompt = basePrompt + ingredients

  const aiResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${recipePrompt}` }],
  })

  const response =
    aiResult.data.choices[0].message?.content.trim() || "Problem!"

  return NextResponse.json(response, { status: 200 })
}
