import { Skeleton } from '@/components/ui/skeleton'

export default function UserCardContentSkeleton({
  numberOfSkeletons,
}: {
  numberOfSkeletons: number
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(numberOfSkeletons)].map((value: undefined, index: number) => (
        <Skeleton
          key={index}
          className="h-[279px] w-[350px] sm:h-[368px] sm:w-[568px] md:h-[286px] md:w-[340px] lg:h-[338px] lg:w-[445px]"
        />
      ))}
    </div>
  )
}
