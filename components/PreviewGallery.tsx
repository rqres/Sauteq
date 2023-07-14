import Image from 'next/image'

import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const recipes = [
  {
    title: 'Asparagus and Feta Salad with Olive Oil Dressing',
    description:
      'A refreshing salad featuring asparagus and feta cheese, dressed with a delicious olive oil dressing.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/147.png',
  },
  {
    title:
      'Dark Chocolate Cardamom Truffles with Edamer Cheese and Dandelion Honey',
    description:
      'Decadent dark chocolate truffles infused with cardamom, served with a creamy Edamer cheese filling and drizzled with sweet dandelion honey.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/Dark%20Chocolate%20Cardamom%20Truffles%20with%20Edamer%20Cheese%20and%20Dandelion%20Honey.png',
  },
  {
    title:
      'Lemon Herb Roasted Chicken with Lavender Potatoes and Yoghurt Drizzle',
    description:
      'A flavorful and aromatic roasted chicken with a hint of citrus, served with lavender-infused potatoes and a tangy yoghurt drizzle.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/152.png',
  },
  {
    title: 'Grilled Apricot and Honey Glazed Zucchini',
    description:
      'Grilled zucchini glazed with a sweet apricot and honey sauce.',
    imageSrc:
      'https://outggvemqdylkseydkof.supabase.co/storage/v1/object/public/recipe-images/150.png',
  },
]

const GalleryItem = ({
  title,
  description,
  imageSrc,
}: {
  title: string
  description: string
  imageSrc: string
}) => (
  <Card className="">
    <CardHeader>
      <div className="space-y-8 md:flex md:justify-between md:gap-x-4 md:space-y-0">
        <div>
          <CardTitle className="mb-4">
            <span className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
              {title}
            </span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="md:shrink-0">
          <Image
            src={imageSrc}
            width={233}
            height={200}
            alt={'Recipe Image'}
            className="rounded-xl shadow"
          />
        </div>
      </div>
    </CardHeader>
  </Card>
)

export default function PreviewGallery() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {recipes.map((r) => (
        <GalleryItem
          title={r.title}
          description={r.description}
          imageSrc={r.imageSrc}
          key={r.title}
        />
      ))}
    </div>
  )
}
