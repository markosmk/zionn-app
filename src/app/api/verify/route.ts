import { db } from "@/lib/db"
import { authVerifySchema } from "@/lib/validations/auth"
import { NextResponse } from "next/server"
import { handleErrors } from "@/lib/helpers/handle-errors"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = authVerifySchema.parse(json)

    const user = await db.user.findUnique({
      where: { email: data.uid },
      select: { emailVerified: true, email: true },
    })
    if (!user) throw new Error("User_not_found")
    if (!user.email) throw new Error("User_no_email")

    const dataToken = await db.verificationToken.findFirst({
      where: {
        identifier: user.email,
        token: data.tkn,
      },
    })

    if (!dataToken) {
      return NextResponse.json({ message: "El código de verificación es Inválido" }, { status: 401 })
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

    await db.user.update({
      where: { email: dataToken.identifier },
      data: { emailVerified: new Date() },
    })

    await db.verificationToken.delete({ where: { id: dataToken.id } })

    return NextResponse.json({ message: "Email verificado" }, { status: 200 })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
