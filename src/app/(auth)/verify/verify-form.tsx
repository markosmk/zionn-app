"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { AlertMessage } from "@/components/alert-message"

import { cn } from "@/lib/utils"
import { authVerifySchema } from "@/lib/validations/auth"

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof authVerifySchema>

export const VerifyForm = ({ className }: Props) => {
  const route = useRouter()
  const params = useSearchParams()

  // for form
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")

  // for page
  const [checking, setChecking] = React.useState(true)
  const [hasAllParams, setHasAllParams] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(authVerifySchema),
    defaultValues: {
      identifier: "",
      code: "",
    },
  })

  const verifyAccount = async ({ identifier, code }: FormData) => {
    setSuccess("")
    setError("")
    try {
      setIsPending(true)
      const response = await axios.post("/api/verify", { identifier, code })
      if (response) {
        if (!hasAllParams) form.reset()
        setSuccess("Tu cuenta fue verificada correctamente, puedes iniciar sesion")
      }
    } catch (error: unknown) {
      if (!hasAllParams) form.setValue("code", "")
      let message = "Error al verificar tu cuenta"
      if (axios.isAxiosError(error) && error.response?.data.message) {
        message = error.response.data.message
      }
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  React.useEffect(() => {
    if (params.size === 0) {
      setChecking(false)
      return
    }
    const identifier = params.get("identifier")
    const code = params.get("code")
    if (identifier && code) {
      setChecking(false)
      setHasAllParams(true)
      verifyAccount({ identifier, code })
    } else {
      setChecking(false)
      form.setValue("identifier", identifier ?? "")
      form.setValue("code", code ?? "")
    }
  }, [params.size])

  if (checking) return null

  if (hasAllParams) {
    if (isPending)
      return (
        <Card className="mx-auto w-full sm:w-96">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-heading font-extrabold">Verificando...🤞🫣</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Icons.loading className="mx-auto text-indigo-500 h-10 w-10" />
              <p className="mt-2 text-sm text-muted-foreground"></p>
            </div>
          </CardContent>
        </Card>
      )
    return (
      <Card className="mx-auto w-full sm:w-96">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-heading font-extrabold">
            {error ? "Error! ⏰ 🤔" : "Listo! 🫵 🥳"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && <AlertMessage variant="destructive">{error}</AlertMessage>}
            {success && <AlertMessage variant="success">{success}</AlertMessage>}
            <Button type="submit" className="w-full" onClick={() => route.replace("/login")}>
              Ingresar
            </Button>
            {error && (
              <Button
                type="button"
                className="w-full"
                variant={"outline"}
                onClick={() => {
                  setHasAllParams(false)
                  setError("")
                  route.push("/verify")
                  form.reset()
                }}
              >
                Intentar Manualmente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card className="mx-auto w-full sm:w-96">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-heading font-extrabold">
            {success ? "Listo! 🫵 🥳" : "Falta Poco! 👋 🥹"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(verifyAccount)} className={cn("space-y-4", success ? "hidden" : "")}>
              <div
                className={cn("grid gap-y-4", className, isPending ? "pointer-events-none opacity-50 select-none" : "")}
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario@zionnmix.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codigo</FormLabel>
                      <FormControl>
                        <Input placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && <AlertMessage variant="destructive">{error}</AlertMessage>}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Icons.loading /> : "Confirmar Cuenta"}
              </Button>
            </form>

            {!success && (
              <div className="my-4 text-center text-sm">
                ¿Tienes tu cuenta verificada?{" "}
                <Link href="/login" className="underline">
                  Ingresa!
                </Link>
              </div>
            )}
          </Form>

          {success && (
            <div className="space-y-4">
              <AlertMessage variant="success">{success}</AlertMessage>
              <Button type="submit" className="w-full" onClick={() => route.replace("/login")}>
                Ingresar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
}
