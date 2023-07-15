'use client';

import { useState } from 'react';



import { SignInButton } from '@clerk/nextjs';
import { Bookmark, RefreshCcw, Share } from 'lucide-react';



import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';



import { bookmarkRecipe } from '@/app/actions';



import { CreateAnotherButton } from './ui/CreateAnotherButton'
import { ToastAction } from './ui/toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { useToast } from './ui/use-toast'

interface RecipeMenubarProps {
  recipeId: number
  regen?: () => Promise<void>
  loading?: boolean
  noRegen?: boolean
  initialBookmark: boolean
  noReturnButton?: boolean
}

export default function RecipeMenubar({
  recipeId,
  regen,
  loading,
  noRegen,
  initialBookmark,
  noReturnButton,
}: RecipeMenubarProps) {
  const [isBookmark, setBookmark] = useState<boolean>(initialBookmark)
  const { toast } = useToast()

  return (
    <Menubar
      className={`ml-5 mr-3 mt-6 ${
        noReturnButton ? 'justify-end' : 'justify-between'
      }`}
    >
      {!noReturnButton && <CreateAnotherButton loading={loading} />}
      <div className="flex">
        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  disabled={loading}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <Share />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarMenu>
        {!noRegen && (
          <MenubarMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenubarTrigger
                    onClick={async () => {
                      if (regen) {
                        setBookmark(false)
                        await regen()
                      }
                    }}
                    className={`${
                      loading
                        ? 'animate-spin cursor-not-allowed hover:bg-transparent'
                        : 'animate-none cursor-pointer'
                    }`}
                    disabled={loading}
                  >
                    <RefreshCcw />
                  </MenubarTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate with same ingredients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </MenubarMenu>
        )}
        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  onClick={async () => {
                    const res = await bookmarkRecipe(recipeId, isBookmark)
                    if (res == -1) {
                      toast({
                        title: 'Uh oh! Something went wrong.',
                        description: 'You must sign in to save recipes.',
                        action: (
                          <SignInButton>
                            <ToastAction altText="Sign in">Sign in</ToastAction>
                          </SignInButton>
                        ),
                      })
                      return
                    }
                    setBookmark(!isBookmark)
                  }}
                  disabled={loading}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <Bookmark
                    className={`${
                      isBookmark
                        ? 'fill-black dark:fill-white'
                        : 'fill-transparent'
                    } transition`}
                  />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorite recipe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarMenu>
      </div>
    </Menubar>
  )
}