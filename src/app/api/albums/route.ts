import * as z from "zod"

import { db } from "@/lib/db"
import { slugify } from "@/lib/slug/slugify"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const albumCreateSchema = z.object({
  title: z.string(),
  body: z.string(),
})

// TODO: must be public?
export async function GET(request: Request) {
  try {
    // const session = await auth()

    // if (!session) {
    //   return NextResponse.json("Unauthorized", { status: 403 })
    // }

    // const { user } = session

    const albums = await db.album.findMany({
      // where: {
      //   userId: user?.id && typeof user?.id === 'string' ? user?.id : undefined,
      // },
      include: { user: true, comments: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ albums })
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }
    const { user } = session

    const json = await req.json()
    const data = albumCreateSchema.parse(json)

    const album = await db.album.create({
      data: {
        title: data.title,
        body: data.body,
        slug: slugify(data.title),
        userId: user?.id!,
      },
    })
    return NextResponse.json({ album }, { status: 201 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
