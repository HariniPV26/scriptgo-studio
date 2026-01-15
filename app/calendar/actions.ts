'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCalendarContent(
    topic: string,
    days: number,
    tone: string,
    platform: string,
    language: string = 'English',
    framework: string = 'None',
    startDate?: string
) {
    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not set in environment variables')
        return { error: 'OpenAI API Key is not configured. Please contact support.' }
    }

    let frameworkInstruction = ''
    if (framework === 'AIDA') {
        frameworkInstruction = `Use the AIDA model (Attention, Interest, Desire, Action) for each post.`
    } else if (framework === 'PAS') {
        frameworkInstruction = `Use the PAS model (Problem, Agitation, Solution) for each post.`
    }

    const dateInstruction = startDate ? `The calendar starts on ${startDate}. Ensure content is relevant to the dates if applicable (e.g. weekends, holidays).` : ''

    const prompt = `
    SYSTEM: You are a World-Class Content Strategist and Copywriter.
    TASK: Architect a high-fidelity ${days}-day Content Strategy.
    TOPIC: ${topic}
    TONE: ${tone}
    PLATFORM: ${platform}
    LANGUAGE: ${language}
    FRAMEWORK: ${frameworkInstruction}
    CONTEXT: ${dateInstruction}

    STRATEGY GOALS:
    1. CONTENT ARC: The ${days} days should tell a cohesive story or build authority. Start with awareness/empathy, move to education/authority, then lead to conversion.
    2. PSYCHOLOGICAL TRIGGERS: Incorporate subtle triggers like Social Proof, Reciprocity, Scarcity, and Authority where appropriate.
    3. MIX: Ensure a balanced mix of:
       - VIRAL (Empathy/Hooks/Relatable)
       - AUTHORITY (Data/Insights/Lessons)
       - CONNECTION (Personal Stories/Behind the Scenes)
       - CONVERSION (Call to action/Problem-Solution)

    RESPONSE FORMAT: 
    Return a JSON object with a "calendar" key containing an array of ${days} objects.
    {
      "day": number,
      "title": "Compelling, curiosity-gap title",
      "content": "Professional-grade copy. Use line breaks for readability. High-impact hook.",
      "label": "Growth, Trust, Insight, or Vision"
    }

    PLATFORM RULES:
    - LinkedIn: Text-only, scroll-stopper hooks, whitespace for readability.
    - YouTube: Detailed script outline (Title, Hook, 3-4 Key Points, Outro).
    - TikTok/Instagram: Visual/Audio cues in [brackets]. Fast-paced.

    Language: Everything MUST be in ${language}.
    `

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        })

        const rawContent = response.choices[0].message.content || '{}'
        const parsed = JSON.parse(rawContent)

        // Sometimes GPT wraps it in a key like "calendar" or "posts"
        const items = Array.isArray(parsed) ? parsed : (parsed.calendar || parsed.posts || parsed.days || [])

        return { items }
    } catch (error: any) {
        console.error('OpenAI Error:', error)

        // Provide more specific error messages
        if (error?.status === 401) {
            return { error: 'Invalid OpenAI API key. Please check your configuration.' }
        } else if (error?.status === 429) {
            return { error: 'Rate limit exceeded. Please try again in a moment.' }
        } else if (error?.status === 500) {
            return { error: 'OpenAI service is temporarily unavailable. Please try again.' }
        }

        return { error: `Error generating calendar: ${error?.message || 'Unknown error'}` }
    }
}
