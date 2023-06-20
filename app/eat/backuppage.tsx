'use client'

import { useState } from 'react'

import ingredientMap from '@/utils/ingredientData'
import { Check, Loader2, Utensils } from 'lucide-react'
import { z } from 'zod'

import { DBRecipeRecord } from '@/types/recipe'

import { Button } from '@/components/ui/button'

import { getRecipeImage, getRecipeText, getRecipeTitle } from '../actions'
import IngredientsForm, { FormSchema } from '../create-recipe/IngredientsForm'
import RecipeSheet from './RecipeSheet'

export default function EatPage() {
  // const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [title, setTitle] = useState<string | null>(null)
  const [body, setBody] = useState<DBRecipeRecord['data'] | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const generate = async (data: z.infer<typeof FormSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    setLoading(true)
    data.selectedIngredients.sort(function (a, b) {
      return a - b
    })

    const ingredientsString = String(
      data.selectedIngredients.map((id) => ingredientMap[id])
    )

    const newTitle = await getRecipeTitle(ingredientsString)
    const newBody = await getRecipeText(newTitle, ingredientsString)
    const newImage = await getRecipeImage(newTitle)
    // const resTitle = await fetch('/api/openai/title', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ ingredients: ingredientsString }),
    // })
    // const newTitle = await resTitle.json()
    // if (resTitle.status !== 200) {
    //   setError(newTitle)
    //   return
    // }
    // console.log(newTitle)

    // const resBody = await fetch('/api/openai/body', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ title: newTitle, ingredients: ingredientsString }),
    // })
    // const newBody = await resBody.json()
    // if (resBody.status !== 200) {
    //   setError(newBody)
    //   return
    // }
    // console.log(newBody)
    // const resImage = await fetch('/api/openai/image', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ title: newTitle }),
    // })
    // const newImage = await resImage.json()
    // if (resImage.status !== 200) {
    //   setError(newImage)
    //   return
    // }
    // console.log(newImage)

    setTitle(newTitle)
    setBody(newBody)
    setImage(newImage)

    setTimeout(() => {
      setLoading(false)
    }, 1300)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center py-2">
      <main className="mb-8 mt-4 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mb-0">
        <h1 className="font-display mx-auto mb-5 max-w-4xl text-4xl font-bold tracking-normal text-slate-400 sm:text-6xl">
          Generate your <span className="text-indigo-500">delicious</span>{' '}
          recipe
        </h1>
        <div className="mt-4 flex w-full flex-col items-center justify-between">
          {(!title || !body || !image) && (
            <div className="flex  w-full flex-col items-center justify-center gap-3 md:ml-32 md:flex-row md:items-end">
              <div className="h-[338px] w-full max-w-sm space-y-4 rounded-xl border py-11">
                <div className="mt-3 flex items-center justify-center space-x-3">
                  <Utensils className="h-8 w-8" />
                  <p className="text-left font-medium">
                    Select your ingredients
                  </p>
                </div>
                <div className="flex justify-center">
                  <IngredientsForm onSubmit={generate} />
                </div>
              </div>
              <Button className="mb-1 w-36" form="ingredients-form">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Generate
                  </>
                )}
              </Button>
            </div>
          )}
          {title && body && image && (
            <RecipeSheet title={title} body={body} image={image} />
            // <div className="h-[338px] w-full max-w-sm space-y-4 rounded-xl border py-11">
            //   <div className="mt-3 flex items-center justify-center space-x-3">
            //     <h3>{generatedRecipe}</h3>
            //   </div>
            // </div>
          )}
        </div>
      </main>
    </div>
  )
}
