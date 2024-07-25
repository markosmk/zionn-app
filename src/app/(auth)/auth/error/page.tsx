"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertMessage } from "@/components/alert-message"
import { errorsAuth } from "@/config/errors"

export default function ErrorAuthPage() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (errorParam && errorParam in errorsAuth) {
      setError(errorsAuth[errorParam as keyof typeof errorsAuth])
    } else {
      setError(errorsAuth.Default)
    }
  }, [errorParam])

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

      <Card className="mx-auto w-full sm:w-96">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-heading font-extrabold">Ups Error!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && <AlertMessage variant="destructive">{error}</AlertMessage>}
            <Link href="/login" className={cn(buttonVariants(), "w-full")}>
              Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
