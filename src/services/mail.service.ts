import { siteConfig } from "@/config/site"
import { resend } from "@/lib/resend"

import { VerifyEmail } from "@/emails/verify-email"
import { RecoveryPassEmail } from "@/emails/recovery-pass-email"

export const sendRecoveryPassEmail = async (userId: string, userEmail: string, token: string, userName?: string) => {
  try {
    return await resend.emails.send({
      from: `${siteConfig.name} <${siteConfig.replyEmail}>`,
      to: [process.env.NODE_ENV === "development" ? siteConfig.defaultEmail : userEmail],
      subject: `¡Recuperemos el acceso a tu cuenta! 🔑`,
      react: RecoveryPassEmail({
        url: `${siteConfig.url}/reset-pass?uid=${encodeURIComponent(userId)}&tkn=${encodeURIComponent(token)}`,
        name: userName,
      }),
    })
  } catch (error) {
    throw error
  }
}

export const sendVerifyEmail = async (userId: string, userEmail: string, token: string) => {
  try {
    return await resend.emails.send({
      from: `${siteConfig.name} <${siteConfig.replyEmail}>`,
      to: [process.env.NODE_ENV === "development" ? siteConfig.defaultEmail : userEmail],
      subject: `¡Tu cuenta está a un paso de ser oficial! 🥹`,
      react: VerifyEmail({
        url: `${siteConfig.url}/verify?uid=${encodeURIComponent(userId)}&tkn=${encodeURIComponent(token)}`,
      }),
    })
  } catch (error) {
    throw error
  }
}
