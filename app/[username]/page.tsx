import { getUserRecipes } from '@/utils/supabaseRequests'
import { clerkClient } from '@clerk/nextjs'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { GalleryItem } from '@/components/PreviewGallery'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const user = (
    await clerkClient.users.getUserList({
      username: [params.username],
    })
  )[0]

  const userRecipes = await getUserRecipes({ userId: user.id })

  return (
    <div className="flex justify-center">
      <Card className="w-[400px] border-0 shadow-none sm:my-8 sm:w-[660px] sm:rounded-xl sm:border sm:border-stone-200 sm:shadow sm:dark:border-stone-800 md:w-[750px] lg:w-[960px] xl:w-[1250px]">
        <CardHeader className="grid grid-cols-4 grid-rows-3 items-center gap-x-8 md:gap-x-0">
          <Avatar className="col-span-1 row-span-2 h-20 w-20 place-self-center md:row-span-3 md:h-32 md:w-32">
            <AvatarImage src={user.imageUrl} />
          </Avatar>
          <div className="col-span-3 row-span-2 flex flex-col md:row-span-1">
            <CardTitle>{user.firstName + ' ' + user.lastName}</CardTitle>
            <CardDescription>@{user.username}</CardDescription>
          </div>
          <div className="hidden md:block">{userRecipes?.length} recipes</div>
          <div className="hidden md:block">0 followers</div>
          <div className="hidden md:block">0 following</div>
          <div className="col-span-4 md:col-span-3">
            Hello! My name is Rares and I love cooking.
          </div>
          <div className="col-span-4 flex items-center justify-between gap-8 md:hidden">
            <div>{userRecipes?.length} recipes</div>
            <div>0 followers</div>
            <div>0 following</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {userRecipes?.map((r) => (
              <GalleryItem
                title={r.title}
                description={r.body.description}
                imageSrc={r.image_url || ''}
                key={r.title}
                imageClassName="w-32 h-32"
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  )
}
