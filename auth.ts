import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { authConfig } from "./config.auth"
const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
if (!googleClientId || !googleClientSecret) {
    throw new Error("Google client ID or secret is missing")
}
export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig , 
    providers: [Google({
        clientId : googleClientId,
        clientSecret : googleClientSecret
    })],
})