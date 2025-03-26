import sql from "@/app/utils/db";
import { client } from "@/app/utils/openai";
import { NextResponse } from "next/server";

const cleanUp = (value: string): string => {
    return value.replace(/```json/g, '').replace(/```/g, '').trim();
}

export const POST = async (req: Request) => {
    try {
        const { messages ,id } = await req.json();
        const analysisPrompt = `
        Analyze this interview conversation thoroughly and provide comprehensive feedback with a numerical score (0-100). 
        Pay special attention to both technical and behavioral aspects. The conversation may be incomplete - account for this in your assessment.
        
        Return a response with this exact JSON structure:
        {
            "score": 0-100,
            "analysis": [
                {
                    "category": "technical skills",
                    "icon": "🔧",
                    "rating": 0-10,
                    "feedback": "text",
                    "behavioral_note": "How technical answers reflect work ethic/attitude"
                },
                {
                    "category": "communication",
                    "icon": "💬", 
                    "rating": 0-10,
                    "feedback": "text",
                    "behavioral_aspects": ["clarity", "confidence", "active listening"]
                },
                {
                    "category": "problem solving",
                    "icon": "🧩",
                    "rating": 0-10,
                    "feedback": "text",
                    "approach_analysis": "How they handle challenges under pressure"
                },
                {
                    "category": "behavioral traits",
                    "icon": "🧠",
                    "rating": 0-10,
                    "feedback": "text",
                    "key_observations": ["teamwork", "adaptability", "professionalism"]
                },
                {
                    "category": "strengths",
                    "icon": "✅",
                    "items": ["item1", "item2"],
                    "behavioral_strengths": ["item1", "item2"]
                },
                {
                    "category": "improvements",
                    "icon": "📈",
                    "items": ["item1", "item2"],
                    "behavioral_areas": ["item1", "item2"]
                },
                {
                    "category": "overall",
                    "icon": "📝",
                    "feedback": "text",
                    "behavioral_summary": "text",
                    "note_about_completeness": "text"
                }
            ]
        }
        
        Evaluation Guidelines:
        1. Technical Skills: Assess knowledge depth and accuracy, but also note how answers demonstrate curiosity or willingness to learn
        2. Communication: Evaluate clarity and structure, plus nonverbal cues (if available) and emotional intelligence
        3. Problem Solving: Analyze methodology but also resilience and creativity under pressure
        4. Behavioral Traits: Look for:
           - Emotional intelligence indicators
           - Growth mindset signals
           - Cultural fit markers
           - Stress response patterns
        5. For incomplete conversations: Highlight observable traits while noting potential missing dimensions
        
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
        await sql`update "Interview" set note = ${feedback?.score} where id = ${id}`
        return NextResponse.json({ success: true, feedback }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}