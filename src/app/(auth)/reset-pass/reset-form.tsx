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

import { cn, sleep } from "@/lib/utils"
import { authResetPassSchema } from "@/lib/validations/auth"
import { handleErrors } from "@/lib/helpers/handle-errors"

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof authResetPassSchema>

export const ResetPassForm = ({ className }: Props) => {
  const route = useRouter()
  const params = useSearchParams()

  // for form
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>("")
  const [success, setSuccess] = React.useState<string | undefined>("")

  const form = useForm<FormData>({
    resolver: zodResolver(authResetPassSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async ({ password, confirmPassword }: FormData) => {
    setSuccess("")
    setError("")
    setIsPending(true)
    await sleep(1000)
    try {
      const code = params.get("code")
      const identifier = params.get("identifier")
      if (!code && !identifier)
        throw new Error(
          "El código o tu email, no son válidos, intenta acceder al enlace de tu correo nuevamente. Si el problema continua, contactános."
        )

      const response = await axios.post("/api/reset-pass", { password, confirmPassword, code, identifier })
      if (response) {
        form.reset()
        setSuccess("La contraseña de tu cuenta fue actualizada correctamente, puedes usarla para iniciar sesion")
      }
    } catch (error) {
      form.setValue("confirmPassword", "")
      setError(handleErrors(error).error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="mx-auto w-full sm:w-96">
      <CardHeader>
        <CardTitle className="text-3xl text-center font-heading font-extrabold">
          {success ? "Actualizado! 🥳" : "Actualizar Acceso 🔑"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", success ? "hidden" : "")}>
            <div
              className={cn("grid gap-y-4", className, isPending ? "pointer-events-none opacity-50 select-none" : "")}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        {...field}
                        onChange={(value) => {
                          field.onChange(value)
                          setError("")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        {...field}
                        onChange={(value) => {
                          field.onChange(value)
                          setError("")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && <AlertMessage variant="destructive">{error}</AlertMessage>}

            {success && <AlertMessage variant="success">{success}</AlertMessage>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Icons.loading /> : "Actualizar Cuenta"}
            </Button>
          </form>

          <div className="my-4 text-center text-sm">
            ir a{" "}
            <Link href="/login" className="underline">
              Iniciar Sesión!
            </Link>
          </div>
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
