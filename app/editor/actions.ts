'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('CRITICAL: GEMINI_API_KEY is undefined in environment');
  }
  return new GoogleGenerativeAI(apiKey || '');
}

const genAI = getGeminiClient();

export async function generateScript(topic: string, tone: string, platform: string, language: string = 'English', framework: string = 'None') {
  if (!process.env.GEMINI_API_KEY) {
    return { text: 'Gemini API Key is missing. Please check your configuration.' };
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
    SYSTEM: You are an expert Content Creator and Social Media Strategist with 10 years of experience. Your goal is to write high-converting, viral content tailored to specific platforms. 

    ### INPUT DATA
    - **Topic:** ${topic}
    - **Tone:** ${tone}
    - **Platform:** ${platform}
    - **Language:** ${language}
    - **Framework:** ${frameworkInstruction}

    ### STYLE GUIDELINES (CRITICAL)
    1. LANGUAGE & TONE:
       - MANDATORY: Writing must be in "${language}" ONLY.
       - IF TONE IS "Professional": Use formal, authoritative, and polished "${language}". High-standard vocabulary. No slang.
       - FOR ALL OTHER TONES (Friendly, Witty, Edgy, etc.): NEVER use formal/textbook language. Use the super-casual, "friend-to-friend" spoken dialect of "${language}". 
         - If Language is Tamil/Hindi/Telugu/English: Heavy mix of English words is REQUIRED (Tanglish/Hinglish). Talk like local friends chatting (e.g., for Tamil use "Machan", "Guys", "Update", "Growth").

    2. NO FLUFF: Do not use words like "In today's digital world" or "Let's dive in." Start immediately with value.
    3. NO META-LABELS: Do not output headers like "Hook:", "Body:", or "Conclusion:". Just write the script/content directly.

    ### PLATFORM SPECIFIC RULES
    ${specificInstructions}

    **IF PLATFORM IS "YouTube Video" (Long Form):**
    Ensure the script is entirely in ${language}.
    1. The Teaser: "In this video, you will learn X..."
    2. The Intro: Quick branding (5 seconds).
    3. The Content: Step-by-step deep dive.
    4. The Conclusion: Summary and Subscribe.
    Tone: Follow the LANGUAGE & TONE rules for "${tone}" Tone exactly.

    ### GENERATE CONTENT NOW
    Write the content for the topic "${topic}" in ${language}. 
    Follow the rules above strictly.
    Return ONLY the final content in a clean format. Do not include any other text.
  `

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const content = result.response.text() || 'No script generated.'
    return { text: content }
  } catch (error: any) {
    console.error('Gemini Generation Error:', error)
    const errorMessage = error.message || 'Error generating script.'
    return { text: `Error: ${errorMessage}. Please check your Gemini API key and quota.` }
  }
}

export async function generateVisuals(script: string, platform: string, topic: string, tone: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { text: 'Gemini API Key is missing. Please check your configuration.' };
  }

  const prompt = `
    SYSTEM: You are a Professional Video Director and Visual Storyboard Artist specializing in high-end CGI and Animation.
    PLATFORM: ${platform}
    TOPIC: ${topic}
    TONE: ${tone}
    SCRIPT: 
    ${script}
    
    TASK: Generate a visual storyboard for this topic. Return only JSON.
    
    CRITICAL STYLE INSTRUCTIONS:
    1. STYLE: Use a "Vibrant 3D Animated Movie Style" (Disney/Pixar aesthetic).
    2. SUBJECT: Every prompt MUST describe a specific human/character subject based on the topic. 
    3. NO ROBOTS: Unless explicitly requested, do NOT use robots, computers, QR codes, or technical diagrams.
    4. CINDERELLA EXAMPLE: If the topic involves Cinderella, every prompt must describe "A beautiful princess girl with glowing blonde hair, stunning blue silk gown, expressive big eyes, Disney Pixar 3D art style".
    5. ENVIRONMENT: Describe lush, magical, or cinematic backgrounds.
    
    PROMPT FORMAT: "A high-quality 3D Disney Pixar style animation of [Character Details], [Environment Details], [Action Detail], cinematic lighting, masterpiece, 8k, vibrant colors."
    
    FORMAT: Return a JSON object with:
    1. "visuals": Array of { "shot", "description", "imagePrompt" }
    2. "thumbnailPrompt": One main cinematic hero prompt.
    
    IMPORTANT: Keep prompts descriptive (30-50 words). No technical jargon. No placeholders.
    Return ONLY valid JSON.
  `

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const content = result.response.text() || '{"visuals": []}'
    return { text: content }
  } catch (error: any) {
    console.error('Gemini Visuals Error:', error)
    return { text: JSON.stringify({ error: 'Failed' }) }
  }
}
