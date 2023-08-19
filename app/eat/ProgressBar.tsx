'use client'

import { useEffect, useState } from 'react'

import { Progress } from '@/components/ui/progress'

import { AnimatedIngredientItem } from '@/components/AnimatedIngredientItem'

interface ProgressBarProps {
  progress: number
}
export function ProgressBar({ progress }: ProgressBarProps) {
  const [hidden, setHidden] = useState<boolean>(false)

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setHidden(true)
      }, 1000)
    } else {
      setHidden(false)
    }
  }, [progress])

  if (hidden) return null

  return (
    <AnimatedIngredientItem className="mt-12 flex w-9/12 justify-center md:mt-8">
      <Progress value={progress} className="w-5/6" />
    </AnimatedIngredientItem>
  )
}
