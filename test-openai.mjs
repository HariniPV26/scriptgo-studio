import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    console.log('Testing OpenAI Key...');
    console.log('Key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: 'Hello' }],
        });
        console.log('Success:', response.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
