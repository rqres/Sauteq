import { UserProfile } from '@clerk/nextjs'

export default function UserPage() {
  return (
    <div className="px-20 py-10">
      <UserProfile />
    </div>
  )
}
