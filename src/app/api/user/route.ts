import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  bio: z.string(),
  image: z.string(),
  coverImage: z.string(),
})

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    const data = await userSchema.parseAsync(json)

    const { name, username, bio, image, coverImage } = data

    const updatedUser = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
        username,
        bio,
        image,
        //   coverImage,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
