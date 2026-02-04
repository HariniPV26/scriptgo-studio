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
    SYSTEM: You are an expert Content Creator and Social Media Strategist with 10 years of experience. Your goal is to architect a high-converting, viral ${days}-day Content Strategy.
    TOPIC: ${topic}
    TONE: ${tone}
    PLATFORM: ${platform}
    LANGUAGE: ${language}
    FRAMEWORK: ${frameworkInstruction}
    CONTEXT: ${dateInstruction}

    ### STRATEGY GOALS
    1. CONTENT ARC: The ${days} days should tell a cohesive story or build authority. Start with awareness/empathy, move to education/authority, then lead to conversion.
    2. PSYCHOLOGICAL TRIGGERS: Incorporate subtle triggers like Social Proof, Reciprocity, Scarcity, and Authority where appropriate.
    3. MIX: Ensure a balanced mix of VIRAL, AUTHORITY, CONNECTION, and CONVERSION posts.

    ### STYLE GUIDELINES (CRITICAL)
    1. LANGUAGE & TONE:
       - MANDATORY: Writing must be in "${language}" ONLY.
       - IF LANGUAGE IS "Tamil": You MUST use TANGLISH (Tamil words written in English/Roman script). Talk like local friends chatting (e.g., use "Machan", "Guys", "Update", "Growth"). NEVER use Tamil script.
       - IF TONE IS "Professional" AND LANGUAGE IS NOT "Tamil": Use formal, authoritative, and polished "${language}".
       - FOR ALL OTHER TONES: Use the super-casual, "friend-to-friend" spoken dialect. If Language is Hindi/Telugu: Heavy mix of English words is REQUIRED (Hinglish, etc.).
    2. NO FLUFF: Do not use words like "In today's digital world" or "Let's dive in." Start immediately with value.
    3. NO META-LABELS: In the "content" field, do not output headers like "Hook:", "Body:", or "Conclusion:". Just write the script/content directly.

    ### PLATFORM SPECIFIC RULES (APPLY TO "content" FIELD)
    **IF PLATFORM IS "Instagram Reels" or "YouTube Shorts":**
    1. Visual Hook: (Describe what happens on screen in brackets, e.g., [Text flashes: STOP SCROLLING]).
    2. Audio Hook: A controversial or high-energy opening sentence.
    3. The Meat: 3 rapid-fire value points.
    4. CTA: A quick Call to Action.
    Structure as a vertical video script. Under 60 seconds spoken.

    **IF PLATFORM IS "LinkedIn Post":**
    1. The Hook: A one-line opening statement that creates curiosity (click-bait but professional).
    2. The Story/Insight: Space out sentences. Use "Broetry" style (short paragraphs).
    3. The Lesson: Bullet points of actionable advice.
    4. The Question: End with a question to drive comments.
    Tone: Follow the "LANGUAGE & TONE" guidelines for "${tone}" exactly. No emojis in the first 2 lines.

    **IF PLATFORM IS "YouTube Video" (Long Form):**
    1. The Teaser: "In this video, you will learn X..."
    2. The Intro: Quick branding (5 seconds).
    3. The Content: Step-by-step deep dive.
    4. The Conclusion: Summary and Subscribe.
    Tone: Follow the "LANGUAGE & TONE" guidelines for "${tone}" exactly.

    ### RESPONSE FORMAT
    Return a JSON object with a "calendar" key containing an array of ${days} objects.
    {
      "day": number,
      "title": "Compelling, curiosity-gap title",
      "content": "STRICTLY follow the platform rules and style guidelines here. NO META-LABELS.",
      "label": "Growth, Trust, Insight, or Vision"
    }
    `

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
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
