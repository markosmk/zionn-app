import nextAuth, { CredentialsSignin } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { nanoid } from "nanoid"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { User, UserRole } from "@prisma/client"

import { authConfig } from "./auth.config"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/password"
import { authLoginSchema } from "@/lib/validations/auth"
import { sanitizeUsername } from "@/lib/utils"

// for beta v19
// class CustomError extends AuthError {
//   constructor(message: string) {
//     super()
//     this.message = message
//   }
// }

export class InvalidLoginError extends CredentialsSignin {
  code = "custom"
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions)
    this.message = message
  }
}

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
        identifier: { type: "text", placeholder: "usuario@zionnmix.com", label: "Email o nombre de usuario" },
        password: { type: "password", placeholder: "******", label: "Contraseña" },
      },
      async authorize(credentials, req) {
        let user = null
        const { identifier, password } = await authLoginSchema.parseAsync(credentials)

        user = await db.user.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        })
        if (!user || !user.password) throw new InvalidLoginError("Email y/o password incorrectos.")
        const pwCorrect = await verifyPassword(user.password, password)

        if (!pwCorrect) throw new InvalidLoginError("Email y/o password incorrectos.")

        // if (!user.emailVerified) throw new InvalidLoginError("Email no verificado.")

        return user
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    // newUser: "/register",
    // signOut: "/login",
  },
  session: {
    strategy: "jwt", // default
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // this is called when user signs in Google
      if (isNewUser) {
        const username = profile?.email ? sanitizeUsername(profile.email) : nanoid(10)
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            username,
          },
        })
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user && !(user as User).emailVerified && account?.provider === "credentials") {
        // here send email verified again,
        // TODO: apply throgle to not send multiple emails
        return false
      }
      return true
    },
    //   authorized({ auth, request: { nextUrl } }) {
    //     const isAuthenticated = !!auth?.user
    //     return isAuthenticated
    //     // const isAuthenticated = !!auth?.user
    //     // const isOnPanel = nextUrl.pathname.startsWith("/me")
    //     // if (isOnPanel) {
    //     //   if (isAuthenticated) return true
    //     //   return false // Redirect unauthenticated users to login page
    //     // } else if (isAuthenticated) {
    //     //   return Response.redirect(new URL("/me", nextUrl))
    //     // }
    //     // return true
    //   },
    async jwt({ token, user }) {
      if (!token.sub) return token
      // user param only have date when first login successfully
      if (!user) return token
      token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.role = token?.role ?? UserRole.USER
      }
      return session
    },
  },
})
