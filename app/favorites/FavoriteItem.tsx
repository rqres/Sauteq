'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';



import { RecipeBody } from '@/types/recipe';



import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';



import { GalleryItem } from '@/components/PreviewGallery';



import { bookmarkRecipe } from '../actions';





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
            description={recipe?.description || ''}
            imageSrc={recipe?.image_url || ''}
            key={recipe?.title}
            noDescription
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