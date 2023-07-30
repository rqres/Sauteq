import { ReactNode } from 'react'

import { getFollowerList, getFollowingList } from '@/utils/supabaseRequests'
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

export default async function FollowingSheet({
  user,
  children,
}: FollowersSheetProps) {
  const followings = await getFollowingList({ userId: user })

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Following</SheetTitle>
        </SheetHeader>
        <ul className="mt-8">
          {(followings === undefined || followings.length === 0) && (<SheetDescription>This user is following no one.</SheetDescription>)}
          {followings?.map(async (f) => (
            <Link href={`/${(await clerkClient.users.getUser(f.followee_id)).username}`}>
              <li key={f.followee_id} className="flex items-center gap-2 rounded-xl p-4 transition-colors ease-in-out hover:bg-stone-100 dark:hover:bg-stone-600/90">
                <Avatar>
                  <AvatarImage
                    src={
                      (await clerkClient.users.getUser(f.followee_id)).imageUrl
                    }
                  />
                </Avatar>
                <div className="flex flex-col">
                  <Label className="text-base">{`${
                    (await clerkClient.users.getUser(f.followee_id)).firstName
                  }`}</Label>
                  <Label className="text-sm font-light text-stone-500 dark:text-stone-400">{`@${
                    (await clerkClient.users.getUser(f.followee_id)).username
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
