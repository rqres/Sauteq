'use client';

import { useRef, useState } from 'react';



import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { SignInButton } from '@clerk/nextjs'
import {
  Bookmark,
  FacebookIcon,
  Link,
  Mail,
  Printer,
  RefreshCcw,
  Share,
  TwitterIcon,
} from 'lucide-react'
import whatsappIcon from 'public/whatsapp.svg'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { useReactToPrint } from 'react-to-print'

import { RecipeBody } from '@/types/recipe'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { bookmarkRecipe } from '@/app/actions'

import RecipeSheet from './RecipeSheet'
import { CreateAnotherButton } from './ui/CreateAnotherButton'
import { ToastAction } from './ui/toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { useToast } from './ui/use-toast'

interface RecipeMenubarProps {
  recipeId: number
  regen?: () => Promise<void>
  loading?: boolean
  noRegen?: boolean
  initialBookmark: boolean
  noReturnButton?: boolean
  title?: string
  body?: RecipeBody
  image?: string
}

export default function RecipeMenubar({
  recipeId,
  regen,
  loading,
  noRegen,
  initialBookmark,
  noReturnButton,
  title,
  body,
  image,
}: RecipeMenubarProps) {
  const [isBookmark, setBookmark] = useState<boolean>(initialBookmark)
  const { toast } = useToast()
  const pathname = usePathname()
  const currentURL = `https://www.domainname.com${pathname}`

  const cardRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.toString())
  }

  return (
    <Menubar
      className={`ml-5 mr-3 mt-6 ${
        noReturnButton ? 'justify-end' : 'justify-between'
      }`}
    >
      <div className="hidden">
        <RecipeSheet
          ref={cardRef}
          recipeId={recipeId}
          title={title || ''}
          body={body || null}
          image={image || ''}
          initialBookmark={false}
          noMenuBar
          noReturnButton
          className="border-0 shadow-none"
        />
      </div>
      {!noReturnButton && <CreateAnotherButton loading={loading} />}
      <div className="flex">
        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  onClick={handlePrint}
                  disabled={loading}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <Printer />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarMenu>
        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  disabled={loading}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <Share />
                </MenubarTrigger>
              </TooltipTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={copyToClipboard}
                  className="flex w-full items-center justify-between"
                >
                  Copy
                  <Link />
                </MenubarItem>
                <MenubarItem>
                  <FacebookShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI!`}
                    hashtag="#recipe"
                    url={currentURL}
                  >
                    Facebook
                    <FacebookIcon />
                  </FacebookShareButton>
                </MenubarItem>
                <MenubarItem>
                  <TwitterShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI!`}
                    hashtags={['recipe']}
                    url={currentURL}
                    via="recipeAI"
                  >
                    Twitter
                    <TwitterIcon />
                  </TwitterShareButton>
                </MenubarItem>
                <MenubarItem>
                  <WhatsappShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI!`}
                    url={currentURL}
                  >
                    WhatsApp
                    <Image src={whatsappIcon} alt={'Share on whatsapp'} />
                  </WhatsappShareButton>
                </MenubarItem>
                <MenubarItem>
                  <EmailShareButton
                    className="flex w-full items-center justify-between"
                    subject="AI Recipe Discovery"
                    body={`I just learned how to cook ${title} thanks to AI!`}
                    url={currentURL}
                  >
                    Email
                    <Mail />
                  </EmailShareButton>
                </MenubarItem>
              </MenubarContent>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarMenu>
        {!noRegen && (
          <MenubarMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenubarTrigger
                    onClick={async () => {
                      if (regen) {
                        setBookmark(false)
                        await regen()
                      }
                    }}
                    className={`${
                      loading
                        ? 'animate-spin cursor-not-allowed hover:bg-transparent'
                        : 'animate-none cursor-pointer'
                    }`}
                    disabled={loading}
                  >
                    <RefreshCcw />
                  </MenubarTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate with same ingredients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </MenubarMenu>
        )}
        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  onClick={async () => {
                    const res = await bookmarkRecipe(recipeId, isBookmark)
                    if (res == -1) {
                      toast({
                        title: 'Uh oh! Something went wrong.',
                        description: 'You must sign in to save recipes.',
                        action: (
                          <SignInButton>
                            <ToastAction altText="Sign in">Sign in</ToastAction>
                          </SignInButton>
                        ),
                      })
                      return
                    }
                    setBookmark(!isBookmark)
                  }}
                  disabled={loading}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <Bookmark
                    className={`${
                      isBookmark
                        ? 'fill-black dark:fill-white'
                        : 'fill-transparent'
                    } transition`}
                  />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorite recipe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </MenubarMenu>
      </div>
    </Menubar>
  )
}