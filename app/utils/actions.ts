'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

function handleAuthError(error: unknown): string {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong during authentication."
      }
    }
    throw error
  }


export const signInWithGoogle = async () =>{
    try {
        await signIn('google',{ redirectTo: '/'  })
    } catch (error : any) {
        handleAuthError(error)
        if(error?.digest?.startsWith('NEXT_REDIRECT')){
            console.error("Google Sign-in Error:", error);
            return;
        }
    }
}


