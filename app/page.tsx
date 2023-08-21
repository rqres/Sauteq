import Link from 'next/link'

import { MotionDiv, MotionH1, MotionP, MotionSpan } from '@/utils/motion'
import { getPreviewRecipes, getRecipe } from '@/utils/supabaseRequests'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'

import PreviewGallery from '@/components/PreviewGallery'

export default async function IndexPage() {
  const staticRecipe = await getRecipe({ recipeId: 211 })
  const previewRecipes = await getPreviewRecipes({ limit: 8 })

  const recipes = [staticRecipe!, ...(previewRecipes || [])]

  return (
    <section className="container grid items-center justify-center gap-4 pb-8 pt-6 md:py-10 md:pt-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-8 max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.25, 0, 1],
              delay: 0.1,
            }}
          >
            Create <span className="text-gradient">mouthwatering</span>
          </MotionH1>
          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.25, 0, 1],
              delay: 0.22,
            }}
          >
            recipes using AI
          </MotionH1>
        </div>
        <MotionP
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.25, 0, 1],
            delay: 0.34,
          }}
          className="text-muted-foreground mb-6 max-w-[700px] text-lg"
        >
          Enter the ingredients you have on hand, and instantly generate a wide
          range of recipe options tailored to your preferences. Whether
          you&apos;re looking for a quick and easy meal or a gourmet
          extravaganza, we&apos;ve got you covered.
        </MotionP>
      </div>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.25, 0, 1],
          delay: 0.46,
        }}
        className="mb-8 flex justify-center"
      >
        <Link
          href="/eat"
          className={cn(
            buttonVariants(),
            'gradient-button h-12 w-52 text-stone-800 shadow-lg'
          )}
        >
          Get Started
        </Link>
      </MotionDiv>
      <PreviewGallery initialRecipes={recipes} />
    </section>
  )
}
