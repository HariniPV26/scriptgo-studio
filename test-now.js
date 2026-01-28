const { Resend } = require('resend');

const resend = new Resend('re_9wgepSHX_KvKQXziahkV9coVL2V2d5nen');

async function runTest() {
    console.log('--- SYSTEM TEST (NEW KEY) ---');
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['venkataramananharini75@gmail.com'],
            subject: 'New Key Verification: SUCCESS! 🚀',
            html: '<h1>New account verified!</h1><p>Your new Resend API key is working perfectly. Check this inbox!</p>'
        });

        if (error) {
            console.error('❌ Resend Error:', error);
        } else {
            console.log('✅ SENT TO NEW ACCOUNT SUCCESSFULLY!');
            console.log('Check your email: venkataramananharini75@gmail.com');
        }
    } catch (e) {
        console.error('❌ Crash:', e);
    }
}

runTest();
