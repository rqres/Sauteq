import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const recipes = [
  {
    id: 147,
    title: 'Asparagus and Feta Salad with Olive Oil Dressing',
    description:
      'A refreshing salad featuring asparagus and feta cheese, dressed with a delicious olive oil dressing.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/147.png',
  },
  {
    id: 194,
    title:
      'Dark Chocolate Cardamom Truffles with Edamer Cheese and Dandelion Honey',
    description:
      'Decadent dark chocolate truffles infused with cardamom, served with a creamy Edamer cheese filling and drizzled with sweet dandelion honey.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/194.png',
  },
  {
    id: 152,
    title:
      'Lemon Herb Roasted Chicken with Lavender Potatoes and Yoghurt Drizzle',
    description:
      'A flavorful and aromatic roasted chicken with a hint of citrus, served with lavender-infused potatoes and a tangy yoghurt drizzle.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/152.png',
  },
  {
    id: 162,
    title: 'Apricot Mint Lemonade',
    description:
      'A refreshing and tangy twist on classic lemonade with the sweetness of apricots and the freshness of mint.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/162.png',
  },
]

export const GalleryItem = ({
  title,
  description,
  imageSrc,
  imageClassName,
}: {
  title: string
  description: string
  imageSrc: string
  imageClassName?: string
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
          className={cn('rounded-xl shadow', imageClassName)}
        />
      </div>
      <CardDescription className="col-span-4 text-sm md:text-base">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
)

export default function PreviewGallery() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {recipes.map((r) => (
        <Link href={`recipe/${r.id}/${r?.title.replace(/\s+/g, '-').toLowerCase()}`}>
          <GalleryItem
            title={r.title}
            description={r.description}
            imageSrc={r.imageSrc}
            key={r.title}
          />
        </Link>
      ))}
    </div>
  )
}
