import { Button } from '@/components/ui/button'

export const CreateAnotherButton = ({ loading }: { loading?: boolean }) => (
  <Button
    className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    disabled={loading}
    onClick={() => window.location.reload()}
  >
    <div className="flex justify-between gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-move-left"
      >
        <path d="M6 8L2 12L6 16" />
        <path d="M2 12H22" />
      </svg>
      Create another
    </div>
  </Button>
)
