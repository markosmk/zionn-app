import Link from "next/link"

import { Metadata } from "next"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { AuthSection } from "@/components/auth/auth-section"

export const metadata: Metadata = {
  title: "Iniciar Sesion",
  description: "Ingresa a tu cuenta y comenza a compartir tus mezclas.",
}

export default async function Login() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/me")
  }

  return (
    <div className="w-full h-screen flex items-center justify-center px-4 theme-zinc">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "secondary" }), "absolute left-4 top-4 md:left-8 md:top-8")}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Volver
        </>
      </Link>

      <AuthSection currentContent="login" type="card" />
    </div>
  )
}
