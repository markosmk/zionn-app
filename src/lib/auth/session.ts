import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

// for server side
export async function getCurrentUser() {
  // const session = await auth()
  // if (!session) return redirect("/login")

  const session = await auth()
  // if (!session?.user) {
  //   redirect("/")
  // }

  return session?.user
}
