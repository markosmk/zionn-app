import { z } from "zod"
import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"
import { registerSchema } from "@/lib/validations/auth"
import { saltAndHashPassword } from "@/lib/password"
import { sanitizeUsername } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = registerSchema.omit({ confirmPassword: true }).parse(json)
    const password = await saltAndHashPassword(data.password)
    const username = sanitizeUsername(data.email)

    const user = await db.user.create({
      data: {
        username,
        email: data.email,
        password,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    let message = error?.message ?? "Error desconocido"
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        if (error.meta?.target === "User_username_key") {
          message = "El nombre de usuario no esta disponible"
        }
        if (error.meta?.target === "User_email_key") {
          message = "El email ingresado ya existe"
        }
        return NextResponse.json(
          { message, code: error.code },
          {
            status: 422,
          }
        )
      }
    }
    return NextResponse.json({ message }, { status: 500 })
  }
}
