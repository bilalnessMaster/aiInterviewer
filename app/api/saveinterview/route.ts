import sql from "@/app/utils/db";
import { client } from "@/app/utils/openai";
import { NextResponse } from "next/server";

const cleanUp : (value : string) => string= (variable) =>{
    return  variable.replace(/```json/g, '').replace(/```/g, '').trim();
}
export const POST = async (req: Request) => {
    try {
        const {userid , role , field ,questions} = await req.json()

        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an expert interviewer specializing in technical interviews for web development. Generate an array of thoughtful and challenging questions based on the given parameters.' },
                { 
                    role: 'user', 
                    content: `Generate an array of ${questions} interview questions for a *Senior Developer* in the field of *Web Development*. 
                    
                    - The questions should assess technical expertise, problem-solving skills, and real-world development experience.
                    - Include a mix of theoretical and practical questions.
                    - Return only a JSON array of strings.
        
                    Example format:
                    [
                      "Question 1",
                      "Question 2",
                      ...
                    ]`
                },
            ],
        });
        const arrayQuestions = JSON.parse(cleanUp(completion.choices[0].message.content as string))
        console.log(arrayQuestions);
        
        await sql`INSERT INTO "Interview" (user_id , questions , role , field)
                values(${userid} , ${arrayQuestions} , ${role} , ${field})
                `        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.log('this error happens while recieve data from vapi ', error);
        return NextResponse.json({ success: false })
    }
}




