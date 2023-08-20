import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import UserCardContentSkeleton from './UserCardContentSkeleton'

export default function LoadingPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-[400px] border-0 shadow-none dark:bg-transparent sm:my-8 sm:w-[620px] sm:rounded-xl sm:border sm:border-stone-200 sm:shadow sm:dark:border-stone-800 sm:dark:bg-stone-950 md:w-[750px] lg:w-[960px] xl:w-[1250px]">
        <CardHeader className="grid grid-cols-3 grid-rows-3 items-center gap-x-8 px-10 sm:grid-cols-4">
          <Skeleton className="col-span-1 row-span-2 h-20 w-20 self-center rounded-full md:row-span-3 md:h-40 md:w-40 lg:h-40 lg:w-40" />
          <div className="col-span-2 row-span-2 space-y-3 self-center sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-1">
            <CardTitle>
              <Skeleton className="h-5 w-[40vw]" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-5 w-[30vw]" />
            </CardDescription>
          </div>
          <Skeleton className="hidden h-6 w-5/6 md:block" />
          <Skeleton className="hidden h-6 w-5/6 md:block" />
          <Skeleton className="hidden h-6 w-5/6 md:block" />

          <div className="col-span-4 md:col-span-3" />

          <div className="col-span-4 flex items-center justify-between gap-8 md:hidden">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <UserCardContentSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}
