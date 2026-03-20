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
        1. LANGUAGE & TONE:
           - MANDATORY: Writing must be in "${language}" ONLY.
           - IF LANGUAGE IS "Tamil": You MUST use TANGLISH (Tamil words written in English/Roman script, like "Nalla irukkengala?"). Talk like local friends chatting (e.g., use "Machan", "Guys", "Update", "Growth"). NEVER use Tamil script.
           - IF TONE IS "Professional" AND LANGUAGE IS NOT "Tamil": Use formal, authoritative, and polished "${language}".
           - FOR ALL OTHER TONES: Use the super-casual, "friend-to-friend" spoken dialect. If Language is Hindi/Telugu or any other Indian language: Heavy mix of English words is REQUIRED (Hinglish, Spanglish, etc. depending on language).
        2. START IMMEDIATELY with the content. 
        3. NO headers like "Hook:", "Intro:", or "Script:".
        4. NO meta-talk. Just the final content.
        5. For ${platform}, ensure the format is perfect (e.g. hashtags for LinkedIn/Instagram).

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
      const response = result.toTextStreamResponse()
      response.headers.set('x-debug-key', useGemini ? 'present' : 'missing')
      return response
    } catch (streamError: any) {
      console.error('streamText error:', streamError);
      throw streamError;
    }
  } catch (error: any) {
    console.error('Generation Error detail:', error)
    return new Response(JSON.stringify({ error: error.message, key_status: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'present' : 'missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
