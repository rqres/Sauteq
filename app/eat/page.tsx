'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import ingredientMap from '@/utils/ingredientData'
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
  const { searchQuery, setSearchQuery, results } = useSearch({
    dataSet: ingredients.data,
    keys: ['name'],
  })
  const [selection, setSelection] = useState<number[]>([])
  const [title, setTitle] = useState<string>('')
  const [body, setBody] = useState<RecipeBody | null>(null)
  const [image, setImage] = useState<string>('')
  const searchBoxRef = useRef<HTMLInputElement | null>(null)

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

  const generateRecipe = async () => {
    selection.sort(function (a, b) {
      return a - b
    })

    const ingredients = selection.map((id) => ingredientMap[id])

    const rTitle = await getRecipeTitle(ingredients)
    setTitle(rTitle)
    console.log(rTitle)

    const [rBody, rImage] = await Promise.all([
      await getRecipeBody(rTitle, ingredients),
      await getRecipeImage(rTitle),
    ])
    setBody(rBody)
    setImage(rImage)
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
    </div>
  )
}
