import Image from 'next/image'
import Link from 'next/link'

import { getRecipe } from '@/utils/supabaseRequests'

import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const PreviewRecipes = [194, 211, 209, 210]

export const GalleryItem = ({
  title,
  description,
  imageSrc,
}: {
  title: string
  description: string
  imageSrc: string
}) => (
  <Card className="h-full transition duration-200 ease-in-out hover:scale-105">
    <CardHeader className="grid h-full grid-cols-4 items-center justify-center gap-4">
      <CardTitle className="col-span-2">
        <span className="scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0 md:text-2xl">
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
      <CardDescription className="col-span-4 text-sm md:text-base">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
)

export default async function PreviewGallery() {
  const recipes = await Promise.all(
    PreviewRecipes.map((id) => getRecipe({ recipeId: id }))
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      {recipes.map((r) => (
        <Link
          href={`recipe/${r?.id}/${r?.title
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
          key={r?.id}
        >
          <GalleryItem
            title={r?.title || ''}
            description={r?.body.description || ''}
            imageSrc={r?.image_url || ''}
            key={r?.title}
          />
        </Link>
      ))}
    </div>
  )
}
