import { NextRequest, NextResponse } from "next/server"
import { Configuration, OpenAIApi } from "openai"

interface Payload {
  title: string
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {
  const data: Payload = await req.json()
  const recipeTitle = data.title
  console.log(recipeTitle)

  const aiImageResult = await openai.createImage({
    prompt:
      "An image that you would find in a cookbook, of this recipe: " +
      recipeTitle,
  })

  const imageResponse = aiImageResult.data.data[0].url?.trim() || "Problem!"

  console.log("%cIMAGE API CALLED!", "color: red; font-size: larger")

  return NextResponse.json(imageResponse, {
    status: 200,
  })
}
