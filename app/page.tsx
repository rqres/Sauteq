import Link from 'next/link';



import { siteConfig } from '@/config/site';



import { buttonVariants } from '@/components/ui/button'

import PreviewGallery from '@/components/PreviewGallery'

export default function IndexPage() {
  return (
    <section className="container grid items-center justify-center gap-4 pb-8 pt-6 md:py-10 md:pt-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="mb-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl ">
          Create <span className="text-gradient">mouthwatering </span>
          <br />
          recipes using AI
        </h1>
        <p className="text-muted-foreground mb-6 max-w-[700px] text-lg">
          Enter the ingredients you have on hand, and instantly generate a wide
          range of recipe options tailored to your preferences. Whether
          you&apos;re looking for a quick and easy meal or a gourmet
          extravaganza, we&apos;ve got you covered.
        </p>
      </div>
      <div className="mb-8 flex justify-center">
        <Link href="/eat" className={buttonVariants()}>
          Get Started
        </Link>
      </div>
      <div>
        <PreviewGallery />
      </div>
    </section>
  )
}