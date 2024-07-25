"use client"

import * as React from "react"
import { useStore } from "@/store"
import Link from "next/link"

import { cn } from "@/lib/utils"
import GoogleLoginForm from "../google-login-form"
import { useContentModal } from "./use-content-modal"
import { section, TypeContent } from "./sections"
import { AuthContent } from "./auth-content"

type Props = {
  currentContent?: TypeContent
  type?: "card" | "dialog"
}

export const AuthSection = ({ currentContent, type = "dialog" }: Props) => {
  const isAuthLoading = useStore((state) => state.isAuthLoading)
  const { content, setContent } = useContentModal((state) => state)

  React.useEffect(() => {
    if (currentContent) {
      setContent(currentContent)
    }
  }, [currentContent, setContent])

  return (
    <AuthContent type={type} title={section[content]?.title ?? ""} description={section[content]?.description}>
      {/* content */}
      {section[content] && section[content]?.form}

      {/* OAuth */}
      {["login", "register"].includes(content) && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">o</span>
            </div>
          </div>
          <GoogleLoginForm />
        </>
      )}

      {/* footer */}
      <div className="my-4 text-center text-sm">
        {section[content]?.footerText}
        <span
          onClick={isAuthLoading ? () => {} : () => setContent(section[content]?.linkContent)}
          className={cn(
            "underline text-primary hover:text-primary-500 transition-colors cursor-pointer ml-2",
            isAuthLoading && "cursor-not-allowed"
          )}
        >
          {section[content]?.linkToggle}
        </span>
      </div>

      {/* footer only login and register */}
      {["login", "register"].includes(content) && (
        <p className="text-xs text-muted-foreground text-center">
          Al conectar tu cuenta, estás de acuerdo con nuestros{" "}
          <Link href="/legal/terms" className="underline text-primary hover:text-primary-500 transition-colors">
            Terminos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="/legal/privacy" className="underline text-primary hover:text-primary-500 transition-colors">
            Politica de Privacidad
          </Link>
          .
        </p>
      )}
    </AuthContent>
  )
}
