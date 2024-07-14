import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function GET(
  request: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!params.userId || typeof params.userId !== "string") {
      throw new Error("Invalid parameter")
    }

    const existingUser = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    })

    const followersCount = await db.user.count({
      where: {
        followingIds: {
          has: params.userId,
        },
      },
    })

    return NextResponse.json({ ...existingUser, followersCount })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
