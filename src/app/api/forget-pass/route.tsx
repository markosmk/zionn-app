import { db } from "@/lib/db"
import { authForgetPassSchema } from "@/lib/validations/auth"
import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { RecoveryPassEmail } from "@/emails/recovery-pass-email"
import { nanoid } from "nanoid"
import { rateLimit } from "@/lib/rate-limit"
import { handleErrors } from "@/lib/helpers/handle-errors"
import { siteConfig } from "@/config/site"

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

    // search if any token exists
    const dataToken = await db.verificationToken.findFirst({
      where: { identifier: data.email },
    })

    if (dataToken) {
      // if exists, then check if due, if not, delete
      if (dataToken.expires < new Date()) {
        await db.verificationToken.delete({ where: { id: dataToken.id } })
      } else {
        throw new Error("Token_Exists")
      }
    }

    // create new token
    const tokenData = await db.verificationToken.create({
      data: {
        identifier: user.email,
        token: nanoid(12),
        // type: "FORGET_PASSWORD",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours
      },
      select: { id: true, token: true },
    })

    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${siteConfig.replyEmail}>`,
      to: [process.env.NODE_ENV === "development" ? siteConfig.defaultEmail : data.email],
      subject: `Recuperar Acceso a ${siteConfig.name}`,
      react: RecoveryPassEmail({ token: tokenData.token, name: user.name }),
    })

    if (error) {
      await db.verificationToken.delete({ where: { id: tokenData.id } })
      await db.user.delete({ where: { id: user.id } })

      throw new Error("Email_Error", { cause: error })
    }

    return NextResponse.json({ user: user })
  } catch (error: any) {
    const { error: message, errors, status } = handleErrors(error)
    return NextResponse.json({ message, errors }, { status })
  }
}
