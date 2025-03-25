import sql from "@/app/utils/db"
import { NextResponse } from "next/server"



export const GET= async ()=>{
        try {
            const users = await sql`SELECT * FROM "User"`
            // const email = profile?.email as keyof typeof profile
          const isAlreadyExists = await sql`select * from  "Interview"`
            return NextResponse.json({users : isAlreadyExists}, {status: 200})
        } catch (error) {
            console.log(error);
            return NextResponse.json({success : false}, {status: 500})
        }
}