'use server'

import { resend } from '@/utils/resend'

/**
 * Sends a welcome email to a new user.
 */
export async function sendWelcomeEmail(email: string, fullName?: string) {
    if (!process.env.RESEND_API_KEY) {
        console.log('Skipping welcome email: RESEND_API_KEY not configured.')
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to ScriptGo! 🚀',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 40px;">🚀</span>
                    </div>
                    <h1 style="color: #0f172a; text-align: center; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Welcome to the Future of Content, ${fullName || 'Creator'}!</h1>
                    <p style="color: #475569; line-height: 1.6; font-size: 16px;">We're thrilled to have you on board. ScriptGo is your new secret weapon for creating high-fidelity, viral content in seconds.</p>
                    
                    <div style="margin: 32px 0; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
                        <h3 style="margin-top: 0; color: #0f172a;">What's next?</h3>
                        <ul style="color: #475569; padding-left: 20px; margin-bottom: 0;">
                            <li>Generate AI-powered scripts for any platform</li>
                            <li>Visualize your storyboard with AI-generated scenes</li>
                            <li>Plan your content calendar for the week</li>
                        </ul>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
                           style="display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; transition: all 0.2s;">
                           Launch Your Studio
                        </a>
                    </div>
                    
                    <p style="margin-top: 40px; color: #94a3b8; font-size: 12px; text-align: center; border-top: 1px solid #e2e8f0; pt-20">
                        © 2026 ScriptGo. If you have any questions, just reply to this email!
                    </p>
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
    if (!process.env.RESEND_API_KEY) {
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <auth@resend.dev>',
            to: [email],
            subject: 'Reset your ScriptGo password',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Reset Password</h1>
                    <p style="color: #475569; line-height: 1.6;">You requested a password reset for your ScriptGo account.</p>
                    <p style="color: #475569; line-height: 1.6;">Click the button below to set a new password. This link will expire shortly.</p>
                    
                    <div style="margin: 32px 0; text-align: center;">
                        <a href="${resetLink}" 
                           style="display: inline-block; padding: 16px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">
                           Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
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
    if (!process.env.RESEND_API_KEY) {
        return { success: false, message: 'Resend API key not configured' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'ScriptGo <studio@resend.dev>',
            to: [email],
            subject: `Ready for Production: ${scriptTitle}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;">
                    <div style="margin-bottom: 30px;">
                        <span style="font-size: 32px;">🎬</span>
                    </div>
                    <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 10px;">Your Script is Ready!</h2>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Production content for: <strong>${scriptTitle}</strong></p>
                    
                    <div style="background-color: #f8fafc; padding: 32px; border-radius: 16px; white-space: pre-wrap; margin: 24px 0; border: 1px solid #f1f5f9; color: #0f172a; line-height: 1.8; font-size: 15px;">
                        ${scriptContent}
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
                           style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">
                           View in Studio
                        </a>
                    </div>
                    
                    <p style="margin-top: 40px; color: #94a3b8; font-size: 11px; text-align: center;">
                        Sent from ScriptGo Studio. Keep creating!
                    </p>
                </div>
            `,
        })

        if (error) return { success: false, error }
        return { success: true, data }
    } catch (error) {
        return { success: false, error }
    }
}
