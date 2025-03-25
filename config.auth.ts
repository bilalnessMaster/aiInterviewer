import type { NextAuthConfig } from 'next-auth';
import sql from './app/utils/db';
// https://nextjs.org/learn/dashboard-app/adding-metadata


export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // console.log({
      //   nextUrl
      // });
      const pathLogin = nextUrl.pathname.startsWith('/login')
      if (pathLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl.origin))
        }
        return false
      } else if (isLoggedIn) {
        return true
      }
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = profile?.email as keyof typeof profile
        const name = profile?.name as keyof typeof profile
        const profilePicture = profile?.picture as keyof typeof profile
        const isAlreadyExists = await sql`select * from  "User" where email = ${email}`
        if (!isAlreadyExists.length) {
          const newUser = await sql`INSERT INTO "User" (name, email, profilePicture) 
                      VALUES (${name}, ${email}, ${profilePicture}) returning id`
          user.id = newUser[0].id
          return !!newUser.length
        } else {
          user.id = isAlreadyExists[0].id
          return true
        }
      }
      return false
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.name = token.name
      session.user.email = token.email!
      return session
    },
    async jwt({ user, token }) {
      return token
    }
  },
  providers: [],
} satisfies NextAuthConfig;