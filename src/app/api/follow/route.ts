import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { NextResponse } from "next/server"

const userFollowSchema = z.object({
  userId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const data = userFollowSchema.parse(json)

    if (!data.userId || typeof data.userId !== "string") {
      throw new Error("Invalid ID")
    }

    // 1) search data user
    const userDb = await db.user.findUnique({
      where: {
        id: data.userId,
      },
    })

    if (!userDb) throw new Error("Invalid ID")

    // 2) separe list of usersId of user
    let updatedFollowingIds = [...(userDb.followingIds || [])]

    // 3) update list of following
    updatedFollowingIds.push(data.userId)

    // save notification
    // use other try to not throw error
    try {
      await db.notification.create({
        data: {
          body: "Alguien te sigue!",
          userId: data.userId,
        },
      })

      await db.user.update({
        where: { id: data.userId },
        data: { hasNotification: true },
      })
    } catch (error) {
      console.log(error)
    }

    // 4) finally save the list of users I follow
    const updatedUser = await db.user.update({
      where: { id: user?.id! },
      data: { followingIds: updatedFollowingIds },
    })

    return NextResponse.json(
      { user: updatedUser },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const data = userFollowSchema.parse(json)

    if (!data.userId || typeof data.userId !== "string") {
      throw new Error("Invalid ID")
    }

    // 1) search data user
    const userDb = await db.user.findUnique({
      where: {
        id: data.userId,
      },
    })

    if (!userDb) throw new Error("Invalid ID")

    // 2) separe list of usersId of user
    let updatedFollowingIds = [...(userDb.followingIds || [])]

    // 3) update list of following
    updatedFollowingIds = updatedFollowingIds.filter(
      (followingUserId) => followingUserId !== data.userId
    )

    // 4) finally save the list of users I follow
    const updatedUser = await db.user.update({
      where: { id: user?.id! },
      data: { followingIds: updatedFollowingIds },
    })

    return NextResponse.json(
      { user: updatedUser },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
