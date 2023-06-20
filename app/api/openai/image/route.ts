import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi } from 'openai'

interface Payload {
  title: string
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export const POST = async (req: NextRequest) => {
  const { title }: Payload = await req.json()

  const aiImageResult = await openai.createImage({
    prompt:
      'An image that you would find in a cookbook, of this recipe: ' + title,
    size: '512x512',
  })

  const imageResponse =
    aiImageResult.data.data[0].url?.trim() || 'Problem fetching OpenAI data.'

  console.log('%cIMAGE API CALLED!', 'color: red; font-size: larger')

  return NextResponse.json(imageResponse)
}
