"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

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
  if (!userId) throw new Error("User not authenticated")

  const user = await getUser(userId)
  if (!user) throw new Error("User not found")

  return user.id
}
