'use client'

import { useState } from 'react'

import { SignInButton } from '@clerk/nextjs'
import { Bookmark, RefreshCcw, Share } from 'lucide-react'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { bookmarkRecipe } from '@/app/actions'

import { ToastAction } from './ui/toast'
import { useToast } from './ui/use-toast'

interface RecipeMenubarProps {
  recipeId: number
  regen?: () => Promise<void>
  loading?: boolean
  noRegen?: boolean
  initialBookmark: boolean
}

export default function RecipeMenubar({
  recipeId,
  regen,
  loading,
  noRegen,
  initialBookmark,
}: RecipeMenubarProps) {
  const [isBookmark, setBookmark] = useState<boolean>(initialBookmark)
  const { toast } = useToast()

  return (
    <Menubar className="mr-4 mt-6 justify-end">
      <MenubarMenu>
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
      </MenubarMenu>
      {!noRegen && (
        <MenubarMenu>
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
        </MenubarMenu>
      )}
      <MenubarMenu>
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
              isBookmark ? 'fill-black' : 'fill-transparent'
            } transition`}
          />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
