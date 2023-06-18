"use client"

import { RefObject, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import PocketBase from "pocketbase"
import ingredients from "public/english_ingredients.json"
import { UseFormReturn, useForm } from "react-hook-form"
import * as z from "zod"

import useSearch from "@/hooks/useSearch"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

const FormSchema = z.object({
  selectedIngredients: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
})

interface Ingredient {
  name: string
  UsdaId: number
}

export default function IngredientsForm() {
  const router = useRouter()
  const searchBoxRef = useRef<HTMLInputElement>(null)
  const { results, searchQuery, setSearchQuery } = useSearch<Ingredient>({
    dataSet: ingredients.data,
    keys: ["name"],
  })

  // TODO: use most popular ingredients
  const defaultIngredients = ingredients.data.slice(0, 6)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedIngredients: [],
    },
  })

  const createRecipe = async (data: z.infer<typeof FormSchema>) => {
    router.push(
      `recipe?${createQueryString(
        "ingredients",
        String(data.selectedIngredients)
      )}`
    )

    // const pb = new PocketBase("http://127.0.0.1:8090")

    // const newRecipeRecord = await pb.collection("recipes").create({
    //   data: {},
    //   ready: false,
    //   ingredients: String(data.selectedIngredients),
    // })
    // // TODO: use redirect instead of router
    // // redirect(`/recipes/${newRecipeRecord.id}`)
    // router.push(`/recipes/${newRecipeRecord.id}`)
  }

  return (
    <Form {...form}>
      <form id="ingredients-form" onSubmit={form.handleSubmit(createRecipe)}>
        <FormField
          control={form.control}
          name="selectedIngredients"
          render={() => (
            <FormItem className="flex flex-col gap-4">
              <Input
                type="search"
                placeholder={"Search for ingredients..."}
                className="h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchBoxRef}
              />
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
                ) : searchQuery === "" ? (
                  defaultIngredients.map((ing) => (
                    <CheckboxEntry key={ing.UsdaId} item={ing} form={form} />
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
      selectedIngredients: string[]
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
                checked={field.value?.includes(item.name)}
                onCheckedChange={(checked) => {
                  // auto cmd+A search box upon selecting an ingredient
                  searchBoxRef?.current?.focus()
                  searchBoxRef?.current?.select()
                  return checked
                    ? field.onChange([...field.value, item.name])
                    : field.onChange(
                        field.value?.filter((value) => value !== item.name)
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
