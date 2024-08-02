import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { TypeEmail } from "@prisma/client"

import { db } from "@/lib/db"
import { sendVerifyEmail } from "@/services/mail.service"

import { handleErrors } from "@/lib/helpers/handle-errors"
import { registerSchema } from "@/lib/validations/auth"
import { saltAndHashPassword } from "@/lib/password"
import { sanitizeUsername } from "@/lib/utils"
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
    const data = registerSchema.omit({ confirmPassword: true }).parse(json)
    const password = await saltAndHashPassword(data.password)
    const username = sanitizeUsername(data.identifier)

    const user = await db.user.create({
      data: {
        username,
        email: data.identifier,
        password,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user || !user.email) throw new Error("User_not_created")

    const tokenData = await db.verificationToken.create({
      data: {
        identifier: data.identifier,
        token: nanoid(32),
        type: TypeEmail.VERIFY_ACCOUNT,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
      select: { id: true, token: true },
    })

    const { error } = await sendVerifyEmail(user.id, user.email, tokenData.token)

    if (error) {
      await db.verificationToken.delete({ where: { id: tokenData.id } })
      await db.user.delete({ where: { id: user.id } })
      throw new Error("Email_Error", { cause: error })
    }

    const { id, ...dataUserWithoutId } = user
    return NextResponse.json({ user: dataUserWithoutId })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
