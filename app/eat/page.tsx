'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import ingredientMap from '@/utils/ingredientData'
import {
  addRecipe,
  linkRecipeToUser,
  toggleBookmark,
} from '@/utils/supabaseRequests'
import { useAuth } from '@clerk/nextjs'
import { X } from 'lucide-react'
import ingredients from 'public/english_ingredients.json'

import { RecipeBody } from '@/types/recipe'

import useSearch from '@/hooks/useSearch'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  flushCache,
  getRecipeBody,
  getRecipeImage,
  getRecipeTitle,
} from '../actions'
import RecipeSheet from './RecipeSheet'

const defaultIngredients = ingredients.data.slice(0, 6)

export default function EatPage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth()
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
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [isBookmark, setBookmark] = useState<boolean>(false)
  const searchBoxRef = useRef<HTMLInputElement | null>(null)
  const recipeRef = useRef<number | null>(null)

  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    if (title) window.addEventListener('beforeunload', unloadCallback)
    if (!title) window.removeEventListener('beforeunload', unloadCallback)
    return () => window.removeEventListener('beforeunload', unloadCallback)
  }, [title])

  const generateRecipe = useCallback(async () => {
    selection.sort(function (a, b) {
      return a - b
    })

    const ingredients = selection.map((id) => ingredientMap[id])

    const rTitle = await getRecipeTitle(ingredients)

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

    const rBody = await getRecipeBody(rTitle, ingredients)
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
      image_url: rImage,
      token: token,
    })

    if (newRecipe) {
      console.log('Saved recipe to db')
      recipeRef.current = newRecipe.id
    }
  }, [getToken, isLoaded, selection, userId])

  const regenRecipe = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    setBookmark(false)
    setTitle('')
    setBody(null)
    setImage('')
    e.preventDefault()
    flushCache()
    await generateRecipe()
    setLoading(false)
  }

  const bookmarkRecipe = async () => {
    flushCache()
    if (!isLoaded || !userId) {
      setError('You must be logged in to perform this action')
      return
    }

    if (!recipeRef || !recipeRef.current) {
      console.error('No recipe')
      return
    }
    console.log('Bookmarking recipe: ' + recipeRef.current)
    const token = await getToken({ template: 'supabase' })

    if (!token) {
      console.error('Unable to fetch token')
      setError('You must be logged in to perform this action')
      return
    }

    linkRecipeToUser({
      recipeId: recipeRef.current,
      userId: userId,
      token: token,
    })

    toggleBookmark({
      recipeId: recipeRef.current,
      token: token,
      toggle: !isBookmark,
    })

    setBookmark(!isBookmark)
  }

  return (
    <>
      {formView ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-8 md:mt-0 md:h-full md:flex-row">
          <>
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="search"
                  placeholder={'Search...'}
                  className="h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchBoxRef}
                />
                <div className="h-40 overflow-y-auto rounded-xl bg-stone-100 px-5 py-3">
                  {results.length > 0 &&
                    results.map((result) => (
                      <div className="space-x-2" key={result.UsdaId}>
                        <input
                          type="checkbox"
                          id={result.name}
                          checked={selection.includes(result.UsdaId)}
                          onChange={(event) => {
                            event.target.checked
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
                        <label htmlFor={result.name} className="lowercase">
                          {result.name}
                        </label>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col items-center">
              <div className="flex flex-col-reverse gap-2 md:grid md:grid-flow-col md:grid-rows-4">
                {selection.length > 0 &&
                  selection.slice(0, 12).map((ingredientId) => (
                    <div
                      className="flex w-40 items-center justify-between gap-4 rounded border px-4 py-2 md:w-32 lg:w-40"
                      key={ingredientId}
                    >
                      <X
                        className="cursor-pointer rounded-xl border p-1 hover:bg-gray-300"
                        onClick={() =>
                          setSelection(
                            selection.filter((val) => val !== ingredientId)
                          )
                        }
                      />
                      <p className="w-20 truncate text-end text-sm lowercase">
                        {ingredientMap[ingredientId]}
                      </p>
                    </div>
                  ))}
              </div>
              {selection.length > 12 && <p className="mt-4">& more</p>}
            </div>
            <Button
              className="absolute bottom-1 right-1 md:bottom-14 md:right-44"
              onClick={(e) => {
                setRecipeView(true)
                setFormView(false)
                e.preventDefault()
                generateRecipe()
              }}
            >
              Go
            </Button>
          </>
        </div>
      ) : (
        // recipeView
        <div className="flex justify-center ">
          {recipeView && (
            <RecipeSheet
              title={title}
              body={body}
              image={image}
              regen={regenRecipe}
              bookmark={bookmarkRecipe}
              isBookmark={isBookmark}
              loading={loading}
            />
          )}
        </div>
      )}
    </>
  )
}
