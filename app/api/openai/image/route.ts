import { NextRequest, NextResponse } from 'next/server'

import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge'

export const runtime = 'edge'
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

  const data = (await aiImageResult.json()) as ResponseTypes['createImage']

  const imageResponse = data.data[0].url || 'Problem fetching OpenAI data.'

  console.log('IMAGE API CALLED!')

  return NextResponse.json(imageResponse)
}
