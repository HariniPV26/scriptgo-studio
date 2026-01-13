'use server'

import OpenAI from 'openai'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateScript(formData: FormData) {
    const topic = formData.get('topic') as string
    const tone = formData.get('tone') as string
    const platform = formData.get('platform') as string

    if (!process.env.OPENAI_API_KEY) {
        // Mock response if no key (for testing without billing)
        console.warn("No OpenAI API Key found. Returning mock data.")
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            content: {
                visual: [
                    "Opening shot: Excited host facing camera",
                    "Cut to: B-roll of the topic subject",
                    "Text overlay: 'Top Tips'",
                    "Host holds up one finger",
                    "Graphic: Summary of points"
                ],
                audio: [
                    "Hey guys! Welcome back to the channel.",
                    `Today we're talking about ${topic}.`,
                    "It's easier than you think.",
                    "Tip number one: Start small.",
                    "And that's how you do it!"
                ]
            }
        }
    }

    const prompt = `You are a professional scriptwriter for ${platform}.
  Topic: ${topic}
  Tone: ${tone}
  
  Please write a script and format it as a JSON object with two arrays: 'visual' (what happens on screen) and 'audio' (what is said).
  Ensure both arrays have the same length so they can be displayed side-by-side.
  Make it engaging and suitable for the platform.`

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: 'You are a helpful assistant that outputs JSON.' }, { role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        })

        const content = JSON.parse(completion.choices[0].message.content || '{}')
        // content should be { visual: [], audio: [] }
        return { content }
    } catch (error) {
        console.error('OpenAI Error:', error)
        return { error: 'Failed to generate script' }
    }
}

export async function saveScript(id: string | null, title: string, platform: string, content: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    if (id) {
        // Update
        const { error } = await supabase
            .from('scripts')
            .update({ title, platform, content })
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) return { error: error.message }
        revalidatePath(`/editor/${id}`)
        return { success: true }
    } else {
        // Insert
        const { data, error } = await supabase
            .from('scripts')
            .insert({
                user_id: user.id,
                title: title || 'Untitled Script',
                platform,
                content
            })
            .select()
            .single()

        if (error) return { error: error.message }
        return { success: true, id: data.id }
    }
}
