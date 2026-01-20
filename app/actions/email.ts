'use server'

import { resend } from '@/utils/resend'

/**
 * Sends a welcome email to a new user.
 */
export async function sendWelcomeEmail(email: string, fullName?: string) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123456789') {
        console.log('Skipping welcome email: RESEND_API_KEY not configured.')
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to ScriptGo! 🚀',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #10b981;">Welcome to ScriptGo, ${fullName || 'Creator'}!</h1>
                    <p>We're thrilled to have you on board. Your journey to creating high-fidelity, viral content starts now.</p>
                    <p>With ScriptGo, you can:</p>
                    <ul>
                        <li>Generate AI-powered scripts in seconds</li>
                        <li>Optimize content for LinkedIn, YouTube, TikTok, and Instagram</li>
                        <li>Plan your content strategy with our visual calendar</li>
                    </ul>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://scriptgo.vercel.app'}/dashboard" 
                       style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                       Go to Dashboard
                    </a>
                    <p style="margin-top: 30px; color: #64748b; font-size: 14px;">If you have any questions, just reply to this email!</p>
                </div>
            `,
        })

        if (error) {
            console.error('Resend Error:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Failed to send welcome email:', error)
        return { success: false, error }
    }
}

/**
 * Sends a password reset email.
 */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123456789') {
        console.log('Skipping reset email: RESEND_API_KEY not configured.')
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <auth@resend.dev>',
            to: [email],
            subject: 'Reset your ScriptGo password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Reset Password</h1>
                    <p>You requested a password reset for your ScriptGo account.</p>
                    <p>Click the button below to set a new password:</p>
                    <a href="${resetLink}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                       Reset Password
                    </a>
                    <p style="margin-top: 30px; color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        })

        if (error) return { success: false, error }
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}

/**
 * Sends a generated script to the user's email.
 */
export async function sendScriptEmail(email: string, scriptTitle: string, scriptContent: string) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123456789') {
        console.log('Skipping script email: RESEND_API_KEY not configured.')
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <studio@resend.dev>',
            to: [email],
            subject: `Your Script: ${scriptTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">Your Script is Ready!</h2>
                    <p>Here is the content for <strong>${scriptTitle}</strong>:</p>
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; white-space: pre-wrap; margin: 20px 0; border: 1px solid #e2e8f0;">
                        ${scriptContent}
                    </div>
                    <p>Keep creating!</p>
                </div>
            `,
        })

        if (error) return { success: false, error }
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}
