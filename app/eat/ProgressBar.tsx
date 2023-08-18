'use client'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { Progress } from '@/components/ui/progress'

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
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        transition: {
          type: 'spring',
          bounce: 0.25,
          opacity: { delay: 0.1 },
        },
      }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        duration: 2.0,
        type: 'spring',
        bounce: 0,
        opacity: { duration: 0.12 },
      }}
      className="mt-8 flex w-9/12 justify-center"
    >
      <Progress value={progress} className="w-5/6" />
    </motion.div>
  )
}
