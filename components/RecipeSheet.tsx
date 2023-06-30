'use client'

import { useState } from 'react'

import Image from 'next/image'

import { SignInButton } from '@clerk/nextjs'

import { RecipeBody } from '@/types/recipe'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

import { bookmarkRecipe } from '@/app/actions'

import RecipeMenubar from '../app/eat/RecipeMenubar'

interface RecipeSheetProps {
  recipeId: number
  title: string
  body: RecipeBody | null
  image: string
  regen?: () => Promise<void>
  loading?: boolean
  initialBookmark: boolean
  noReturnButton?: boolean
  noRegen?: boolean
}

export default function RecipeSheet({
  recipeId,
  title,
  body,
  image,
  regen,
  loading,
  initialBookmark,
  noReturnButton,
  noRegen,
}: RecipeSheetProps) {
  const [isBookmark, setBookmark] = useState<boolean>(initialBookmark)
  const { toast } = useToast()

  return (
    <Card className="my-8 w-[400px] place-self-center md:w-[750px]">
      <RecipeMenubar
        noRegen={noRegen}
        regen={async () => {
          if (regen) {
            setBookmark(false)
            await regen()
          }
        }}
        bookmark={async () => {
          const res = await bookmarkRecipe(recipeId, isBookmark)
          if (res == -1) {
            toast({
              title: 'Uh oh! Something went wrong.',
              description: 'You must sign in to save recipes.',
              action: (
                <SignInButton>
                  <ToastAction altText="Sign in">Sign in</ToastAction>
                </SignInButton>
              ),
            })
            return
          }
          setBookmark(!isBookmark)
        }}
        isBookmark={isBookmark}
        loading={loading}
      />

      <CardHeader>
        <div className="space-y-8 md:flex md:justify-between md:gap-x-4 md:space-y-0">
          <div>
            <CardTitle className="mb-6">
              {title === '' ? (
                <Skeleton className="h-20 w-full md:w-64" />
              ) : (
                <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  {title}
                </span>
              )}
            </CardTitle>
            {!body ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <RecipeDescription recipeDescription={body.description} />
            )}
          </div>
          <div className="md:shrink-0">
            {image === '' ? (
              <Skeleton className="h-[350px] w-[350px]" />
            ) : (
              <RecipeImage img={image || ''} />
            )}
          </div>
        </div>
      </CardHeader>

      <Separator className="mb-11 mt-7" />

      {!body ? <RecipeContentSkeleton /> : <RecipeContent body={body} />}

      {!noReturnButton && (
        <CardFooter>
          <Button
            className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={loading}
            onClick={() => window.location.reload()}
          >
            <div className="flex justify-between gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-move-left"
              >
                <path d="M6 8L2 12L6 16" />
                <path d="M2 12H22" />
              </svg>
              Create another
            </div>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function RecipeDescription({
  recipeDescription,
}: {
  recipeDescription: string
}) {
  return <CardDescription>{recipeDescription}</CardDescription>
}

function RecipeContent({ body }: { body: RecipeBody }) {
  return (
    <CardContent>
      <section className="mb-4">
        <p className=" ">Prep Time: {body['prep-time']}</p>
        <p className=" ">Cook Time: {body['cook-time']}</p>
        <p className=" ">Serves: {body['serves']}</p>
      </section>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Ingredients
      </h4>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {body.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <Separator className="my-4" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Directions
      </h4>
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {body.directions.map((direction) => (
          <li key={direction}>{direction}</li>
        ))}
      </ol>
      {body.optional.length > 0 && (
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Optional
          </h4>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {body.optional.map((optionalStep) => (
              <li key={optionalStep}>{optionalStep}</li>
            ))}
          </ul>
        </>
      )}
    </CardContent>
  )
}

export function RecipeContentSkeleton() {
  return (
    <CardContent>
      <section className="mb-4 space-y-2">
        <Skeleton className="h-3 w-2/3 md:w-1/4" />
        <Skeleton className="h-3 w-2/3 md:w-1/4" />
        <Skeleton className="h-3 w-2/3 md:w-1/4" />
      </section>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Ingredients
      </h4>
      <ul className="my-4 ml-6 list-none [&>li]:mt-2">
        <li key={0}>
          <Skeleton className="h-3 w-1/3 md:w-1/5" />
        </li>
        <li key={1}>
          <Skeleton className="h-3 w-1/3 md:w-1/5" />
        </li>
        <li key={2}>
          <Skeleton className="h-3 w-1/3 md:w-1/5" />
        </li>
      </ul>
      <Separator className="my-4" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Directions
      </h4>
      <ul className="my-4 ml-6 list-none [&>li]:mt-2">
        <li key={3}>
          <Skeleton className="h-3 w-11/12" />
        </li>
        <li key={4}>
          <Skeleton className="h-3 w-11/12" />
        </li>
        <li key={5}>
          <Skeleton className="h-3 w-11/12" />
        </li>
        <li key={6}>
          <Skeleton className="h-3 w-11/12" />
        </li>
      </ul>
    </CardContent>
  )
}

function RecipeImage({ img }: { img: string }) {
  return (
    <Image
      priority
      src={img}
      width={350}
      height={300}
      alt={'Recipe Image'}
      className="rounded-xl shadow"
    />
  )
}
