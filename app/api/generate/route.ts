import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

// export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { topic, tone, platform, language, framework } = await req.json()

    console.log('API Request:', { topic, tone, platform, language, framework })

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), { status: 400 })
    }

    const prompt = `
        SYSTEM: You are an expert Content Creator. Your goal is to write high-converting content for ${platform}.
        TOPIC: ${topic}
        TONE: ${tone}
        LANGUAGE: ${language}
        FRAMEWORK: ${framework}

        ### MANDATORY RULES:
        1. ${language === 'Tamil' ? 'LANGUAGE: You MUST use TANGLISH (Tamil words written in English/Roman script). Example: "Nalla irukkengala?" instead of Tamil script.' : `LANGUAGE: Use ${language}.`}
        2. START IMMEDIATELY with the content. 
        3. NO headers like "Hook:", "Intro:", or "Script:".
        4. NO meta-talk. Just the final content.
        5. For ${platform}, ensure the format is perfect (e.g. hashtags for LinkedIn/Instagram).
        6. TONE: ${tone === 'Professional' ? 'Use polished, formal language.' : 'Use casual, enthusiastic, conversational language.'}

        Write the content now:`

    // Use Gemini if OpenAI key has issues or if Gemini key is provided
    const useGemini = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log('Using Gemini:', useGemini);
    console.log('Gemini Key:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'Present' : 'Missing');
    console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

    const model = useGemini
      ? google('gemini-2.5-flash')
      : openai('gpt-4o-mini');

    console.log(`Calling streamText with prompt (Using ${useGemini ? 'Gemini' : 'OpenAI'})...`)

    try {
      const result = await streamText({
        model: model,
        prompt: prompt,
      })

      console.log('Stream initialized successfully')
      return result.toTextStreamResponse()
    } catch (streamError: any) {
      console.error('streamText error:', streamError);
      throw streamError;
    }
  } catch (error: any) {
    console.error('Generation Error detail:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
