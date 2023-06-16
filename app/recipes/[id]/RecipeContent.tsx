import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { DBRecipeRecord } from "./actions"

export default function RecipeContent({
  recipeText,
}: {
  recipeText: DBRecipeRecord["data"]
}) {
  return (
    <CardContent>
      <section className="mb-4">
        <p className=" ">Prep Time: {recipeText["prep-time"]}</p>
        <p className=" ">Cook Time: {recipeText["cook-time"]}</p>
        <p className=" ">Serves: {recipeText["serves"]}</p>
      </section>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Ingredients
      </h4>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {recipeText.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <Separator className="my-4" />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Directions
      </h4>
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {recipeText.directions.map((direction) => (
          <li key={direction}>{direction}</li>
        ))}
      </ol>
      {recipeText.optional.length > 0 && (
        <>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Optional
          </h4>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {recipeText.optional.map((optionalStep) => (
              <li key={optionalStep}>{optionalStep}</li>
            ))}
          </ul>
        </>
      )}
    </CardContent>
  )
}
