import { z } from "zod"

import { db } from "@/lib/db"
import { resetPassSchema } from "@/lib/validations/auth"
import { NextResponse } from "next/server"
import { saltAndHashPassword } from "@/lib/password"
import { rateLimit } from "@/lib/rate-limit"
import { handleErrors } from "@/lib/helpers/handle-errors"

export async function POST(req: Request) {
  try {
    if (rateLimit(req)) {
      return NextResponse.json(
        { message: "Estas realizando muchas peticiones. Por favor, vuelve a intentarlo más tarde." },
        { status: 429 }
      )
    }

    const json = await req.json()
    const data = resetPassSchema
      .omit({ confirmPassword: true })
      .extend({ code: z.string(), identifier: z.string().email() })
      .parse(json)

    const dataToken = await db.verificationToken.findFirst({
      where: {
        identifier: data.identifier,
        token: data.code,
      },
    })

    if (!dataToken) {
      return NextResponse.json({ message: "El código de verificación o el email es Inválido" }, { status: 401 })
    }

    if (dataToken.expires < new Date()) {
      return NextResponse.json(
        {
          message:
            "El Código al parecer ya venció, si crees que no es asi, comunicate con nosotros, ayúdanos a mejorar.",
        },
        { status: 401 }
      )
    }

    const password = await saltAndHashPassword(data.password)
    await db.user.update({
      where: { email: dataToken.identifier },
      data: { password },
    })

    await db.verificationToken.delete({ where: { id: dataToken.id } })

    return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
