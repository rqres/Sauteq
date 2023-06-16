"use client"

import { useState } from "react"
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
  const [isRegenerating, setRegenerating] = useState(false)

  const regenerateRecipe = async () => {
    setRegenerating(true)
    // clear recipeText, recipeImageURL, and title
    await clearRecipeRecord(recipeId)
    router.refresh()
    // Uncommenting the next line completely disables all animations!!
    setTimeout(() => {
      setRegenerating(false)
    }, 20000)
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
          <RefreshCcw
            className={isRegenerating ? "animate-spin" : "animate-none"}
          />
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
