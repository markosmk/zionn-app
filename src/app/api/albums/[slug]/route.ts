import { z } from "zod"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
})

export const maxDuration = 300

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    if (!params.slug || typeof params.slug !== "string") {
      throw new Error("Invalid parameter slug")
    }

    const album = await db.album.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
    if (!album) {
      return NextResponse.json(null, { status: 404 })
    }
    return NextResponse.json({ album }, { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    let message = "Unknown Error"
    if (error instanceof Error) message = error.message

    return NextResponse.json(message, { status: 500 })
  }
}
