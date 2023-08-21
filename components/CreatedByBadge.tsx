import Link from 'next/link'

import { cn } from '@/lib/utils'

import { badgeVariants } from '@/components/ui/badge'

import { Avatar, AvatarImage } from './ui/avatar'

interface CreatedByBadgeProps {
  username: string
  avatarSrc?: string
}

export default function CreatedByBadge({
  username,
  avatarSrc,
}: CreatedByBadgeProps) {
  return (
    <p className="flex items-center gap-2">
      Created by
      <div className="flex gap-1">
        {avatarSrc !== undefined && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarSrc}></AvatarImage>
          </Avatar>
        )}
        <Link
          className={cn(
            badgeVariants({ variant: 'outline' }),
            'gradient-button text-stone-800 dark:text-stone-800'
          )}
          href={`/${username}`}
        >
          {username}
        </Link>
      </div>
    </p>
  )
}
