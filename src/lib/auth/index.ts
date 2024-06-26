import nextAuth, { User } from "next-auth"
import { ZodError } from "zod"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"
import { verifyPassword } from "../password"
import { authLoginSchema } from "../validations/auth"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = nextAuth({
  ...authConfig,
  // https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        identifier: { label: "Nombre de usuario o Email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          let user = null
          const { identifier, password } =
            await authLoginSchema.parseAsync(credentials)

          user = await db.user.findFirst({
            where: {
              OR: [{ email: identifier }, { username: identifier }],
            },
          })
          if (!user || !user.password) throw new Error("User not found.")

          const pwCorrect = await verifyPassword(password, user.password)
          if (!pwCorrect) throw new Error("Wrong password.")

          return user as User
        } catch (error: any) {
          if (error instanceof ZodError) {
            return null
          }
          if (error instanceof Error) {
            return null
          }
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
})
