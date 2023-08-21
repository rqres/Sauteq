'use client'

import { useRef, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { bookmarkRecipe } from '@/utils/supabaseRequests'
import { SignInButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  Bookmark,
  Facebook,
  Link as LinkIcon,
  Loader,
  Mail,
  Printer,
  RefreshCcw,
  Share,
  Twitter,
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

import CreatedByBadge from './CreatedByBadge'
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
  recipeId: number | null
  regen?: () => Promise<void>
  loading?: boolean
  noRegen?: boolean
  initialBookmark: boolean
  noReturnButton?: boolean
  title?: string
  body?: RecipeBody | string
  description?: string
  image?: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
  bookmarkCount?: number
  creatorUsername?: string
  creatorAvatar?: string
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
  description,
  image,
  mealType,
  bookmarkCount,
  creatorUsername,
  creatorAvatar,
}: RecipeMenubarProps) {
  const router = useRouter()
  const [isBookmark, setBookmark] = useState<boolean>(initialBookmark)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const { toast } = useToast()
  const currentURL = `${
    process.env.NEXT_PUBLIC_DOMAIN_NAME
  }/recipe/${recipeId}/${title?.replace(/\s+/g, '-').toLowerCase()}`

  const cardRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentURL)
  }

  return (
    <Menubar
      className={`ml-5 mr-3 mt-6 h-auto ${
        noReturnButton && creatorUsername === undefined
          ? 'justify-end'
          : 'justify-between'
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
          className="ml-6 mt-12 border-0 shadow-none sm:border-0 sm:shadow-none md:border-0 md:shadow-none"
          mealType={mealType}
          description={description || ''}
        />
      </div>
      {!noReturnButton && <CreateAnotherButton loading={loading} />}
      {creatorUsername !== undefined && (
        <CreatedByBadge username={creatorUsername} avatarSrc={creatorAvatar} />
      )}
      <div className="flex">
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
                  onClick={() => {
                    copyToClipboard()
                    toast({
                      description: 'Copied to clipboard!',
                    })
                  }}
                  className="flex w-full items-center justify-between"
                >
                  Copy
                  <LinkIcon />
                </MenubarItem>
                <MenubarItem>
                  <FacebookShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI!`}
                    hashtag="#Sauteq"
                    url={currentURL}
                  >
                    Facebook
                    <Facebook />
                  </FacebookShareButton>
                </MenubarItem>
                <MenubarItem>
                  <TwitterShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI!`}
                    hashtags={['Sauteq', 'AIChef', 'recipe']}
                    url={currentURL}
                    via="Sauteq"
                  >
                    Twitter
                    <Twitter />
                  </TwitterShareButton>
                </MenubarItem>
                <MenubarItem>
                  <WhatsappShareButton
                    className="flex w-full items-center justify-between"
                    title={`I just learned how to cook ${title} thanks to AI! Check it out here`}
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
                    body={`I just learned how to cook ${title} thanks to AI! Check it out here`}
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

        <MenubarMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  onClick={async () => {
                    if (!recipeId) {
                      console.error('no recipe to bookmark')
                      return
                    }
                    setBookmarkLoading(true)
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
                    setBookmarkLoading(false)
                    setBookmark(!isBookmark)
                    router.refresh()
                  }}
                  disabled={loading || !recipeId}
                  className={`${
                    loading
                      ? 'cursor-not-allowed hover:bg-transparent'
                      : 'cursor-pointer'
                  }
                  ${
                    (!recipeId || loading)
                      ? 'cursor-wait hover:bg-transparent'
                      : 'cursor-pointer'
                  }`}
                >
                  <motion.div layout>
                    <Bookmark
                      className={`${
                        isBookmark
                          ? 'fill-black dark:fill-white'
                          : 'fill-transparent'
                      } transition`}
                    />
                  </motion.div>
                  {bookmarkCount !== undefined &&
                    bookmarkCount !== 0 &&
                    bookmarkCount}
                  {bookmarkLoading && (
                    <Loader size={12} className="animate-spin" />
                  )}
                  {(!recipeId || loading) && (
                    <Loader size={12} className="animate-spin md:hidden" />
                  )}
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
