'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Rocket, Sparkles, Lock, Mail, User, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/app/actions/email'

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)

    useEffect(() => {
        // Prefetch the dashboard for instant navigation
        router.prefetch('/dashboard')

        if (searchParams.get('tab') === 'signup') {
            setIsLogin(false)
        }
    }, [searchParams, router])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Password strength calculator
    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length >= 8) strength++
        if (pwd.length >= 12) strength++
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
        if (/\d/.test(pwd)) strength++
        if (/[^a-zA-Z\d]/.test(pwd)) strength++
        return Math.min(strength, 4)
    }

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(password))
    }, [password])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    setError(error.message)
                } else {
                    router.push('/dashboard')
                    router.refresh()
                }
            } else {
                // Validation for signup
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setIsLoading(false)
                    return
                }
                if (!agreedToTerms) {
                    setError('Please accept the terms and conditions')
                    setIsLoading(false)
                    return
                }
                if (passwordStrength < 2) {
                    setError('Please use a stronger password')
                    setIsLoading(false)
                    return
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                })

                if (error) {
                    setError(error.message)
                } else if (!data.session) {
                    // User created but session missing -> Email confirmation likely required
                    setError(null)
                    alert('Account created! Please check your email to confirm your account before signing in.')

                    // Fire-and-forget welcome email (it might fail if Resend isn't set up yet, but we catch it in the action)
                    sendWelcomeEmail(email, fullName)

                    setIsLogin(true) // Switch to login tab
                } else {
                    // Success with session -> Redirect
                    sendWelcomeEmail(email, fullName)
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        } catch (e) {
            console.error("Auth Error:", e)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-slate-200'
        if (passwordStrength <= 1) return 'bg-red-500'
        if (passwordStrength === 2) return 'bg-orange-500'
        if (passwordStrength === 3) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return ''
        if (passwordStrength <= 1) return 'Weak'
        if (passwordStrength === 2) return 'Fair'
        if (passwordStrength === 3) return 'Good'
        return 'Strong'
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first')
            return
        }
        setIsLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        })

        if (error) {
            setError(error.message)
        } else {
            alert('Password reset link sent to your email!')
        }
        setIsLoading(false)
    }




    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100 font-inter overflow-hidden">

            {/* LEFT PANEL - BRAND & ILLUSTRATION */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-16 flex-col justify-between">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHs0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                            <Rocket className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-outfit font-bold text-2xl text-white">ScriptGo</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-8 max-w-lg">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                            Start creating viral content today
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Join thousands of creators using AI-powered scripts to scale their influence across all platforms.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 pt-4">
                        {[
                            'AI-powered script generation in seconds',
                            'Multi-platform optimization',
                            'Data-driven content frameworks',
                            'Save and organize all your scripts'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-white/90 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center gap-8 text-white/70 text-sm">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Help</Link>
                </div>
            </div>

            {/* RIGHT PANEL - AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Rocket className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-outfit font-bold text-2xl text-slate-900">ScriptGo</span>
                        </Link>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 p-8 sm:p-10 space-y-8">

                        {/* Tab Switcher */}
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${isLogin
                                    ? 'bg-white text-slate-900 shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all ${!isLogin
                                    ? 'bg-white text-slate-900 shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Header */}
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900">
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p className="text-slate-600">
                                {isLogin
                                    ? 'Sign in to continue to your dashboard'
                                    : 'Start your journey with ScriptGo today'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Full Name - Signup Only */}
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            id="fullName"
                                            type="text"
                                            required={!isLogin}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-12 w-full pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 w-full pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                        Password
                                    </label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 w-full pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Strength - Signup Only */}
                                {!isLogin && password && (
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-slate-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {passwordStrength > 0 && (
                                            <p className="text-xs font-medium text-slate-600">
                                                Password strength: {getPasswordStrengthText()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password - Signup Only */}
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required={!isLogin}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12 w-full pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Terms Checkbox - Signup Only */}
                            {!isLogin && (
                                <div className="flex items-start gap-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                    <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                                        I agree to the{' '}
                                        <Link href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="h-12 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>


                    </div>

                    {/* Security Notice */}
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Your data is secure and encrypted</span>
                        </div>
                        <span className="text-[10px] text-slate-300 mt-2 opacity-50">v1.1.0-clean-auth</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
