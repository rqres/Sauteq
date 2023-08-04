import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  checkFollower,
  getFollowerCount,
  getFollowingCount,
  getUserFavoriteRecipes,
} from '@/utils/supabaseRequests'
import { auth, clerkClient } from '@clerk/nextjs'

import { cn } from '@/lib/utils'

import FollowButton from '@/components/ui/FollowButton'
import UserBio from '@/components/ui/UserBio'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import FollowersSheet from '@/components/FollowersSheet'
import FollowingSheet from '@/components/FollowingSheet'
import { GalleryItem } from '@/components/PreviewGallery'

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

  const userRecipes = await getUserFavoriteRecipes({ userId: user.id })
  const followerCount = await getFollowerCount({ userId: user.id })
  const followingCount = await getFollowingCount({ userId: user.id })

  return (
    <div className="flex justify-center">
      <Card className="w-[400px] border-0 shadow-none sm:my-8 sm:w-[620px] sm:rounded-xl sm:border sm:border-stone-200 sm:shadow sm:dark:border-stone-800 md:w-[750px] lg:w-[960px] xl:w-[1250px]">
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
              {user.firstName + ' ' + user.lastName}
            </CardTitle>
            <CardDescription className="text-md md:text-xl lg:text-2xl">
              @{user.username}
            </CardDescription>
          </div>
          {currentUserId !== null && currentUserId !== user.id && (
            <div className="col-span-2 row-span-1 self-center sm:col-span-1 sm:row-span-2 md:row-span-1">
              <FollowButton
                currentUserId={currentUserId}
                followeeId={user.id}
                followsInit={followsInit}
              />
            </div>
          )}
          <div className="hidden font-medium md:block">
            {userRecipes?.length} recipe
            {userRecipes && userRecipes.length !== 1 && <span>s</span>}
          </div>
          <FollowersSheet user={user.id}>
            <div className="hidden cursor-pointer font-medium md:block">
              {followerCount} follower
              {followerCount !== 1 && <span>s</span>}
            </div>
          </FollowersSheet>

          <FollowingSheet user={user.id}>
            <div className="hidden cursor-pointer font-medium md:block">
              {followingCount} following
            </div>
          </FollowingSheet>

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
              {userRecipes?.length} recipe
              {userRecipes && userRecipes.length !== 1 && <span>s</span>}
            </div>

            <FollowersSheet user={user.id}>
              <div className="cursor-pointer">
                {followerCount} follower
                {followerCount !== 1 && <span>s</span>}
              </div>
            </FollowersSheet>

            <FollowingSheet user={user.id}>
              <div className="cursor-pointer">{followingCount} following</div>
            </FollowingSheet>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {userRecipes?.map((r) => (
              <Link
                href={`r/${r?.id}/${r?.title
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
              >
                <GalleryItem
                  title={r?.title || ''}
                  description={r?.body.description || ''}
                  imageSrc={r?.image_url || ''}
                  key={r?.title}
                  imageClassName="w-32 h-32"
                />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
