import { Suspense } from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import {
  getRecipeRecord,
  getRecipeText,
  updateRecipeRecord,
} from "../../actions"
import RecipeContent from "./RecipeContent"
import RecipeHeader from "./RecipeHeader"
import RecipeImage from "./RecipeImage"
import RecipeMenubar from "./RecipeMenubar"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  let recipe = await getRecipeRecord(params.id)
  if (Object.keys(recipe.data).length === 0) {
    // not yet generated
    const recipeText = await getRecipeText(recipe.ingredients)
    recipe = await updateRecipeRecord(params.id, {
      recipeText: recipeText,
      title: recipeText["recipe-name"],
    })
  }

  return (
    <Card className="mx-auto my-12 w-[400px] md:w-[750px]">
      <RecipeMenubar recipeId={recipe.id} />
      <RecipeHeader recipeText={recipe.data}>
        <Suspense fallback={<Skeleton className="h-[350px] w-[350px]" />}>
          {/* @ts-expect-error Server Component */}
          <RecipeImage recipe={recipe} />
        </Suspense>
      </RecipeHeader>

      <Separator className="mb-11 mt-7" />

      <RecipeContent recipeText={recipe.data} />

      <CardFooter>
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
      </CardFooter>
    </Card>
  )
}
