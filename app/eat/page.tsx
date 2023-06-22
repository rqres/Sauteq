'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import ingredientMap from '@/utils/ingredientData'
import {
  addRecipe,
  linkRecipeToUser,
  toggleBookmark,
} from '@/utils/supabaseRequests'
import { useAuth } from '@clerk/nextjs'
import ingredients from 'public/english_ingredients.json'

import { RecipeBody } from '@/types/recipe'

import useSearch from '@/hooks/useSearch'

import {
  flushCache,
  getRecipeBody,
  getRecipeImage,
  getRecipeTitle,
} from '../actions'

const defaultIngredients = ingredients.data.slice(0, 6)

export default function EatPage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth()
  const { searchQuery, setSearchQuery, results } = useSearch({
    dataSet: ingredients.data,
    keys: ['name'],
  })
  const [selection, setSelection] = useState<number[]>([])
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<RecipeBody | null>(null)
  const [image, setImage] = useState<string>('')
  const [error, setError] = useState<string>('')
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

    const [rBody, rImage] = await Promise.all([
      await getRecipeBody(rTitle, ingredients),
      await getRecipeImage(rTitle),
    ])
    if (!rBody) {
      throw new Error('Error generating body')
    }
    if (!rImage) {
      throw new Error('Error generating image')
    }
    setBody(rBody)
    setImage(rImage)

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
    console.log('Recipe id: ' + recipeRef.current)
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
    <div>
      <p>Choose ingredients</p>
      <input
        type="search"
        placeholder={'Search...'}
        className="h-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        ref={searchBoxRef}
      />
      {results.length ? (
        results.map((result) => (
          <div className="flex" key={result.UsdaId}>
            <input
              type="checkbox"
              id={result.name}
              onChange={(event) => {
                event.target.checked
                  ? setSelection([...selection, result.UsdaId])
                  : setSelection(
                      selection.filter((val) => val !== result.UsdaId)
                    )
                searchBoxRef?.current?.focus()
                searchBoxRef?.current?.select()
              }}
            />
            <label htmlFor={result.name}>{result.name}</label>
          </div>
        ))
      ) : searchQuery === '' ? (
        defaultIngredients.map((ing) => (
          <div className="flex" key={ing.UsdaId}>
            <input
              type="checkbox"
              id={ing.name}
              onChange={(event) => {
                event.target.checked
                  ? setSelection([...selection, ing.UsdaId])
                  : setSelection(selection.filter((val) => val !== ing.UsdaId))
              }}
            />
            <label htmlFor={ing.name}>{ing.name}</label>
          </div>
        ))
      ) : (
        // TODO: ADD INGREDIENT TO DB?
        <p>No Results</p>
      )}
      <button
        className="border bg-slate-200 px-4 py-2"
        onClick={(e) => {
          e.preventDefault()
          generateRecipe()
        }}
      >
        Go
      </button>
      <button
        className="border bg-blue-200 px-4 py-2"
        onClick={(e) => {
          e.preventDefault()
          flushCache()
          setTitle('')
          setBody(null)
          setImage('')
          generateRecipe()
        }}
      >
        Regenerate
      </button>
      {title && <p>{title}</p>}
      {body && (
        <>
          <p>{body.description}</p>
          <p>{body['cook-time']}</p>
          <p>{body['prep-time']}</p>
        </>
      )}
      {image && <Image src={image} width={300} height={300} alt={title} />}
      {title && body && image && (
        <button
          className={`border px-4 py-2 ${
            isBookmark ? 'bg-pink-500' : 'bg-pink-200'
          }`}
          onClick={(e) => {
            e.preventDefault()
            bookmarkRecipe()
          }}
        >
          Bookmark
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
