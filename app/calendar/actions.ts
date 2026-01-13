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
    framework: string = 'None'
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

    const prompt = `
    TASK: Generate a ${days}-day content calendar.
    TOPIC: ${topic}
    TONE: ${tone}
    PLATFORM: ${platform}
    LANGUAGE: ${language}
    FRAMEWORK: ${frameworkInstruction}

    Deliver EXACTLY ${days} unique content pieces, one for each consecutive day.
    
    RESPONSE FORMAT: 
    You MUST return ONLY a valid JSON object with a "calendar" key containing an array of ${days} objects.
    Each object in the "calendar" array must have these exactly:
    {
      "day": number (1 to ${days}),
      "title": "A short, catchy title for this day's content",
      "content": "The full script or post content following the platform and tone requirements"
    }

    PLATFORM SPECIFIC RULES:
    ${platform === 'LinkedIn' ? 'Text only posts, no video scripts, NO audio cues or visual brackets. Pure engagement text.' : ''}
    ${platform === 'YouTube' ? 'Video script format with intro, body, and outro.' : ''}
    ${platform === 'TikTok' || platform === 'Instagram' ? 'Short-form video script with [Visual] and [Audio] cues.' : ''}

    Language: The entire response (titles and content) MUST be in ${language}.
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
