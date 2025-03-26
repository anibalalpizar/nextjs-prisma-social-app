"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getUserId } from "./user.action"

export async function createPost(content: string, image: string) {
  try {
    const userId = await getUserId()
    if (!userId) return

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    })

    revalidatePath("/")
    return { success: true, post }
  } catch (error) {
    return { success: false, error: `Failed to create post: ${error}` }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw new Error("Failed to fetch posts")
  }
}
