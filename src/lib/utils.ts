import { siteConfig } from "@/config/site"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`
}

export function sanitizeUsername(email: string): string {
  const firstPart = email.split("@")[0]
  const usernamePrefix = firstPart.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
  const usernameSuffix = nanoid(6)
  return `${usernamePrefix}${usernameSuffix}`
}
