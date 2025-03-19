import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/ModeToggle"

function Home() {
  return (
    <div className="mt-4">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
      <Button variant="secondary">Click me</Button>
    </div>
  )
}

export default Home
