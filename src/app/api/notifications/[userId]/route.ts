import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const { user } = session

    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // TODO: params is not necesary, because notifications must be for the current user in session
    if (!params.userId || typeof params.userId !== "string") {
      throw new Error("Invalid parameter")
    }

    const notifications = await db.notification.findMany({
      where: { userId: user?.id },
      orderBy: {
        createdAt: "desc",
      },
    })

    await db.user.update({
      where: { id: user?.id },
      data: { hasNotification: false },
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}
