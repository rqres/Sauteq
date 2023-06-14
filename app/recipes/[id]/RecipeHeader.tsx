import { ReactNode } from "react"

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
      <div className="grid grid-flow-col grid-rows-4 gap-5 p-2">
        <div className="row-span-2">
          <CardTitle className="row-span-2 mb-6">
            <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {recipe["recipe-name"]}
            </span>
          </CardTitle>
          <CardDescription>
            <span>
              {recipe.description}
              {/* TODO: display this differently */}
            </span>
          </CardDescription>
        </div>
        <div className="relative row-span-2">
          <span className="absolute bottom-0">{userIngredients}</span>
        </div>
        <div className="col-span-4 row-span-4">{children}</div>
      </div>
    </CardHeader>
  )
}
