'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { addRecipe } from '@/utils/supabaseRequests'
import { useAuth } from '@clerk/nextjs'
import { Bookmark, RefreshCcw, Share } from 'lucide-react'

import { Database } from '@/types/supabase'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Progress } from '@/components/ui/progress'

import { getRecipeImage, getRecipeText, getRecipeTitle } from '../actions'

type RecipeRecord = Database['public']['Tables']['recipes']['Row']

export const revalidate = 5

export default function RecipeMenubar({
  recipeRecord,
}: {
  recipeRecord: RecipeRecord
}) {
  const [isLoading, setLoading] = useState(false)
  const [finishedLoading, setFinishedLoading] = useState(false)
  const [progress, setProgress] = useState(15)

  const router = useRouter()
  // const { isLoaded, userId, sessionId, getToken } = useAuth()
  const regenerateRecipe = async () => {
    setLoading(true)

    const recipeTitle = await getRecipeTitle(recipeRecord.ingredients)
    console.log(recipeTitle)
    setProgress(60)
    const recipeImagePromise = getRecipeImage(recipeTitle)
    const recipeBodyPromise = getRecipeText(
      recipeTitle,
      recipeRecord.ingredients
    )
    const [recipeImageRet, recipeBodyRet] = await Promise.all([
      recipeImagePromise,
      recipeBodyPromise,
    ])

    setProgress(98)

    try {
      const newRecipe = await addRecipe({
        ingredients: recipeRecord.ingredients,
        title: recipeTitle,
        recipeBody: recipeBodyRet,
        image_url: recipeImageRet,
      })
      if (!newRecipe) throw new Error('Regenerated recipe not defined')

      router.push(`/recipe/${newRecipe.id}`)
    } catch (error) {
      console.error("Couldn't regenerate recipe record " + error)
    } finally {
      setProgress(100)
      setLoading(false)
      setFinishedLoading(true)
    }
  }

  // const bookmarkRecipe = async () => {
  //   const supabaseAccessToken = await getToken({ template: "supabase" })
  //   const recipe
  // }

  return (
    <Menubar className="mr-4 mt-6 justify-end">
      <MenubarMenu>
        <MenubarTrigger>
          <Share />
        </MenubarTrigger>
      </MenubarMenu>
      <Dialog>
        <MenubarMenu>
          <DialogTrigger asChild>
            <MenubarTrigger>
              <RefreshCcw />
            </MenubarTrigger>
          </DialogTrigger>
        </MenubarMenu>
        <DialogContent>
          <DialogHeader className="space-y-8">
            <DialogTitle>
              {isLoading ? 'Generating...' : 'Regenerate recipe?'}
            </DialogTitle>
            {isLoading ? (
              // <p>Loading...</p>
              <Progress className="" value={progress} />
            ) : finishedLoading ? (
              <p className="">Done!</p>
            ) : (
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this file from our servers?
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isLoading}
              className={buttonVariants({
                variant: isLoading ? 'disabled' : 'default',
              })}
              onClick={regenerateRecipe}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MenubarMenu>
        <MenubarTrigger /*onClick={bookmarkRecipe}*/>
          <Bookmark />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
