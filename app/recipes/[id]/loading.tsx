import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <Card className="m-auto w-[680px]">
      <CardHeader>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
      <CardContent>
        <section className="mb-4 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/3" />
        </section>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Ingredients
        </h4>
        <ul className="my-4 ml-6 list-none [&>li]:mt-2">
          <li>
            <Skeleton className="h-3 w-1/5" />
          </li>
          <li>
            <Skeleton className="h-3 w-1/5" />
          </li>
          <li>
            <Skeleton className="h-3 w-1/5" />
          </li>
        </ul>
        <hr className="my-4" />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Directions
        </h4>
        <ul className="my-4 ml-6 list-none [&>li]:mt-2">
          <li>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li>
            <Skeleton className="h-3 w-11/12" />
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
