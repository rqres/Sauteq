import Link from 'next/link'

import { getUserFavoriteRecipes } from '@/utils/supabaseRequests'

import { GalleryItem } from '@/components/PreviewGallery'

export default async function UserCardContent({ userId }: { userId: string }) {
  const userRecipes = await getUserFavoriteRecipes({ userId: userId })
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {userRecipes?.map((r) => (
        <Link
          href={`recipe/${r?.id}/${r?.title
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
          key={r?.id}
        >
          <GalleryItem
            title={r?.title || ''}
            description=''
            imageSrc={r?.image_url || ''}
            key={r?.title}
            noDescription
          />
        </Link>
      ))}
    </div>
  )
}
