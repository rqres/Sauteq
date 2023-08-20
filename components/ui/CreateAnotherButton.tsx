import { Button } from '@/components/ui/button'

import { Icons } from '../icons'

export const CreateAnotherButton = ({ loading }: { loading?: boolean }) => (
  <Button
    className={`${
      loading ? 'cursor-not-allowed' : 'cursor-pointer'
    } py-2 md:py-0 md:text-sm`}
    disabled={loading}
    onClick={() => window.location.reload()}
  >
    <Icons.back />
    <div className="flex items-center justify-between gap-2">
      Change ingredients
    </div>
  </Button>
)
