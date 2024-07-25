import { db } from "@/lib/db"
import { registerSchema } from "@/lib/validations/auth"
import { saltAndHashPassword } from "@/lib/password"
import { sanitizeUsername } from "@/lib/utils"
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { VerifyEmail } from "@/emails/verify-email"
import { nanoid } from "nanoid"
import { siteConfig } from "@/config/site"
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

    const verify = await db.verificationToken.create({
      data: {
        identifier: data.identifier,
        token: nanoid(32),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours
      },
      select: { id: true, token: true },
    })

    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${siteConfig.replyEmail}>`,
      to: [process.env.NODE_ENV === "development" ? siteConfig.defaultEmail : data.identifier],
      subject: `Confirma tu cuenta en ${siteConfig.name}`,
      react: VerifyEmail({ token: verify.token, email: data.identifier }),
    })

    if (error) {
      await db.verificationToken.delete({ where: { id: verify.id } })
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
