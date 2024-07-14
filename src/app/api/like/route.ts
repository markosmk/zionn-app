import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { NextResponse } from "next/server"

const albumLikeSchema = z.object({
  albumId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const data = albumLikeSchema.parse(json)

    if (!data.albumId || typeof data.albumId !== "string") {
      throw new Error("Invalid ID")
    }

    const album = await db.album.findUnique({
      where: {
        id: data.albumId,
      },
    })

    if (!album || !album?.userId) {
      throw new Error("Invalid ID")
    }

    let updatedLikedIds = [...(album.likedIds || [])]

    updatedLikedIds.push(user?.id!)

    const updatedAlbum = await db.album.update({
      where: {
        id: data.albumId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    })

    // save notification
    if (album?.userId) {
      await db.notification.create({
        data: {
          body: "¡A alguien le gusto tu música!",
          userId: album.userId,
        },
      })

      await db.user.update({
        where: { id: album.userId },
        data: { hasNotification: true },
      })
    }

    return NextResponse.json(
      { album: updatedAlbum },
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
    const data = albumLikeSchema.parse(json)

    if (!data.albumId || typeof data.albumId !== "string") {
      throw new Error("Invalid ID")
    }

    const album = await db.album.findUnique({
      where: {
        id: data.albumId,
      },
    })

    if (!album || !album?.userId) {
      throw new Error("Invalid ID")
    }

    let updatedLikedIds = [...(album.likedIds || [])]

    updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== user?.id)

    const updatedAlbum = await db.album.update({
      where: {
        id: data.albumId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    })

    return NextResponse.json(
      { album: updatedAlbum },
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
