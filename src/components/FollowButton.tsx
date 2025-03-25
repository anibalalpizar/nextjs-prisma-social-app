"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { toggleFollow } from "@/actions/user.action"

import { Button } from "./ui/button"

function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      await toggleFollow(userId)
      toast({
        title: "Success",
        description: "You are now following this user.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error following user:", error)
      toast({
        title: "Error",
        description: "Something went wrong while following the user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  )
}

export default FollowButton
