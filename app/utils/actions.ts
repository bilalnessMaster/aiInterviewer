'use server'

import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"
import sql from "./db"
import { Interview } from "@/constant/types"
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
    } catch (error: any ) {
        handleAuthError(error)
        if(error?.disgest?.startsWith('NEXT_REDIRECT')){
            console.error("Google Sign-in Error:", error);
            return;
        }
    }
}


export const getInterview = async (id : string | undefined) =>{
  try {
    const session = await auth()
    const user = session?.user?.id as string
    let interview: Interview[];
    if(!id){
      interview = await sql`select * from "Interview" where user_id = ${user} 
      ORDER BY created_at DESC 
      limit 1` 
      return interview
    }
    interview = await sql`select * from "Interview" where  id = ${id} limit 1`

    return !interview.length ? [] : interview;
  } catch (error) {
    console.log(error);
    return null;
    
  }
}