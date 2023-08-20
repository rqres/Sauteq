import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import {
  checkFollower,
  getFollowerCount,
  getFollowingCount,
  getUserFavRecipeCount,
} from '@/utils/supabaseRequests'
import { auth, clerkClient } from '@clerk/nextjs'
import { Loader } from 'lucide-react'

import { cn } from '@/lib/utils'

import FollowButton from '@/components/ui/FollowButton'
import UserBio from '@/components/ui/UserBio'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import FollowersSheet from '@/components/FollowersSheet'
import FollowingSheet from '@/components/FollowingSheet'

import UserCardContent from './UserCardContent'
import UserCardContentSkeleton from './UserCardContentSkeleton'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const { userId: currentUserId } = auth()
  const user = (
    await clerkClient.users.getUserList({
      username: [params.username],
    })
  )[0]

  if (user === undefined) {
    notFound()
  }

  const followsInit = await checkFollower({
    followerId: currentUserId!,
    followeeId: user.id,
  })

  const followerCount = await getFollowerCount({ userId: user.id })
  const followingCount = await getFollowingCount({ userId: user.id })
  const userRecipeCount = await getUserFavRecipeCount({ userId: user.id })

  return (
    <div className="flex justify-center">
      <Card className="w-[400px] border-0 shadow-none dark:bg-transparent sm:my-8 sm:w-[620px] sm:rounded-xl sm:border sm:border-stone-200 sm:shadow sm:dark:border-stone-800 sm:dark:bg-stone-950 md:w-[750px] lg:w-[960px] xl:w-[1250px]">
        <CardHeader className="grid grid-cols-3 grid-rows-3 items-center gap-x-8 px-10 sm:grid-cols-4">
          <Avatar className="col-span-1 row-span-2 h-20 w-20 self-center md:row-span-3 md:h-40 md:w-40 lg:h-40 lg:w-40">
            <AvatarImage src={user.imageUrl} />
          </Avatar>
          <div
            className={cn(
              'col-span-2 row-span-2 self-center sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-1',
              currentUserId !== null &&
                currentUserId !== user.id &&
                'md:col-span-2'
            )}
          >
            <CardTitle className="text-xl md:text-2xl lg:text-4xl">
              {user.firstName !== null && user.firstName}{' '}
              {user.lastName !== null && user.lastName}
            </CardTitle>
            <CardDescription className="text-md md:text-xl lg:text-2xl">
              @{user.username}
            </CardDescription>
          </div>
          {currentUserId !== null && currentUserId !== user.id && (
            <div className="col-span-3 row-span-1 -mr-9 place-self-end sm:col-span-1 sm:row-span-2 sm:mr-0 sm:place-self-auto sm:self-center md:row-span-1">
              <FollowButton
                currentUserId={currentUserId}
                followeeId={user.id}
                followsInit={followsInit}
              />
            </div>
          )}
          <div className="hidden font-medium md:block">
            {userRecipeCount} recipe
            {userRecipeCount !== 1 && <span>s</span>}
          </div>
          <Suspense
            fallback={
              <div
                className={`hidden cursor-pointer font-medium md:block ${
                  followerCount > 0 ? 'underline' : 'no-underline'
                }`}
              >
                {followerCount} follower
                {followerCount !== 1 && <span>s</span>}
              </div>
            }
          >
            {/* @ts-expect-error Server Component */}
            <FollowersSheet user={user.id}>
              <div
                className={`hidden cursor-pointer font-medium md:block ${
                  followerCount > 0 ? 'underline' : 'no-underline'
                }`}
              >
                {followerCount} follower
                {followerCount !== 1 && <span>s</span>}
              </div>
            </FollowersSheet>
          </Suspense>

          <Suspense
            fallback={
              <div
                className={`hidden cursor-pointer font-medium md:block ${
                  followingCount > 0 ? 'underline' : 'no-underline'
                }`}
              >
                {followingCount} following
              </div>
            }
          >
            {/* @ts-expect-error Server Component */}
            <FollowingSheet user={user.id}>
              <div
                className={`hidden cursor-pointer font-medium md:block ${
                  followingCount > 0 ? 'underline' : 'no-underline'
                }`}
              >
                {followingCount} following
              </div>
            </FollowingSheet>
          </Suspense>

          {!(
            currentUserId !== null &&
            currentUserId !== user.id &&
            (user.unsafeMetadata.bio === '' ||
              user.unsafeMetadata.bio === undefined)
          ) && (
            <div className="col-span-4 md:col-span-3">
              <UserBio
                editable={
                  !(currentUserId !== null && currentUserId !== user.id)
                }
                metadata={user.unsafeMetadata}
              />
            </div>
          )}
          <div className="col-span-4 flex items-center justify-between gap-8 font-medium md:hidden">
            <div>
              {userRecipeCount} recipe
              {userRecipeCount !== 1 && <span>s</span>}
            </div>

            <Suspense
              fallback={
                <div
                  className={`cursor-pointer ${
                    followerCount > 0 ? 'underline' : 'no-underline'
                  }`}
                >
                  {followerCount} follower
                  {followerCount !== 1 && <span>s</span>}
                </div>
              }
            >
              {/* @ts-expect-error Server Component */}
              <FollowersSheet user={user.id}>
                <div
                  className={`cursor-pointer ${
                    followerCount > 0 ? 'underline' : 'no-underline'
                  }`}
                >
                  {followerCount} follower
                  {followerCount !== 1 && <span>s</span>}
                </div>
              </FollowersSheet>
            </Suspense>

            <Suspense
              fallback={
                <div
                  className={`cursor-pointer ${
                    followingCount > 0 ? 'underline' : 'no-underline'
                  }`}
                >
                  {followingCount} following
                </div>
              }
            >
              {/* @ts-expect-error Server Component */}
              <FollowingSheet user={user.id}>
                <div
                  className={`cursor-pointer ${
                    followingCount > 0 ? 'underline' : 'no-underline'
                  }`}
                >
                  {followingCount} following
                </div>
              </FollowingSheet>
            </Suspense>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UserCardContentSkeleton />}>
            {/* @ts-expect-error Server Component */}
            <UserCardContent userId={user.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
