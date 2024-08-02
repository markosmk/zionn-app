import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { TypeEmail } from "@prisma/client"

import { db } from "@/lib/db"
import { sendRecoveryPassEmail } from "@/services/mail.service"
import { handleErrors } from "@/lib/helpers/handle-errors"
import { authForgetPassSchema } from "@/lib/validations/auth"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    if (rateLimit(req)) {
      return NextResponse.json(
        { message: "Estas realizando muchas peticiones. Por favor, vuelve a intentarlo más tarde." },
        { status: 429 }
      )
    }

    const json = await req.json()
    const data = authForgetPassSchema.parse(json)

    // found if exist user
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })
    if (!user || !user.email) throw new Error("User_not_found")

    // search if any token exists for this user
    const dataToken = await db.verificationToken.findFirst({
      where: { identifier: data.email, type: TypeEmail.FORGET_PASSWORD },
    })

    // if exists, then checking if due, if not, delete
    if (dataToken) {
      if (dataToken.expires < new Date()) {
        await db.verificationToken.delete({ where: { id: dataToken.id } })
      } else {
        // TODO: Not allow user to token due, is correct?
        throw new Error("Token_Exists")
      }
    }

    // create new token
    const tokenData = await db.verificationToken.create({
      data: {
        identifier: user.email,
        token: nanoid(16),
        type: TypeEmail.FORGET_PASSWORD,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
      select: { id: true, token: true },
    })

    // send email
    const { error } = await sendRecoveryPassEmail(user.id, user.email, tokenData.token, user?.name || "")

    if (error) {
      await db.verificationToken.delete({ where: { id: tokenData.id } })
      throw new Error("Email_Error", { cause: error })
    }

    return NextResponse.json({ user: user })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
