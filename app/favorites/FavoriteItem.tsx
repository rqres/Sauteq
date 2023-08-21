'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { bookmarkRecipe } from '@/utils/supabaseRequests'

import { RecipeBody } from '@/types/recipe'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { GalleryItem } from '@/components/PreviewGallery'

interface FavoriteItemProps {
  recipe:
    | {
        body: RecipeBody
        description: string
        created_at: string | null
        id: number
        image_url: string | null
        ingredients: string
        title: string
        user_id: string
      }
    | null
    | undefined
}

export default function FavoriteItem({ recipe }: FavoriteItemProps) {
  const router = useRouter()
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={`recipe/${recipe?.id}/${recipe?.title
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
          key={recipe?.id}
        >
          <GalleryItem
            title={recipe?.title || ''}
            imageSrc={recipe?.image_url || ''}
            key={recipe?.title}
          />
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            bookmarkRecipe(recipe?.id!, true)
            router.refresh()
          }}
        >
          Remove from favorites
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
