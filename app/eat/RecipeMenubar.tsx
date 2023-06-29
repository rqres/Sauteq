'use client';

import { MouseEvent } from 'react'

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

interface RecipeMenubarProps {
  regen: (e: MouseEvent<HTMLButtonElement>) => void
  bookmark: (e: MouseEvent<HTMLButtonElement>) => void
  isBookmark: boolean
  loading: boolean
}

export default function RecipeMenubar({
  regen,
  bookmark,
  isBookmark,
  loading,
}: RecipeMenubarProps) {
  return (
    <Menubar className="mr-4 mt-6 justify-end">
      <MenubarMenu>
        <MenubarTrigger
          disabled={loading}
          className={`${
            loading ? 'cursor-default hover:bg-white' : 'cursor-pointer'
          }`}
        >
          <Share />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger
          onClick={regen}
          className={`${
            loading
              ? 'animate-spin cursor-default hover:bg-white'
              : 'animate-none cursor-pointer'
          }`}
          disabled={loading}
        >
          <RefreshCcw />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger
          onClick={bookmark}
          disabled={loading}
          className={`${
            loading ? 'cursor-default hover:bg-white' : 'cursor-pointer'
          }`}
        >
          <Bookmark fill="black" fillOpacity={Number(isBookmark)} />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}