"use server"

import { revalidatePath } from "next/cache"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function syncUser() {
  try {
    const { userId } = await auth()

    const user = await currentUser()

    if (!userId || !user) return

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) return existingUser

    return await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    })
  } catch (error) {
    console.error("Error syncing user:", error)
  }
}

export async function getUser(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  })
}

export async function getUserId() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await getUser(userId)
  if (!user) throw new Error("User not found")

  return user.id
}

export async function getRandomUsers() {
  try {
    const userId = await getUserId()
    if (!userId) return []

    const randomUsers = await prisma.user.findMany({
      where: {
        NOT: { id: userId },
        AND: [{ NOT: { followers: { some: { followerId: userId } } } }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    })

    return randomUsers
  } catch (error) {
    console.error("Error fetching random users:", error)
    return []
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getUserId()
    if (!userId) return []

    if (userId === targetUserId) throw new Error("Cannot follow yourself")

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      })
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId,
          },
        }),
      ])
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return { success: false, error: "Failed to toggle follow" }
  }
}
