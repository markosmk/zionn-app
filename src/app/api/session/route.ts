import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth()
  // return NextResponse.json({
  //   authenticated: !!session,
  //   session,
  // })
  return NextResponse.json(session ? session : false)
}
