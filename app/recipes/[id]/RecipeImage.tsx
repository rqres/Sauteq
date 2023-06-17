import Image from "next/image"

import { DBRecipeRecord } from "@/types/recipe"

import { getRecipeImage, updateRecipeRecord } from "./actions"

export default async function RecipeImage({
  recipe,
}: {
  recipe: DBRecipeRecord
}) {
  let recipeImageURL = recipe.imageUrl
  if (recipeImageURL === "") {
    // not yet generated
    recipeImageURL = await getRecipeImage(recipe.title)
    await updateRecipeRecord(recipe.id, { recipeImageURL: recipeImageURL })
  }

  const imageStyle = {
    borderRadius: "1%",
    border: "1px solid #fff",
  }
  return (
    <Image
      src={recipeImageURL}
      width={350}
      height={300}
      alt={"Recipe Image"}
      style={imageStyle}
      priority={true}
    />
  )
}
