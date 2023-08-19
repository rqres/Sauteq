import { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface AnimatedIngredientItemProps {
  children: ReactNode
  className?: string
}

let base = 4
let t = (d: number) => d * base

export function AnimatedIngredientItem({
  children,
  className,
}: AnimatedIngredientItemProps) {
  return (
    <motion.div
      layout
      className={cn('relative', className)}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        transition: {
          type: 'spring',
          bounce: 0.25,
          opacity: { delay: t(0.025) },
        },
      }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        duration: t(0.15),
        type: 'spring',
        bounce: 0,
        opacity: { duration: t(0.03) },
      }}
    >
      {children}
    </motion.div>
  )
}
