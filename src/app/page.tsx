import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import React from "react"

function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-red-500">Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default Home
