import { forwardRef } from 'react'

import Image from 'next/image'

import { MotionLi, MotionSection, MotionSpan } from '@/utils/motion'
import { Drumstick, EggFried } from 'lucide-react'

import { RecipeBody } from '@/types/recipe'

import { cn } from '@/lib/utils'

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

import RecipeMenubar from './RecipeMenubar'
import { Icons } from './icons'
import { CreateAnotherButton } from './ui/CreateAnotherButton'

interface RecipeSheetProps {
  recipeId: number | null
  title: string
  description: string
  body: RecipeBody | string | null
  image: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
  bookmarkCount?: number
  regen?: () => Promise<void>
  loading?: boolean
  initialBookmark: boolean
  noReturnButton?: boolean
  noRegen?: boolean
  noMenuBar?: boolean
  className?: string
  creatorUsername?: string
  creatorAvatar?: string
}

const RecipeSheet = forwardRef<HTMLDivElement, RecipeSheetProps>(
  function RecipeSheet(
    {
      recipeId,
      title,
      description,
      body,
      image,
      mealType,
      bookmarkCount,
      regen,
      loading,
      initialBookmark,
      noReturnButton,
      noRegen,
      noMenuBar,
      className,
      creatorUsername,
      creatorAvatar,
    },
    ref
  ) {
    return (
      <Card
        ref={ref}
        className={cn(
          'my-8 w-[400px] place-self-center border-0 shadow-none dark:bg-transparent sm:rounded-xl  sm:border sm:border-stone-200 sm:shadow sm:dark:border-stone-800 sm:dark:bg-stone-950 md:w-[750px]',
          className
        )}
      >
        {!noMenuBar && (
          <RecipeMenubar
            noRegen={noRegen}
            initialBookmark={initialBookmark}
            recipeId={recipeId}
            loading={loading}
            regen={regen}
            noReturnButton={noReturnButton}
            title={title}
            body={body || undefined}
            description={description}
            image={image}
            mealType={mealType}
            bookmarkCount={bookmarkCount}
            creatorUsername={creatorUsername}
            creatorAvatar={creatorAvatar}
          />
        )}

        <CardHeader>
          <div className="space-y-8 md:flex md:justify-between md:gap-x-4 md:space-y-0">
            <div className="flex flex-col">
              <CardTitle className="mb-6">
                {title === '' ? (
                  <Skeleton className="h-20 w-full md:w-64" />
                ) : (
                  <MotionSpan
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        type: 'spring',
                        bounce: 0.25,
                        opacity: { delay: 0.2 },
                      },
                    }}
                    className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-all first:mt-0"
                  >
                    {title}
                  </MotionSpan>
                )}
              </CardTitle>
              {!description ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <RecipeDescription recipeDescription={description} />
              )}

              {mealType !== 'any' && (
                <div className="mt-4 flex h-full items-center gap-2 text-stone-600 dark:border-stone-800 dark:text-stone-400">
                  Perfect for
                  {mealType === 'breakfast' && (
                    <div className="flex gap-1">
                      <EggFried />
                      <span>Breakfast</span>
                    </div>
                  )}
                  {mealType === 'lunch' && (
                    <div className="flex gap-1">
                      <Icons.lunch />
                      <span>Lunch</span>
                    </div>
                  )}
                  {mealType === 'dinner' && (
                    <div className="flex gap-1">
                      <Drumstick />
                      <span>Dinner</span>
                    </div>
                  )}
                </div>
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
            <CreateAnotherButton loading={loading} />
          </CardFooter>
        )}
      </Card>
    )
  }
)

function RecipeDescription({
  recipeDescription,
}: {
  recipeDescription: string
}) {
  return (
    <CardDescription className="text-base">
      <MotionSpan
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: 'auto',
          opacity: 1,
          transition: {
            type: 'spring',
            bounce: 0.25,
            opacity: { delay: 0.2 },
          },
        }}
      >
        {recipeDescription}
      </MotionSpan>
    </CardDescription>
  )
}

function RecipeContent({ body }: { body: RecipeBody | string }) {
  if (typeof body === 'string') {
    return (
      <CardContent>
        <MotionSpan
          layout
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              type: 'spring',
              bounce: 0.25,
              opacity: { delay: 0.2 },
            },
          }}
          className="text-red-700"
        >
          <p>{body}</p>
        </MotionSpan>
      </CardContent>
    )
  }

  return (
    <CardContent>
      <MotionSection
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: 'auto',
          opacity: 1,
          transition: {
            type: 'spring',
            bounce: 0.25,
            opacity: { delay: 0.2 },
          },
        }}
        className="mb-4"
      >
        <p>Prep Time: {body['prep-time']}</p>
        <p>Cook Time: {body['cook-time']}</p>
        <p>Serves: {body['serves']}</p>
      </MotionSection>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Ingredients
      </h4>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {body.ingredients !== undefined &&
          body.ingredients.map((ingredient) => (
            <MotionLi
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  type: 'spring',
                  bounce: 0.25,
                  opacity: { delay: 0.2 },
                },
              }}
              key={ingredient}
            >
              {ingredient}
            </MotionLi>
          ))}
      </ul>
      <Separator className="my-4" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Directions
      </h4>
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {body.directions !== undefined &&
          body.directions.map((direction) => (
            <li key={direction}>{direction}</li>
          ))}
      </ol>
      {body.optional !== undefined && body.optional.length > 0 && (
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

export default RecipeSheet
