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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

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
                } else {
                    // Success -> Redirect immediately since email confirmation is off
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        } catch (e: any) {
            console.error("Auth Error:", e)
            setError(e.message || 'An unexpected error occurred. Please try again.')
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
        <div className="min-h-screen flex bg-[#0A0A0B] text-white font-inter overflow-hidden relative">
            {/* Mesh Gradients & Graphics */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* 3D Abstract Graphics */}
                <div
                    className="absolute inset-0 bg-[url('/images/waves-bg.png')] bg-cover bg-center opacity-[0.15] mix-blend-overlay animate-pulse"
                ></div>

                <div
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] transition-transform duration-1000"
                    style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)` }}
                ></div>
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] transition-transform duration-1000"
                    style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
                ></div>
            </div>

            {/* LEFT PANEL - BRAND & ILLUSTRATION */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white/[0.02] border-r border-white/5 p-16 flex-col justify-between">
                {/* Logo */}
                <div className="relative z-10 transition-transform duration-500" style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Rocket className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-outfit font-black text-2xl tracking-tight text-white">ScriptGo</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div
                    className="relative z-10 space-y-10 max-w-lg transition-transform duration-500"
                    style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Join the Elite</span>
                        </div>
                        <h1 className="text-6xl font-black font-outfit uppercase tracking-tighter leading-[0.9]">
                            Create the <br />
                            <span className="text-emerald-400 italic">Future</span> of <br />
                            Content.
                        </h1>
                        <p className="text-lg text-white/40 leading-relaxed font-medium">
                            The ultimate AI production studio for modern creators. Build your influence with data-driven scripts.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            'AI-powered script generation',
                            'Multi-platform optimization',
                            'High-fidelity visual storyboards',
                            'Integrated content strategy'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                                <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center transition-colors group-hover:bg-emerald-500/20">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                </div>
                                <span className="text-white/60 text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-emerald-400 transition-colors">Support</Link>
                </div>
            </div>

            {/* RIGHT PANEL - AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div
                    className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 transition-transform duration-500"
                    style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
                >

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Rocket className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-outfit font-black text-2xl text-white">ScriptGo</span>
                        </Link>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-white/[0.03] backdrop-blur-2xl px-1 rounded-[2.5rem] border border-white/10 relative overflow-hidden transition-all duration-500 group shadow-[0_0_80px_rgba(16,185,129,0.05)]">
                        {/* Shimmer Effect Overlay */}
                        <div className="absolute inset-0 shimmer pointer-events-none opacity-[0.4]"></div>

                        {/* Internal Glow */}
                        <div
                            className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10 transition-transform duration-1000"
                            style={{ transform: `translate(${mousePos.x * 80}px, ${mousePos.y * 80}px)` }}
                        ></div>

                        <div className="p-8 sm:p-12 space-y-10">
                            {/* Tab Switcher */}
                            <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-white/40 hover:text-white'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {/* Header */}
                            <div className="space-y-3">
                                <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">
                                    {isLogin ? 'Welcome Back' : 'Get Started'}
                                </h2>
                                <p className="text-white/40 text-sm font-medium leading-relaxed">
                                    {isLogin
                                        ? 'Enter your credentials to access your studio'
                                        : 'Create your account to start generating viral content'}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <p className="text-xs text-red-200 font-bold">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Full Name - Signup Only */}
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="text"
                                                required={!isLogin}
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="h-14 w-full pl-12 pr-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:border-emerald-500/30 focus:bg-white/[0.05] outline-none transition-all text-sm font-medium"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 w-full pl-12 pr-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:border-emerald-500/30 focus:bg-white/[0.05] outline-none transition-all text-sm font-medium"
                                            placeholder="you@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Password</label>
                                        {isLogin && (
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 w-full pl-12 pr-12 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:border-emerald-500/30 focus:bg-white/[0.05] outline-none transition-all text-sm font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength - Signup Only */}
                                    {!isLogin && password && (
                                        <div className="pt-2 px-1">
                                            <div className="flex gap-1.5 h-1">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`flex-1 rounded-full transition-all duration-500 ${level <= passwordStrength ? getPasswordStrengthColor().replace('text-', 'bg-') : 'bg-white/5'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password - Signup Only */}
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required={!isLogin}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-14 w-full pl-12 pr-12 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:border-emerald-500/30 focus:bg-white/[0.05] outline-none transition-all text-sm font-medium"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Terms & Conditions - Signup Only */}
                                {!isLogin && (
                                    <div className="flex items-start gap-3 px-1">
                                        <button
                                            type="button"
                                            onClick={() => setAgreedToTerms(!agreedToTerms)}
                                            className={`mt-0.5 h-5 w-5 rounded-lg border transition-all flex items-center justify-center ${agreedToTerms ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 bg-white/5'}`}
                                        >
                                            {agreedToTerms && <CheckCircle2 className="h-3 w-3 text-white" />}
                                        </button>
                                        <label className="text-xs text-white/40 font-medium leading-relaxed">
                                            I agree to the <Link href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link> and <Link href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link>
                                        </label>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-14 w-full bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Sign In' : 'Create Account'}
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-3 text-white/10">
                        <Shield className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enterprise-Grade Security</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
