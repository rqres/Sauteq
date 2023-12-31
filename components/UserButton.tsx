'use client'

import Link from 'next/link'

import { SignOutButton, useUser } from '@clerk/nextjs'

import { Avatar, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function UserButton() {
  const { isLoaded, user } = useUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          {isLoaded && <AvatarImage src={user?.imageUrl} />}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-56">
        <DropdownMenuLabel>{user?.fullName || ''}</DropdownMenuLabel>
        <DropdownMenuLabel className="-mt-3 text-sm font-light text-gray-500">
          @{user?.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/${user?.username}`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={'/history'}>
            <DropdownMenuItem>History</DropdownMenuItem>
          </Link>
          <Link href={'/favorites'}>
            <DropdownMenuItem>Favorites</DropdownMenuItem>
          </Link>
          <Link href={'/settings'}>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <button className="w-full text-start">Sign out</button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
