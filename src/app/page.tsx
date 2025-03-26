import { currentUser } from "@clerk/nextjs/server"
import { getPosts } from "@/actions/post.action"
import { getUserId } from "@/actions/user.action"

import CreatePost from "@/components/CreatePost"
import WhoToFollow from "@/components/WhoToFollow"
import PostCard from "@/components/PostCard"

async function Home() {
  const user = await currentUser()
  const posts = await getPosts()
  const userId = await getUserId()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} userId={userId} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  )
}

export default Home
