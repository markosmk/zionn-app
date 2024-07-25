import { UserRole } from "@prisma/client"
import { type DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"

interface ExtendedUser {
  role?: UserRole
  id?: string | null
}

declare module "next-auth/jwt" {
  interface JWT extends ExtendedUser {}
}

declare module "next-auth" {
  interface User extends ExtendedUser {}
  // not extends IUser because not are optional
  interface Session {
    user: {
      role: UserRole
      id: string
    } & DefaultSession["user"]
  }
}
