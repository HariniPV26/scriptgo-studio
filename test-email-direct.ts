import { sendScriptEmail } from './app/actions/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
    console.log('Testing Resend Integration...');
    console.log('Target Email: [EMAIL_ADDRESS]');

    const result = await sendScriptEmail(
        '[EMAIL_ADDRESS]',
        'AI Test Connection',
        'Hello! This is Antigravity. I am triggering this email to verify that your Resend integration is 100% working. If you see this, the connection is solid!'
    );

    if (result.success) {
        console.log('✅ Success! Check your inbox (and spam folder) at [EMAIL_ADDRESS]');
    } else {
        console.error('❌ Failed:', result.message);
    }
}

runTest();
