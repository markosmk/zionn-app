"use client"

import { useSession } from "next-auth/react"

export const useSessionUser = () => {
  const { data, status } = useSession()

  return {
    user: data?.user, //as IUser | null | undefined,
    status,
  }
}
