import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"

import { DBRecipeRecord } from "@/types/recipe"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { getRecipeImage, getRecipeText, getRecipeTitle } from "../actions"
import RecipeMenubar from "./RecipeMenubar"

export default async function RecipePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const queryIngredients = searchParams.ingredients
  // TODO:
  const recipeTitle = await getRecipeTitle(String(queryIngredients))
  const recipeBodyData = getRecipeText(recipeTitle, queryIngredients as string)
  const recipeImageData = getRecipeImage(recipeTitle)

  // const recipeBody = await recipeBodyData
  // useRef to persist between refresh?

  return (
    <Card className="mx-auto my-12 w-[400px] md:w-[750px]">
      <RecipeMenubar />

      <CardHeader>
        <div className="space-y-8 md:flex md:gap-x-4 md:space-y-0">
          <div>
            <CardTitle className="mb-6">
              <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                {recipeTitle}
              </span>
            </CardTitle>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              }
            >
              {/* @ts-expect-error Server Component*/}
              <RecipeDescription promise={recipeBodyData} />
            </Suspense>
          </div>
          <div className="md:shrink-0">
            <Suspense fallback={<Skeleton className="h-[350px] w-[350px]" />}>
              {/* @ts-expect-error Server Component*/}
              <RecipeImage promise={recipeImageData} />
            </Suspense>
          </div>
        </div>
      </CardHeader>

      <Separator className="mb-11 mt-7" />

      <Suspense fallback={<RecipeContentSkeleton />}>
        {/* @ts-expect-error Server Component*/}
        <RecipeContent promise={recipeBodyData} />
      </Suspense>

      <CardFooter>
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
      </CardFooter>
    </Card>
  )
}

async function RecipeDescription({
  promise,
}: {
  promise: Promise<DBRecipeRecord["data"]>
}) {
  const recipeBody = await promise
  return (
    <CardDescription>
      {recipeBody.description}
      {/* TODO: display this differently */}
    </CardDescription>
  )
}

async function RecipeContent({
  promise,
}: {
  promise: Promise<DBRecipeRecord["data"]>
}) {
  const recipeBody = await promise

  return (
    <CardContent>
      <section className="mb-4">
        <p className=" ">Prep Time: {recipeBody["prep-time"]}</p>
        <p className=" ">Cook Time: {recipeBody["cook-time"]}</p>
        <p className=" ">Serves: {recipeBody["serves"]}</p>
      </section>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Ingredients
      </h4>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {recipeBody.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <Separator className="my-4" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Directions
      </h4>
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {recipeBody.directions.map((direction) => (
          <li key={direction}>{direction}</li>
        ))}
      </ol>
      {recipeBody.optional.length > 0 && (
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Optional
          </h4>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {recipeBody.optional.map((optionalStep) => (
              <li key={optionalStep}>{optionalStep}</li>
            ))}
          </ul>
        </>
      )}
    </CardContent>
  )
}

function RecipeContentSkeleton() {
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

async function RecipeImage({ promise }: { promise: Promise<string> }) {
  const img = await promise
  const imageStyle = {
    borderRadius: "1%",
    border: "1px solid #fff",
  }
  return (
    <Image
      src={img}
      width={350}
      height={300}
      alt={"Recipe Image"}
      style={imageStyle}
      priority={true}
    />
  )
}
