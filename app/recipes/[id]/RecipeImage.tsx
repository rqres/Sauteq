import Image from "next/image"

import { getRecipeImage } from "./actions"

export default async function RecipeImage({ recipeId }: { recipeId: string }) {
  const recipeImage = await getRecipeImage(recipeId)
  const imageStyle = {
    borderRadius: "1%",
    border: "1px solid #fff",
  }
  return (
    <Image
      src={recipeImage}
      width={500}
      height={500}
      alt={"Recipe Image"}
      style={imageStyle}
    />
  )
}
