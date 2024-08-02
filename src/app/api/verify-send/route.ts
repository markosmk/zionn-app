import { db } from "@/lib/db"
import { authResendCodeSchema } from "@/lib/validations/auth"
import { NextResponse } from "next/server"
import { handleErrors } from "@/lib/helpers/handle-errors"
import { TypeEmail } from "@prisma/client"
import { nanoid } from "nanoid"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = authResendCodeSchema.parse(json)

    // busco el usuario si existe
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (!user) throw new Error("User_not_found")
    // si ya esta verificado lo informo
    if (user.emailVerified) throw new Error("User_already_verified")

    // busco si hay algun token para este email
    const dataToken = await db.verificationToken.findFirst({
      where: {
        identifier: data.email,
        type: TypeEmail.VERIFY_ACCOUNT,
      },
    })

    const newToken = nanoid(32)
    if (dataToken && dataToken.expires < new Date()) {
      await db.verificationToken.delete({ where: { id: dataToken.id } })

      await db.verificationToken.update({
        where: { id: dataToken.id },
        data: { token: newToken, expires: new Date(Date.now() + 5 * 60 * 1000) },
      })
    } else {
      await db.verificationToken.create({
        data: {
          identifier: data.email,
          type: TypeEmail.VERIFY_ACCOUNT,
          token: newToken,
          expires: new Date(Date.now() + 5 * 60 * 1000),
        },
      })
    }

    return NextResponse.json({ message: "Email enviado." }, { status: 200 })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
