'use client'

import { Bookmark, RefreshCcw, Share } from 'lucide-react'

import { Database } from '@/types/oldsupabase'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'

export default function RecipeMenubar() {
  return (
    <Menubar className="mr-4 mt-6 justify-end">
      <MenubarMenu>
        <MenubarTrigger>
          <Share />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <RefreshCcw />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger /*onClick={bookmarkRecipe}*/>
          <Bookmark />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
