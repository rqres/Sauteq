import Image from 'next/image'
import Link from 'next/link'

import { getRecipe, getUserFavoriteRecipes } from '@/utils/supabaseRequests'

import { Card, CardHeader, CardTitle } from './ui/card'

const RECIPE_MASTER = 'user_2U7kZDUcrxAnHFDV5m2wgdTnJjI'

const PREVIEW_RECIPES = [211]

export const GalleryItem = ({
  title,
  imageSrc,
}: {
  title: string
  imageSrc: string
}) => (
  <Card className="h-full transition duration-200 ease-in-out hover:scale-105">
    <CardHeader className="flex h-full flex-col items-center justify-between gap-4 text-center">
      <CardTitle className="col-span-2">
        <span className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0 md:text-2xl">
          {title}
        </span>
      </CardTitle>
      <div className="col-span-2 justify-self-end">
        <Image
          src={imageSrc}
          width={533}
          height={500}
          alt={'Recipe Image'}
          className="rounded-xl shadow"
        />
      </div>
    </CardHeader>
  </Card>
)

export default async function PreviewGallery() {
  const staticRecipes = await Promise.all(
    PREVIEW_RECIPES.map((id) => getRecipe({ recipeId: id }))
  )

  const recipes = await getUserFavoriteRecipes({ userId: RECIPE_MASTER })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes !== undefined &&
        [...staticRecipes, ...recipes].map((r) => (
          <Link
            href={`recipe/${r?.id}/${r?.title
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
            key={r?.id}
          >
            <GalleryItem
              title={r?.title || ''}
              imageSrc={r?.image_url || ''}
              key={r?.title}
            />
          </Link>
        ))}
    </div>
  )
}
