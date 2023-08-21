'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import supabaseClient from '@/utils/supabaseClient'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'

import { RecipeBody } from '@/types/recipe'

import { Card, CardHeader, CardTitle } from './ui/card'

const supabase = supabaseClient()

export const GalleryItem = ({
  title,
  imageSrc,
}: {
  title: string
  imageSrc: string
}) => (
  <Card className="h-full transition duration-200 ease-in-out hover:scale-105">
    <CardHeader className="flex h-full flex-col items-center justify-between gap-4 text-center">
      <CardTitle className="col-span-2">
        <span className="scroll-m-20  pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0 md:text-2xl">
          {title}
        </span>
      </CardTitle>
      <div className="col-span-2 justify-self-end">
        <Image
          src={imageSrc}
          width={533}
          height={500}
          alt={'Recipe Image'}
          className="rounded-xl shadow"
        />
      </div>
    </CardHeader>
  </Card>
)

interface PreviewGalleryProps {
  initialRecipes: {
    body: RecipeBody
    created_at: string | null
    description: string
    id: number
    image_url: string | null
    ingredients: string
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'any'
    title: string
    user_id: string
  }[]
}

export default function PreviewGallery({
  initialRecipes,
}: PreviewGalleryProps) {
  const PAGE_COUNT = 8
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(1)
  const [loadedRecipes, setLoadedRecipes] = useState(initialRecipes)
  const [isInView, setIsInView] = useState(false)

  const handleScroll = () => {
    if (containerRef.current && typeof window !== 'undefined') {
      const container = containerRef.current
      const { bottom } = container.getBoundingClientRect()
      const { innerHeight } = window
      setIsInView((p) => bottom <= innerHeight)
    }
  }

  useEffect(() => {
    const loadMoreRecipes = async (offset: number) => {
      setOffset((prev) => prev + 1)
      const newRecipes = await fetchRecipes(offset)
      setLoadedRecipes((prevRecipes) => [...prevRecipes, ...newRecipes])
    }

    if (isInView) {
      loadMoreRecipes(offset)
    }
  }, [isInView])

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => handleScroll(), 100)
    window.addEventListener('scroll', handleDebouncedScroll)
    return () => {
      window.removeEventListener('scroll', handleDebouncedScroll)
    }
  }, [])

  const fetchRecipes = async (offset: number) => {
    const from = offset * PAGE_COUNT
    const to = from + PAGE_COUNT - 1

    const { data } = await supabase
      .from('recipes')
      .select('*')
      .eq('preview', true)
      .range(from, to)
      .order('created_at', { ascending: false })

    return data || []
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {loadedRecipes?.map((r, i) => {
        const recalculatedDelay =
          i >= PAGE_COUNT * 2 ? (i - PAGE_COUNT * (offset - 1)) / 5 : i / 5

        return (
          <motion.div
            layout
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.25, 0, 1],
              delay: recalculatedDelay,
            }}
          >
            <Link
              href={`recipe/${r?.id}/${r?.title
                .replace(/\s+/g, '-')
                .toLowerCase()}`}
            >
              <GalleryItem
                title={r?.title || ''}
                imageSrc={r?.image_url || ''}
              />
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
