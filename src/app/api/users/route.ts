import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
