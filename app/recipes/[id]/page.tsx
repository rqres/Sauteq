import { Suspense } from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import RecipeContent from "./RecipeContent"
import RecipeHeader from "./RecipeHeader"
import RecipeImage from "./RecipeImage"
import { getRecipeRecord, getRecipeText } from "./actions"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  const recipeText = await getRecipeText(params.id)
  const recipeRecord = await getRecipeRecord(params.id)
  return (
    <Card className="mx-auto my-12 w-[780px] space-y-8">
      <RecipeHeader
        recipe={recipeText}
        userIngredients={recipeRecord.ingredients}
      >
        <Suspense fallback={<Skeleton className="h-52 w-full" />}>
          {recipeText && <RecipeImage recipeId={params.id} />}
        </Suspense>
      </RecipeHeader>

      <Separator />

      <RecipeContent recipe={recipeText} />

      <CardFooter>
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
      </CardFooter>
    </Card>
  )
}
