import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { NextResponse } from "next/server"

const userCommentSchema = z.object({
  albumId: z.string(),
  body: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const data = userCommentSchema.parse(json)

    if (!data.albumId || typeof data.albumId !== "string") {
      throw new Error("Invalid ID")
    }

    // const { body } = req.body
    // const { albumId } = req.query
    // TODO query is for params, seee albums/slug/route.ts

    const comment = await db.comment.create({
      data: {
        body: data.body,
        userId: user?.id!,
        albumId: data.albumId,
      },
    })

    // save notification
    try {
      const album = await db.album.findUnique({
        where: {
          id: data.albumId,
        },
      })

      if (album?.userId) {
        await db.notification.create({
          data: {
            body: "Alguien dejo un comentario en tu publicacion!!",
            userId: album.userId,
          },
        })

        await db.user.update({
          where: { id: album.userId },
          data: { hasNotification: true },
        })
      }
    } catch (error) {
      console.log(error)
    }

    return NextResponse.json(
      { comment },
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
