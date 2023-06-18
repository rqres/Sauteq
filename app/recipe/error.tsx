"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section className="container absolute left-1/2 top-1/2 mr-[-50%] grid w-[380px] -translate-x-1/2 -translate-y-1/2 items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center">
        <h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
          Something went wrong!
        </h3>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </section>
  )
}
