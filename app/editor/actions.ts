'use server'

import OpenAI from 'openai'

// Initialize OpenAI
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('CRITICAL: OPENAI_API_KEY is undefined in environment');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

const openai = getOpenAIClient();

export async function generateScript(topic: string, tone: string, platform: string, language: string = 'English', framework: string = 'None') {
  if (!process.env.OPENAI_API_KEY) {
    return { text: 'OpenAI API Key is missing. Please check your configuration.' };
  }

  let specificInstructions = ''
  let frameworkInstruction = ''

  if (framework === 'AIDA') {
    frameworkInstruction = `
      MARKETING FRAMEWORK: Use the AIDA model (Attention, Interest, Desire, Action).
      - Attention: Grasp the reader's attention with a powerful opening.
      - Interest: Provide interesting facts or insights to keep them engaged.
      - Desire: Make them want the product/service or agree with your point.
      - Action: Direct the reader to take a clear next step.
      `
  } else if (framework === 'PAS') {
    frameworkInstruction = `
      MARKETING FRAMEWORK: Use the PAS model (Problem, Agitation, Solution).
      - Problem: Clearly identify a specific pain point or problem.
      - Agitation: Stir up the emotions around that problem, explaining the consequences of not solving it.
      - Solution: Present your topic/service/product as the definitive answer.
      `
  }

  if (platform === 'LinkedIn') {
    specificInstructions = `
      CONTEXT: You are a LinkedIn Ghostwriter.
      GOAL: Write a high-engagement text post (NO video scripts, NO audio cues) in ${language}.
      
      STRUCTURE:
      1. HOOK: A punchy, one-line opening to grab attention.
      2. RE-HOOK: Briefly expand on the problem or situation.
      3. BODY: Deliver value, a story, or a list of insights. Use short paragraphs and line breaks for readability.
      4. TAKEAWAY/CTA: Summarize or ask a question to drive comments.
      5. HASHTAGS: 3-5 relevant hashtags.
      
      ${frameworkInstruction}
      
      FORMAT: Plain text, ready to copy-paste into LinkedIn.
      `
  } else if (platform === 'YouTube') {
    specificInstructions = `
      CONTEXT: You are a Professional YouTube Scriptwriter.
      GOAL: Write a compelling video script for a long-form video in ${language}.
      
      STRUCTURE:
      1. TITLE OPTIONS: 3 Clickbait title ideas.
      2. INTRO (0:00): Catchy hook, what the viewer will learn.
      3. BODY: Broken down into clear sections/points. Use [Visual Cue] brackets if describing screen action, but focus on the Spoken Audio.
      4. OUTRO: Summary and Call to Action (Subscribe).
      
      ${frameworkInstruction}
      
      FORMAT: Script format with headers.
      `
  } else {
    // TikTok, Instagram, Shorts
    specificInstructions = `
      CONTEXT: You are a Viral Short-Form Video Expert (TikTok/Reels).
      GOAL: Write a fast-paced, 60-second video script in ${language}.
      
      STRUCTURE:
      - HOOK (0-3s): Visual or Audio hook to stop scrolling.
      - VALUE (3-50s): Fast tips or story.
      - CTA (50-60s): "Follow for more" or similar.
      
      ${frameworkInstruction}
      
      FORMAT: Two-column style simplified into text:
      [Visual]: description
      [Audio]: spoken words
      `
  }

  const prompt = `
    SYSTEM: You are a Top-Tier Content Ghostwriter and Growth Strategist for Founders.
    TOPIC: ${topic}
    TONE: ${tone}
    LANGUAGE: ${language}
    PLATFORM: ${platform}
    
    GUIDELINES:
    1. THE HOOK: The first line must be an irresistible scroll-stopper (Stat, Question, Contradiction, or strong Opinion).
    2. THE RE-HOOK: Sustain interest by identifying a pain point or providing context immediately after the hook.
    3. THE BODY: Concise, punchy sentences. High information density. No fluff.
    4. THE CTA: A clear, natural transition to an action or a thought-provoking question.
    
    ${specificInstructions}
    
    Return ONLY the final content in a clean, professional format. 
    IMPORTANT: The entire delivery MUST be in ${language}.
  `

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.choices[0].message.content || 'No script generated.'
    return { text: content }
  } catch (error: any) {
    console.error('OpenAI Generation Error:', error)
    const errorMessage = error.message || 'Error generating script.'
    return { text: `Error: ${errorMessage}. Please check your OpenAI API key and credits.` }
  }
}

export async function generateVisuals(script: string, platform: string, topic: string, tone: string) {
  if (!process.env.OPENAI_API_KEY) {
    return { text: 'OpenAI API Key is missing. Please check your configuration.' };
  }

  const prompt = `
    SYSTEM: You are a Professional Video Director and Visual Storyboard Artist.
    PLATFORM: ${platform}
    TOPIC: ${topic}
    TONE: ${tone}
    SCRIPT: 
    ${script}
    
    GOAL: Create a high-quality visual storyboard.
    
    GUIDELINES:
    1. For each shot, create a VERY DESCRIPTIVE and UNIQUE prompt for an AI image generator.
    2. The prompt should specify: Subject, Environment, Lighting, Camera Angle, and Style (e.g. Cinematic, 3D Render, or Realistic Photo).
    3. Ensure the visuals are accurate to the content of the script. If the script mentions "Cinderella", the prompt MUST describe a character resembling Cinderella.
    4. Provide different prompts for different shots to avoid repetition.
    
    FORMAT: Return a JSON object with:
    1. "visuals": An array of objects, each with "shot" (e.g. "Shot 1"), "description" (what happens), and "imagePrompt" (the detailed AI generation prompt).
    2. "thumbnailPrompt": A high-impact prompt for the overall video cover.
    
    IMPORTANT: Provide ONLY valid JSON. Make prompts vivid and specific.
  `

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content || '{"visuals": []}'
    return { text: content }
  } catch (error: any) {
    console.error('OpenAI Visuals Error:', error)
    return { text: JSON.stringify({ error: 'Failed' }) }
  }
}
