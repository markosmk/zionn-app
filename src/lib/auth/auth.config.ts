import type { NextAuthConfig } from "next-auth"

// this is only an object, not a full Auth.js instance
// is for use in middleware nextjs
export const authConfig = {
  providers: [
    // added later in lib/auth/index.ts since it requires bcrypt/argon which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
} satisfies NextAuthConfig
