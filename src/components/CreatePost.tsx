"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react"
import { createPost } from "@/actions/post.action"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import ImageUpload from "./ImageUpload"

function CreatePost() {
  const [content, setcontent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const { user } = useUser()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return
    setIsPosting(true)

    try {
      const result = await createPost(content, imageUrl)

      if (result.success) {
        setcontent("")
        setImageUrl("")
        setShowImageUpload(false)
        toast({
          title: "Post created",
          description: "Your post has been created successfully.",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      })
      console.error("Error creating post:", error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl} alt="User Avatar" />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="max-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
              disabled={isPosting}
            />
          </div>
          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url)
                  if (!url) setShowImageUpload(false)
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost
