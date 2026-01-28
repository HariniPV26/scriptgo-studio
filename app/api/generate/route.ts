import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
    const { topic, tone, platform, language, framework } = await req.json()

    const prompt = `Write content for topic "${topic}" in ${language}. Tone: ${tone}. Platform: ${platform}. 
  Return only the final content. NO headers.`

    const result = await streamText({
        model: openai('gpt-4o-mini'),
        prompt: prompt,
    })

    return result.toTextStreamResponse()
}
