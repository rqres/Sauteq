import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getRecipe } from "./actions"

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
  const recipe = await getRecipe(params.id)
  return (
    <Card className="m-auto w-[680px]">
      <CardHeader>
        <CardTitle className="mb-6">
          <span className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {recipe.data["recipe-name"]}
          </span>
        </CardTitle>
        <CardDescription>
          <span className="flex flex-col gap-4">
            {recipe.data.description}
            {/* TODO: display this differently */}
            <span>{recipe.ingredients}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <section className="mb-4">
          <p className=" ">Prep Time: {recipe.data["prep-time"]}</p>
          <p className=" ">Cook Time: {recipe.data["cook-time"]}</p>
          <p className=" ">Serves: {recipe.data["serves"]}</p>
        </section>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Ingredients
        </h4>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          {recipe.data.ingredients.map((ingredient) => (
            <li>{ingredient}</li>
          ))}
        </ul>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Directions
        </h4>
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          {recipe.data.directions.map((direction) => (
            <li>{direction}</li>
          ))}
        </ol>
        {recipe.data.optional.length && (
          <>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              OPTIONAL
            </h4>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {recipe.data.optional.map((optionalStep) => (
                <li>{optionalStep}</li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
      <CardFooter>
        {/* <Button form="ingredients-form" className="w-full" type="submit">
          <Check className="mr-2 h-4 w-4" /> Generate recipe
        </Button> */}
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
      </CardFooter>
    </Card>
    //     <div>
    //       <h2
    //         className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0
    // "
    //       >
    //         {recipe.data["recipe-name"]}
    //       </h2>
    //       <p className="leading-7 [&:not(:first-child)]:mt-6">
    //         Prep Time: {recipe.data["prep-time"]}
    //       </p>
    //       <p className="leading-7 [&:not(:first-child)]:mt-6">
    //         Cook Time: {recipe.data["cook-time"]}
    //       </p>
    //       <p className="leading-7 [&:not(:first-child)]:mt-6">
    //         Serves: {recipe.data["serves"]}
    //       </p>
    //     </div>
  )
}
