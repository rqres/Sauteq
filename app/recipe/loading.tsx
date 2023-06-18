import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import RecipeMenubar from "./RecipeMenubar"

export default function LoadingPage() {
  return (
    <Card className="mx-auto my-12 w-[400px] md:w-[750px]">
      <RecipeMenubar />
      <CardHeader>
        <div className="space-y-6 md:flex md:justify-between md:gap-x-4 md:space-y-0">
          <div>
            <CardTitle className="mb-6">
              <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Generating recipe...
              </span>
            </CardTitle>
            {/* <CardDescription> */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            {/* </CardDescription> */}
          </div>
          <Skeleton className="h-60 w-full md:h-60 md:w-1/2" />
        </div>
      </CardHeader>
      <Separator className="mb-11 mt-7" />
      <CardContent>
        <section className="mb-4 space-y-2">
          <Skeleton className="h-3 w-2/3 md:w-1/4" />
          <Skeleton className="h-3 w-2/3 md:w-1/4" />
          <Skeleton className="h-3 w-2/3 md:w-1/4" />
        </section>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Ingredients
        </h4>
        <ul className="my-4 ml-6 list-none [&>li]:mt-2">
          <li key={0}>
            <Skeleton className="h-3 w-1/3 md:w-1/5" />
          </li>
          <li key={1}>
            <Skeleton className="h-3 w-1/3 md:w-1/5" />
          </li>
          <li key={2}>
            <Skeleton className="h-3 w-1/3 md:w-1/5" />
          </li>
        </ul>
        <Separator className="my-4" />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Directions
        </h4>
        <ul className="my-4 ml-6 list-none [&>li]:mt-2">
          <li key={3}>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li key={4}>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li key={5}>
            <Skeleton className="h-3 w-11/12" />
          </li>
          <li key={6}>
            <Skeleton className="h-3 w-11/12" />
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
