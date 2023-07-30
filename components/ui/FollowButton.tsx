'use client'

import { useState } from 'react'

import { notFound, useRouter } from 'next/navigation'

import { addFollower, removeFollower } from '@/utils/supabaseRequests'
import { useAuth } from '@clerk/nextjs'

import { Button } from './button'

interface FollowButtonProps {
  currentUserId: string
  followeeId: string
  followsInit: boolean
}

export default function FollowButton({
  currentUserId,
  followeeId,
  followsInit,
}: FollowButtonProps) {
  const { getToken } = useAuth()
  const [follows, setFollows] = useState(followsInit)
  const router = useRouter()

  return (
    <Button
      onClick={async () => {
        if (!currentUserId) {
          notFound()
        }
        const token = await getToken({ template: 'supabase' })
        if (!token) {
          notFound()
        }
        if (!follows) {
          addFollower({
            followerId: currentUserId,
            followeeId: followeeId,
            token: token,
          })
        } else {
          removeFollower({
            followerId: currentUserId,
            followeeId: followeeId,
            token: token,
          })
        }
        router.refresh()
        setFollows(!follows)
      }}
    >
      {`${follows ? 'Following' : 'Follow'}`}
    </Button>
  )
}
