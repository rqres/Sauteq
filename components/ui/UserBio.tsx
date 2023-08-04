'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'

import { Textarea } from '@/components/ui/textarea'

import { Button } from './button'

interface UserBioProps {
  editable: boolean
  metadata: UserUnsafeMetadata
}

export default function UserBio({ editable, metadata }: UserBioProps) {
  const [editing, setEditing] = useState(false)
  const [textValue, setTextValue] = useState(metadata.bio as string)
  const { isLoaded, isSignedIn, user } = useUser()

  console.log(user)
  const handleSubmit = () => {
    try {
      user?.update({
        unsafeMetadata: {
          bio: textValue,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (!editable || !isLoaded || !isSignedIn) {
    return <p>{metadata.bio !== undefined ? String(metadata.bio) : ''}</p>
  }

  return (
    <>
      {editing && (
        <div className="flex gap-2">
          <Textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Tell us something about yourself..."
          />
          <Button
            onClick={() => {
              handleSubmit()
              setEditing(false)
            }}
          >
            Done
          </Button>
        </div>
      )}
      {!editing &&
        user.unsafeMetadata.bio !== undefined &&
        user.unsafeMetadata.bio !== '' && (
          <p
            className="-ml-2 rounded-md border-2 border-stone-200/0 px-2 py-4 transition-colors ease-in-out hover:border-stone-200/100 dark:border-stone-800/0 hover:dark:border-stone-800/100"
            onClick={() => setEditing(true)}
          >
            {String(user.unsafeMetadata.bio)}
          </p>
        )}
      {!editing &&
        (user.unsafeMetadata.bio === undefined ||
          user.unsafeMetadata.bio === '') && (
          <p
            onClick={() => setEditing(true)}
            className="-ml-2 rounded-md border-2 border-stone-200/0 px-2 py-4 text-stone-500 transition-colors ease-in-out hover:border-stone-200/100 dark:border-stone-800/0 dark:text-stone-400 hover:dark:border-stone-800/100"
          >
            Add a bio
          </p>
        )}
    </>
  )
}
