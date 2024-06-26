import type { NextAuthConfig } from "next-auth"

// this is only an object, not a full Auth.js instance
// is for use in middleware
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // added later in lib/auth/index.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user
      return isAuthenticated
      // const isAuthenticated = !!auth?.user
      // const isOnPanel = nextUrl.pathname.startsWith("/me")
      // if (isOnPanel) {
      //   if (isAuthenticated) return true
      //   return false // Redirect unauthenticated users to login page
      // } else if (isAuthenticated) {
      //   return Response.redirect(new URL("/me", nextUrl))
      // }
      // return true
    },
    async jwt({ token, user }) {
      // user only take when login successfully
      if (user) {
        token.id = user.id // same as sub in token
        token.username = user.username
        token.picture = user.image
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id!, // same as sub in token
          role: token.role,
          username: token.username,
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig
