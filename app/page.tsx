import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {siteConfig.description}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet
          imperdiet nibh. Morbi elementum, erat feugiat maximus euismod, eros
          lectus ullamcorper risus, vitae tempor mauris arcu ac eros. Cras
          mattis eu neque id ultricies.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/create-recipe" className={buttonVariants()}>
          Get Started
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
