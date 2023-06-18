import { ReactNode } from "react"

import { DBRecipeRecord } from "@/types/recipe"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecipeHeader({
  recipeText,
  children,
}: {
  recipeText: DBRecipeRecord["data"]
  children?: ReactNode
}) {
  return (
    <CardHeader>
      <div className="space-y-8 md:flex md:gap-x-4 md:space-y-0">
        <div>
          <CardTitle className="mb-6">
            <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {recipeText["recipe-name"]}
            </span>
          </CardTitle>
          <CardDescription>
            {recipeText.description}
            {/* TODO: display this differently */}
          </CardDescription>
        </div>
        <div className="md:shrink-0">{children}</div>
      </div>
    </CardHeader>
  )
}
