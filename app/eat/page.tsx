'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import ingredientMap from '@/utils/ingredientData'
import {
  addRecipe,
  saveImageToStorage,
  updateRecipeImage,
} from '@/utils/supabaseRequests'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import { Drumstick, EggFried, X } from 'lucide-react'
import ingredients from 'public/english_ingredients.json'

import { RecipeBody } from '@/types/recipe'

import { cn } from '@/lib/utils'

import useSearch from '@/hooks/useSearch'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { AnimatedIngredientItem } from '@/components/AnimatedIngredientItem'
import RecipeSheet from '@/components/RecipeSheet'

import {
  flushCache,
  getRecipeBody,
  getRecipeImage,
  getRecipeTitle,
} from '../actions'

export const LunchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-sandwich"
  >
    <path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3" />
    <path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83" />
    <path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z" />
    <path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z" />
  </svg>
)

export default function EatPage() {
  const { isLoaded, userId, getToken } = useAuth()
  const { searchQuery, setSearchQuery, results } = useSearch({
    dataSet: ingredients.data,
    keys: ['name'],
  })
  const [selection, setSelection] = useState<number[]>([])
  const [recipeView, setRecipeView] = useState<boolean>(false)
  const [formView, setFormView] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<RecipeBody | null>(null)
  const [image, setImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [mealType, setMealType] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'any'
  >('any')
  const searchBoxRef = useRef<HTMLInputElement | null>(null)
  const recipeRef = useRef<number | null>(null)

  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    // if (!recipeRef.current)
    window.addEventListener('beforeunload', unloadCallback)
    // if (recipeRef.current)
    // window.removeEventListener('beforeunload', unloadCallback)
    return () => window.removeEventListener('beforeunload', unloadCallback)
  })
  //  [recipeRef])

  // TODO: move this to server actions
  const generateRecipe = useCallback(async () => {
    setLoading(true)
    selection.sort(function (a, b) {
      return a - b
    })

    const ingredients = selection.map((id) => ingredientMap[id])

    const rTitle = await getRecipeTitle(ingredients, mealType)

    if (!rTitle) {
      throw new Error('Error generating title')
    }
    setTitle(rTitle)
    console.log(rTitle)

    const rImage = await getRecipeImage(rTitle)
    if (!rImage) {
      throw new Error('Error generating image')
    }
    setImage(rImage)

    const rBody = await getRecipeBody(rTitle, ingredients, mealType)
    if (!rBody) {
      throw new Error('Error generating body')
    }
    setBody(rBody)

    let token = undefined
    if (isLoaded && userId) {
      const tkn = await getToken({ template: 'supabase' })
      token = tkn ? tkn : undefined
    }

    // save to db
    const newRecipe = await addRecipe({
      ingredients: String(ingredients),
      title: rTitle,
      recipeBody: rBody,
      token: token,
      mealType: mealType,
    })

    if (newRecipe) {
      await saveImageToStorage({
        recipeId: newRecipe.id,
        imageUrl: rImage,
      })
      await updateRecipeImage({ recipeId: newRecipe.id, token: token })
      console.log('Saved recipe to db')
      recipeRef.current = newRecipe.id
    }

    setLoading(false)
  }, [getToken, isLoaded, mealType, selection, userId])

  const regenRecipe = async () => {
    setLoading(true)
    setTitle('')
    setBody(null)
    setImage('')
    flushCache()
    await generateRecipe()
    setLoading(false)
  }

  return (
    <>
      {formView ? (
        <AnimatePresence initial={false}>
          <div className="flex min-h-[calc(100vh-4.1rem)] flex-col items-center justify-center gap-8 py-16 md:flex-row md:py-0">
            <motion.div layout>
              <Card className="w-80 md:w-72 lg:w-96">
                <CardHeader>
                  <CardTitle>Choose ingredients</CardTitle>
                  <CardDescription>What will you cook next?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm text-stone-600 dark:text-stone-400">
                    <div
                      className={cn(
                        'grid grow cursor-pointer place-items-center gap-1 rounded-md border border-stone-200 py-3 shadow-sm transition-colors duration-300 ease-in-out hover:bg-stone-100/60 dark:border-stone-800 dark:bg-stone-950',
                        mealType === 'breakfast' &&
                          'border-stone-400 bg-stone-100/50 text-stone-900'
                      )}
                      onClick={() => {
                        if (mealType === 'breakfast') {
                          setMealType('any')
                        } else {
                          setMealType('breakfast')
                        }
                      }}
                    >
                      <EggFried />
                      Breakfast
                    </div>
                    <div
                      className={cn(
                        'grid grow cursor-pointer place-items-center gap-1 rounded-md border border-stone-200 py-3 shadow-sm transition-colors duration-300 ease-in-out hover:bg-stone-100/60 dark:border-stone-800 dark:bg-stone-950',
                        mealType === 'lunch' &&
                          'border-stone-400 bg-stone-100/50 text-stone-900'
                      )}
                      onClick={() => {
                        if (mealType === 'lunch') {
                          setMealType('any')
                        } else {
                          setMealType('lunch')
                        }
                      }}
                    >
                      <LunchIcon />
                      Lunch
                    </div>
                    <div
                      className={cn(
                        'grid grow cursor-pointer place-items-center gap-1 rounded-md border border-stone-200 py-3 shadow-sm transition-colors duration-300 ease-in-out hover:bg-stone-100/60 dark:border-stone-800 dark:bg-stone-950',
                        mealType === 'dinner' &&
                          'border-stone-400 bg-stone-100/50 text-stone-900'
                      )}
                      onClick={() => {
                        if (mealType === 'dinner') {
                          setMealType('any')
                        } else {
                          setMealType('dinner')
                        }
                      }}
                    >
                      <Drumstick />
                      Dinner
                    </div>
                  </div>
                  <Input
                    type="search"
                    placeholder={'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchBoxRef}
                  />
                  <div className="h-40 space-y-2 overflow-y-auto pl-1">
                    {results.length > 0 &&
                      results.map((result) => (
                        <AnimatedIngredientItem key={'f' + result.UsdaId}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="transition"
                              id={result.name}
                              checked={selection.includes(result.UsdaId)}
                              onCheckedChange={(checked) => {
                                checked
                                  ? setSelection([...selection, result.UsdaId])
                                  : setSelection(
                                      selection.filter(
                                        (val) => val !== result.UsdaId
                                      )
                                    )
                                searchBoxRef?.current?.focus()
                                searchBoxRef?.current?.select()
                              }}
                            />
                            <Label
                              htmlFor={result.name}
                              className="text-sm lowercase"
                            >
                              {result.name}
                            </Label>
                          </div>
                        </AnimatedIngredientItem>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col-reverse gap-2 md:grid md:grid-flow-col md:grid-rows-4">
                {selection.length > 0 &&
                  //TODO: reverse?
                  selection.slice(0, 12).map((ingredientId) => (
                    <AnimatedIngredientItem key={ingredientId}>
                      <div className="flex h-full w-44 items-center gap-4 rounded-xl border px-4 py-2 transition md:w-32 lg:w-44">
                        <X
                          className="shrink-0 cursor-pointer rounded-xl border p-1 hover:bg-gray-300"
                          onClick={() =>
                            setSelection(
                              selection.filter((val) => val !== ingredientId)
                            )
                          }
                        />
                        <Label className="text-sm lowercase md:text-xs lg:text-sm">
                          {ingredientMap[ingredientId]}
                        </Label>
                      </div>
                    </AnimatedIngredientItem>
                  ))}
              </div>
              {selection.length > 12 && <p className="mt-4">& more</p>}
            </div>
            <Button
              className={`absolute bottom-1 right-1 transition-opacity ease-in-out md:bottom-14 md:right-44 ${
                selection.length > 0 ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={(e) => {
                setRecipeView(true)
                setFormView(false)
                e.preventDefault()
                generateRecipe()
              }}
            >
              Generate
            </Button>
          </div>
        </AnimatePresence>
      ) : (
        // recipeView
        <div className="flex justify-center">
          {recipeView && (
            <RecipeSheet
              title={title}
              body={body}
              image={image}
              regen={regenRecipe}
              loading={loading}
              recipeId={recipeRef.current!}
              initialBookmark={false}
              mealType={mealType}
            />
          )}
        </div>
      )}
    </>
  )
}
