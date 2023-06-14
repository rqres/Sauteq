import { ReactNode } from "react"

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { DBRecipeRecord } from "./actions"

export default function RecipeHeader({
  recipe,
  userIngredients,
  children,
}: {
  recipe: DBRecipeRecord["data"]
  userIngredients: string
  children?: ReactNode
}) {
  return (
    <CardHeader>
      <CardTitle className="mb-6">
        <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {recipe["recipe-name"]}
        </span>
        <Separator className="mt-6" />
      </CardTitle>
      <CardDescription>
        <span className="flex flex-col gap-4">
          {recipe.description}
          {/* TODO: display this differently */}
          <span>{userIngredients}</span>
        </span>
      </CardDescription>
      {children}
    </CardHeader>
  )
}
