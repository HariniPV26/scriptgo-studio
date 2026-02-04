import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log('Testing Gemini Key...');
    console.log('Key:', process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10) + '...');

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: 'Say hello',
        });
        console.log('Success:', text);
    } catch (error) {
        console.error('Error Message:', error.message);
        console.error('Error Data:', error.data);
    }
}

test();
