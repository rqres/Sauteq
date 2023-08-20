import { Skeleton } from '@/components/ui/skeleton'

export default function UserCardContentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(4)].map((value: undefined, index: number) => (
        <Skeleton
          key={index}
          className="h-[279px] w-full sm:h-[368px]  md:h-[286px] lg:h-[338px]"
        />
      ))}
    </div>
  )
}
