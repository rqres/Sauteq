'use client'

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import Link from 'next/link'

import ingredientMap from '@/utils/ingredientData'
import {
  addRecipe,
  flushCache,
  saveImageToStorage,
  updateRecipeImage,
} from '@/utils/supabaseRequests'
import { SignInButton, useAuth } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock8, Drumstick, EggFried, X, Zap } from 'lucide-react'
import ingredients from 'public/english_ingredients.json'

import { RecipeBody } from '@/types/recipe'

import { cn } from '@/lib/utils'

import useSearch from '@/hooks/useSearch'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { AnimatedIngredientItem } from '@/components/AnimatedIngredientItem'
import RecipeSheet from '@/components/RecipeSheet'
import { Icons } from '@/components/icons'

import { fetchBody, fetchDescription, fetchImage, fetchTitle } from '../actions'
import { ProgressBar } from './ProgressBar'

const MealTypeButton = ({
  mealType,
  mealTypeState,
  setMealType,
}: {
  mealType: 'breakfast' | 'lunch' | 'dinner'
  mealTypeState: 'breakfast' | 'lunch' | 'dinner' | 'any'
  setMealType: Dispatch<
    SetStateAction<'breakfast' | 'lunch' | 'dinner' | 'any'>
  >
}) => (
  <div
    className={cn(
      'grid grow cursor-pointer place-items-center gap-1 rounded-md border border-stone-200 py-3 shadow-sm transition-colors duration-300 ease-in-out hover:bg-stone-100/60 dark:border-stone-800 dark:bg-stone-950 dark:hover:bg-stone-800/60',
      mealTypeState === mealType &&
        'border-stone-400 bg-stone-100/50 text-stone-900 dark:border-stone-200 dark:bg-stone-800/50 dark:text-stone-200'
    )}
    onClick={() => {
      if (mealTypeState === mealType) {
        setMealType('any')
      } else {
        setMealType(mealType)
      }
    }}
  >
    {mealType === 'breakfast' && (
      <>
        <EggFried />
        Breakfast
      </>
    )}
    {mealType === 'lunch' && (
      <>
        <Icons.lunch />
        Lunch
      </>
    )}
    {mealType === 'dinner' && (
      <>
        <Drumstick />
        Dinner
      </>
    )}
  </div>
)

