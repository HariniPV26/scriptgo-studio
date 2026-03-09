import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        console.log("Testing Gemini API Key configuration...");
        const useGemini = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!useGemini) {
            return NextResponse.json({ success: false, error: 'GOOGLE_GENERATIVE_AI_API_KEY is missing from process.env' });
        }

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: 'Say "hello world" in 5 words.'
        });

        return NextResponse.json({ success: true, text: result.text, key_status: "present" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stack: e.stack });
    }
}
