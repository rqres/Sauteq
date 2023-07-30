import { ReactNode } from 'react'

import { getFollowerList } from '@/utils/supabaseRequests'
import { clerkClient } from '@clerk/nextjs'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Avatar, AvatarImage } from './ui/avatar'
import { Label } from './ui/label'
import Link from 'next/link'

interface FollowersSheetProps {
  user: string
  children: ReactNode
}

export default async function FollowersSheet({
  user,
  children,
}: FollowersSheetProps) {
  const followers = await getFollowerList({ userId: user })

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Followers</SheetTitle>
        </SheetHeader>
        <ul className="mt-8">
          {(followers === undefined || followers.length === 0) && (<SheetDescription>This user has no followers.</SheetDescription>)}
          {followers?.map(async (f) => (
            <Link href={`/${(await clerkClient.users.getUser(f.follower_id)).username}`}>
              <li key={f.follower_id} className="flex items-center gap-2 rounded-xl p-4 transition-colors ease-in-out hover:bg-stone-100 dark:hover:bg-stone-600/90">
                <Avatar>
                  <AvatarImage
                    src={
                      (await clerkClient.users.getUser(f.follower_id)).imageUrl
                    }
                  />
                </Avatar>
                <div className="flex flex-col">
                  <Label className="text-base">{`${
                    (await clerkClient.users.getUser(f.follower_id)).firstName
                  }`}</Label>
                  <Label className="text-sm font-light text-stone-500 dark:text-stone-400">{`@${
                    (await clerkClient.users.getUser(f.follower_id)).username
                  }`}</Label>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
