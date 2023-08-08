import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingPage() {
  return (
    <div>
      <h1 className="mb-6 mt-3 scroll-m-20 text-center text-3xl font-extrabold tracking-tight lg:text-5xl">
        History
      </h1>
      <div className="mx-4 mb-6 space-y-2">
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
        <Skeleton className="h-[42px] w-full" />
      </div>
    </div>
  )
}
