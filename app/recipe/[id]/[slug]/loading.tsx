import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { RecipeContentSkeleton } from '@/components/RecipeSheet'

export default function RPageLoading() {
  return (
    <div className="flex justify-center ">
      <Card className="my-8 w-[400px] place-self-center md:w-[750px]">
        <CardHeader>
          <div className="space-y-8 md:flex md:justify-between md:gap-x-4 md:space-y-0">
            <div>
              <CardTitle className="mb-6">
                <Skeleton className="h-20 w-full md:w-64" />
              </CardTitle>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="md:shrink-0">
              <Skeleton className="h-[350px] w-[350px]" />
            </div>
          </div>
        </CardHeader>

        <Separator className="mb-11 mt-7" />

        <RecipeContentSkeleton />
      </Card>
    </div>
  )
}
