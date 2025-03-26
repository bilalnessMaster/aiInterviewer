import { client } from "@/app/utils/openai";
import { NextResponse } from "next/server";

const cleanUp = (value: string): string => {
    return value.replace(/```json/g, '').replace(/```/g, '').trim();
}

export const POST = async (req: Request) => {
    try {
        const { messages } = await req.json();
        const analysisPrompt = `
        Analyze this interview conversation and provide comprehensive feedback with a numerical score (0-100).
        The conversation may be incomplete - account for this in your assessment.

        Return a response with this exact JSON structure:
        {
            "score": 0-100,
            "analysis": [
                {
                    "category": "technical",
                    "icon": "🔧",
                    "rating": 0-10,
                    "feedback": "text"
                },
                {
                    "category": "communication",
                    "icon": "💬", 
                    "rating": 0-10,
                    "feedback": "text"
                },
                {
                    "category": "problem solving",
                    "icon": "🧩",
                    "rating": 0-10,
                    "feedback": "text"
                },
                {
                    "category": "strengths",
                    "icon": "✅",
                    "items": ["item1", "item2"]
                },
                {
                    "category": "improvements",
                    "icon": "📈",
                    "items": ["item1", "item2"]
                },
                {
                    "category": "overall",
                    "icon": "📝",
                    "feedback": "text",
                    "note_about_completeness": "text"
                }
            ]
        }

        Conversation:
        ${messages.join('\n')}
        `;

        const analys = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            response_format: { type: "json_object" } // Ensure JSON response
        });

        const feedback = JSON.parse(cleanUp(analys.choices[0].message.content || ''));
        return NextResponse.json({ success: true, feedback }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}