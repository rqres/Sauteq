"use client"

import { useRouter } from "next/navigation"
import { Bookmark, RefreshCcw, Share } from "lucide-react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { clearRecipeRecord } from "./actions"

export default function RecipeMenubar({ recipeId }: { recipeId: string }) {
  const router = useRouter()
  const regenerateRecipe = async () => {
    // clear recipeText, recipeImageURL, and title
    await clearRecipeRecord(recipeId)
    //TODO: show skeleton again
    router.push(`/recipes/${recipeId}`)
    // router.refresh()
  }

  return (
    <Menubar className="mr-4 mt-6 justify-end">
      <MenubarMenu>
        <MenubarTrigger>
          <Share />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={regenerateRecipe}>
          <RefreshCcw />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Bookmark />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
