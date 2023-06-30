'use client';

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
  regen?: () => Promise<void>
  bookmark: () => Promise<void>
  isBookmark: boolean
  loading?: boolean
  noRegen?: boolean
}

export default function RecipeMenubar({
  regen,
  bookmark,
  isBookmark,
  loading,
  noRegen,
}: RecipeMenubarProps) {
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
            onClick={regen}
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
          onClick={bookmark}
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