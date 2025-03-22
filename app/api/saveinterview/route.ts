import { NextResponse } from "next/server";


export const POST = async (req : Request) =>{
    try {
        const payload = await req.json()
        console.log('this the payload', payload);
        
        
        return NextResponse.json({success : true})
    } catch (error) {
        console.log('this error happens while recieve data from vapi ');
        return NextResponse.json({success : false})
    }
}




