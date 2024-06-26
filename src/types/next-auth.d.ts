import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

export enum Role {
  user = "user",
  admin = "admin",
}

export interface IUser {
  role?: Role
  username?: string | null
  id?: string | null
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User & IUser
    // use extends to add properties
  }
}
