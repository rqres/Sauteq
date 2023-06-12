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
      "A realistic image of this recipe, close up on a platter: " + recipeTitle,
  })

  const imageResponse = aiImageResult.data.data[0].url?.trim() || "Problem!"

  return NextResponse.json(imageResponse, {
    status: 200,
  })
}
