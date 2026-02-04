import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Say hello' }],
        });
        console.log('SUCCESS:', response.choices[0].message.content);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

test();
