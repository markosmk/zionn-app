import Link from "next/link"

import { Metadata } from "next"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { VerifyForm } from "./verify-form"

export const metadata: Metadata = {
  title: "Verificar Cuenta",
  description: "Verifica tu cuenta en " + process.env.NEXT_PUBLIC_APP_NAME,
}

export default async function Verify() {
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

      <VerifyForm />
    </div>
  )
}
