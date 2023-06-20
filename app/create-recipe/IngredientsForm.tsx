
import { RefObject, useContext, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import ingredientMap from '@/utils/ingredientData'
import { addRecipe } from '@/utils/supabaseRequests'
import { zodResolver } from '@hookform/resolvers/zod'
import ingredients from 'public/english_ingredients.json'
import { UseFormReturn, useForm } from 'react-hook-form'
import * as z from 'zod'

import useSearch from '@/hooks/useSearch'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/react-hook-form/form'

import { getRecipeImage, getRecipeText, getRecipeTitle } from '../actions'

export const FormSchema = z.object({
  selectedIngredients: z
    .array(z.number())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
})

interface Ingredient {
  name: string
  UsdaId: number
}

export default function IngredientsForm({ onSubmit }) {
  const searchBoxRef = useRef<HTMLInputElement>(null)
  const { results, searchQuery, setSearchQuery } = useSearch<Ingredient>({
    dataSet: ingredients.data,
    keys: ['name'],
  })
  const [isLoading, setLoading] = useState(false)

  // TODO: use most popular ingredients
  const defaultIngredients: { [UsdaId: number]: string } = Object.fromEntries(
    Object.entries(ingredientMap).slice(0, 6)
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedIngredients: [],
    },
  })

  const createRecipe = async (data: z.infer<typeof FormSchema>) => {
    return
    setLoading(true)
    // sort by id
    data.selectedIngredients.sort(function (a, b) {
      return a - b
    })

    const ingredientsString = String(
      data.selectedIngredients.map((id) => ingredientMap[id])
    )
    const recipeTitle = await getRecipeTitle(ingredientsString)
    console.log(recipeTitle)
    const recipeBodyPromise = getRecipeText(recipeTitle, ingredientsString)
    const recipeImagePromise = getRecipeImage(recipeTitle)
    const [recipeBody, recipeImage] = await Promise.all([
      recipeBodyPromise,
      recipeImagePromise,
    ])

    // if (userId) {
    // const token = await getToken({ template: 'supabase' })
    // console.log('User logged in ' + userId)
    // if (token) {
    try {
      const recipe = await addRecipe({
        ingredients: ingredientsString,
        title: recipeTitle,
        recipeBody: recipeBody,
        image_url: recipeImage,
      })
      if (!recipe) throw new Error('Recipe not defined')

      // router.push(`/recipe/${recipe.id}`)
    } catch (error) {
      console.error("Couldn't create recipe record " + error)
    } finally {
      setLoading(false)
    }
  }

  // if (isLoading) {
  //   return <p>Loading...</p>
  // }

  return (
    <Form {...form}>
      <form
        className="flex w-2/3 flex-col items-center space-y-4"
        id="ingredients-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input
          type="search"
          placeholder={'Search...'}
          className="h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={searchBoxRef}
        />
        <FormField
          control={form.control}
          name="selectedIngredients"
          render={() => (
            <FormItem className="flex flex-col">
              <div className="space-y-2">
                {results.length ? (
                  results.map((result) => (
                    <CheckboxEntry
                      key={result.UsdaId}
                      item={result}
                      form={form}
                      searchBoxRef={searchBoxRef}
                    />
                  ))
                ) : searchQuery === '' ? (
                  Object.entries(defaultIngredients).map((ing) => (
                    <CheckboxEntry
                      key={ing[0]}
                      item={{ UsdaId: Number(ing[0]), name: ing[1] }}
                      form={form}
                    />
                  ))
                ) : (
                  // TODO: ADD INGREDIENT TO DB?
                  <p>No Results</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function CheckboxEntry({
  item,
  form,
  searchBoxRef,
}: {
  item: Ingredient
  form: UseFormReturn<
    {
      selectedIngredients: number[]
    },
    any,
    undefined
  >
  searchBoxRef?: RefObject<HTMLInputElement>
}) {
  return (
    <FormField
      key={item.UsdaId}
      control={form.control}
      name="selectedIngredients"
      render={({ field }) => {
        return (
          <FormItem
            key={item.UsdaId}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <FormControl>
              <Checkbox
                checked={field.value?.includes(item.UsdaId)}
                onCheckedChange={(checked) => {
                  // auto cmd+A search box upon selecting an ingredient
                  searchBoxRef?.current?.focus()
                  searchBoxRef?.current?.select()
                  return checked
                    ? field.onChange([...field.value, item.UsdaId])
                    : field.onChange(
                        field.value?.filter((value) => value !== item.UsdaId)
                      )
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">{item.name}</FormLabel>
          </FormItem>
        )
      }}
    />
  )
}

const createQueryString = (name: string, value: string) => {
  const params = new URLSearchParams()
  params.set(name, value)

  return params.toString()
}
