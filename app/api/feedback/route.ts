import { NextResponse } from "next/server";
import { client } from "../../utils/openai";

const cleanUp : (value : string) => string= (variable) =>{
    return  variable.replace(/```json/g, '').replace(/```/g, '').trim();
}
export const POST = async (req: Request)=>{
        try {
            const {messages}= await req.json()
            const analysisPrompt = `
            Analyze this interview conversation and provide comprehensive feedback with a numerical score (0-100).
            The conversation may be incomplete - account for this in your assessment.
    
            Return a JSON object with this exact structure:
            {
                "score": 0-100,
                "analysis": {
                    "technical": {
                        "icon": "🔧",
                        "rating": 0-10,
                        "feedback": "text"
                    },
                    "communication": {
                        "icon": "💬", 
                        "rating": 0-10,
                        "feedback": "text"
                    },
                    "problem_solving": {
                        "icon": "🧩",
                        "rating": 0-10,
                        "feedback": "text"
                    },
                    "strengths": {
                        "icon": "✅",
                        "items": ["item1", "item2"]
                    },
                    "improvements": {
                        "icon": "📈",
                        "items": ["item1", "item2"]
                    },
                    "overall": {
                        "icon": "📝",
                        "feedback": "text",
                        "note_about_completeness": "text"
                    }
                }
            }
    
            Conversation:
            ${messages.join('\n')}
            `;
    
            
            const analys = await client.chat.completions.create({
                model : "gpt-3.5-turbo",
                messages :[
                    {
                        role : "user",
                        content : analysisPrompt
                    }
                ]
            })
            const feedback = analys.choices[0].message 
            // console.log(JSON.parse(feedback));
            return NextResponse.json({success: true , feedback},{status : 200})
        } catch (error) {
            console.log(error);
            return NextResponse.json({success: false},{status : 500})
        }
}