import { UserProfile } from '@clerk/nextjs'

export default function UserPage() {
  return (
    <div className="grid place-items-center py-10">
      <UserProfile />
    </div>
  )
}