const PopularIngredients = [
  { UsdaId: 1840, name: 'CHICKEN BREAST' },
  { UsdaId: 10024, name: 'SPAGHETTI' },
  { UsdaId: 2015, name: 'EGGS' },
  { UsdaId: 1767, name: 'WALNUTS' },
  { UsdaId: 186, name: 'MILK CHOCOLATE' },
]

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
  const [description, setDescription] = useState<string>('')
  const [body, setBody] = useState<RecipeBody | string | null>(null)
  const [image, setImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [limitReached, setLimitReached] = useState<boolean>(false)
  const [mealType, setMealType] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'any'
  >('any')
  const searchBoxRef = useRef<HTMLInputElement | null>(null)

  const [recipeId, setRecipeId] = useState<number | null>(null)

  const [progress, setProgress] = useState<number>(13)

  const [isDesktop, setDesktop] = useState(false)

  const updateMedia = () => {
    setDesktop(window.innerWidth >= 768)
  }

  useEffect(() => {
    window.addEventListener('resize', updateMedia)
    return () => window.removeEventListener('resize', updateMedia)
  })

  const generateRecipe = useCallback(async () => {
    window.scrollTo(0, 0)
    setLoading(true)
    selection.sort(function (a, b) {
      return a - b
    })

    const ingredients = selection.map((id) => ingredientMap[id])

    const titleResponse = await fetchTitle(ingredients, mealType)
    const title: string = await titleResponse.json()
    if (titleResponse.status !== 200) {
      if (titleResponse.status === 429) {
        // rate limit
        setLimitReached(true)
      } else {
        setTitle('Error generating title. Please try again.')
      }
      return
    }

    setProgress((p) => p + 20)
    setTitle(title)

    const bodyFetch = fetchBody(title, ingredients, mealType)
    const imageFetch = fetchImage(title)
    const descriptionResponse = await fetchDescription(
      title,
      ingredients,
      mealType
    )
    if (descriptionResponse.status !== 200) {
      setDescription('Error generating description. Please try again.')
      return
    }
    const description: string = await descriptionResponse.json()
    setProgress((p) => p + 30)
    setDescription(description)

    const imageResponse = await imageFetch
    if (imageResponse.status !== 200) {
      setImage('/no-image.png')
      setBody('Error generating image. Please try again')
      setProgress(100)
      setLoading(false)
      return
    }
    const image: string = await imageResponse.json()
    setProgress((p) => p + 25)
    setImage(image)

    const bodyResponse = await bodyFetch
    if (bodyResponse.status !== 200) {
      setBody('Error generating recipe. Please try again')
      setProgress(100)
      setLoading(false)
      return
    }

    const body: RecipeBody = await bodyResponse.json()
    setBody(body)

    setProgress(100)

    setLoading(false)

    let token = undefined
    if (isLoaded && userId) {
      const tkn = await getToken({ template: 'supabase' })
      token = tkn ? tkn : undefined
    }

    // save to db
    const newRecipe = await addRecipe({
      ingredients: String(ingredients),
      title: title,
      description: description,
      recipeBody: body,
      token: token,
      mealType: mealType,
    })

    if (newRecipe) {
      await saveImageToStorage({
        recipeId: newRecipe.id,
        imageUrl: image,
      })
      await updateRecipeImage({ recipeId: newRecipe.id, token: token })
      console.log('Saved recipe to db')
      setRecipeId(newRecipe.id)
    }
  }, [getToken, isLoaded, mealType, selection, userId])

  const regenRecipe = async () => {
    setLoading(true)
    setProgress(13)
    setTitle('')
    setBody(null)
    setImage('')
    setDescription('')
    flushCache()
    await generateRecipe()
    setLoading(false)
  }

  if (limitReached) {
    return (
      <div className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-4 text-center text-lg font-medium">
        <Clock8 strokeWidth={1.2} size={42} />
        {isLoaded && userId ? (
          <>
            <div>
              <p>
                As a logged in user, you can generate at most 40 recipes per
                day.
              </p>
              <p>Please come back in 24 hours.</p>
            </div>
            <Link
              href={'/'}
              className={cn(
                buttonVariants(),
                'gradient-button h-12 w-52 text-stone-800 shadow-lg'
              )}
            >
              Back to home
            </Link>
          </>
        ) : (
          <>
            <div>
              <p>You can only generate 20 recipes per day.</p>
              <p>Sign up for a free account to generate more!</p>
            </div>
            <SignInButton>
              <button
                className={cn(
                  buttonVariants(),
                  'gradient-button h-12 w-52 text-stone-800 shadow-lg'
                )}
              >
                Sign up
              </button>
            </SignInButton>
          </>
        )}
      </div>
    )
  }

  if (formView) {
    return (
      <AnimatePresence>
        <div className="flex min-h-[calc(100vh-4.1rem)] flex-col items-center justify-center gap-8 py-16 md:flex-row md:py-0">
          <motion.div layout>
            <Card className="w-80 lg:w-96">
              <CardHeader>
                <CardTitle>Choose ingredients</CardTitle>
                <CardDescription>What will you cook next?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm text-stone-600 dark:text-stone-500">
                  <MealTypeButton
                    mealType={'breakfast'}
                    mealTypeState={mealType}
                    setMealType={setMealType}
                  />
                  <MealTypeButton
                    mealType={'lunch'}
                    mealTypeState={mealType}
                    setMealType={setMealType}
                  />
                  <MealTypeButton
                    mealType={'dinner'}
                    mealTypeState={mealType}
                    setMealType={setMealType}
                  />
                </div>
                <Input
                  type="search"
                  placeholder={'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-base"
                  ref={searchBoxRef}
                />
                <div className="h-40 space-y-2 overflow-y-auto pl-1">
                  {results.length === 0 &&
                    searchQuery === '' &&
                    PopularIngredients.map((ingr) => (
                      <AnimatedIngredientItem key={'f' + ingr.UsdaId}>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            className="transition"
                            id={ingr.name}
                            checked={selection.includes(ingr.UsdaId)}
                            onCheckedChange={(checked) => {
                              checked
                                ? setSelection([...selection, ingr.UsdaId])
                                : setSelection(
                                    selection.filter(
                                      (val) => val !== ingr.UsdaId
                                    )
                                  )
                              searchBoxRef?.current?.focus()
                              searchBoxRef?.current?.select()
                            }}
                          />
                          <Label
                            htmlFor={ingr.name}
                            className="flex items-center gap-1 text-base lowercase"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Zap
                                    strokeWidth={1.7}
                                    size={23}
                                    color={'oklch(83% 0.194 111.04)'}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Popular</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {ingr.name}
                          </Label>
                        </div>
                      </AnimatedIngredientItem>
                    ))}
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
                            className="text-base lowercase"
                          >
                            {result.name}
                          </Label>
                        </div>
                      </AnimatedIngredientItem>
                    ))}
                </div>
              </CardContent>
              {selection.length > 0 && (
                <AnimatedIngredientItem className="w-full">
                  <CardFooter className="-mt-2">
                    <Button
                      className="gradient-button w-full text-stone-800"
                      onClick={(e) => {
                        setRecipeView(true)
                        setFormView(false)
                        e.preventDefault()
                        generateRecipe()
                      }}
                    >
                      Generate!
                    </Button>
                  </CardFooter>
                </AnimatedIngredientItem>
              )}
            </Card>
          </motion.div>
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-2 px-6 md:grid md:grid-flow-col md:grid-rows-4 md:px-0">
              {isDesktop &&
                selection.length > 0 &&
                selection.slice(0, 12).map((ingredientId) => (
                  <AnimatedIngredientItem key={ingredientId}>
                    <div className="flex items-center gap-4 rounded-xl border px-4 py-2 transition md:h-full md:w-32 lg:w-44">
                      <X
                        className="shrink-0 cursor-pointer rounded-xl border p-1 hover:bg-gray-300"
                        onClick={() =>
                          setSelection(
                            selection.filter((val) => val !== ingredientId)
                          )
                        }
                      />
                      <Label className="text-base lowercase md:text-xs lg:text-sm">
                        {ingredientMap[ingredientId]}
                      </Label>
                    </div>
                  </AnimatedIngredientItem>
                ))}
              {!isDesktop &&
                selection.length > 0 &&
                selection.map((ingredientId) => (
                  <AnimatedIngredientItem key={ingredientId}>
                    <div className="flex items-center gap-4 rounded-xl border px-4 py-2 transition md:h-full md:w-32 lg:w-44">
                      <X
                        className="shrink-0 cursor-pointer rounded-xl border p-1 hover:bg-gray-300"
                        onClick={() =>
                          setSelection(
                            selection.filter((val) => val !== ingredientId)
                          )
                        }
                      />
                      <Label className="text-base lowercase md:text-xs lg:text-sm">
                        {ingredientMap[ingredientId]}
                      </Label>
                    </div>
                  </AnimatedIngredientItem>
                ))}
            </div>
            {isDesktop && selection.length > 12 && (
              <p className="mt-4">& more</p>
            )}
          </div>
        </div>
      </AnimatePresence>
    )
  }

  return (
    // recipeView
    <div className="flex flex-col items-center justify-center">
      {recipeView && (
        <>
          <ProgressBar progress={progress} />
          <RecipeSheet
            title={title}
            description={description}
            body={body}
            image={image}
            regen={regenRecipe}
            loading={loading}
            recipeId={recipeId}
            initialBookmark={false}
            mealType={mealType}
          />
        </>
      )}
    </div>
  )
}
