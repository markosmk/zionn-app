import Link from "next/link"

import { Metadata } from "next"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import GoogleLoginForm from "@/components/google-login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Crea tu cuenta en " + process.env.NEXT_PUBLIC_APP_NAME,
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
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Volver
        </>
      </Link>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-heading font-extrabold">
            Crea tu Cuenta!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                o segui con
              </span>
            </div>
          </div>
          <GoogleLoginForm />
          <div className="my-4 text-center text-sm">
            ¿Ya ténes cuenta?{" "}
            <Link href="/login" className="underline">
              Ingresa!
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Al conectar tu cuenta, estás de acuerdo con nuestros{" "}
            <a
              href="/legal/terms"
              className="underline text-primary hover:text-indigo-500 transition-colors"
            >
              Terminos de Servicio
            </a>{" "}
            y{" "}
            <a
              href="/legal/privacy"
              className="underline text-primary hover:text-indigo-500 transition-colors"
            >
              Politica de Privacidad
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
