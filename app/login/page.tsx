'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Sparkles, CheckCircle2, Star, ArrowRight, Rocket, Zap, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)

    useEffect(() => {
        if (searchParams.get('tab') === 'signup') {
            setIsLogin(false)
        }
    }, [searchParams])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const email = formData.get('email') as string
        const password = formData.get('password') as string
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
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) {
                    setError(error.message)
                } else {
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        } catch (e) {
            console.error("Login Error:", e)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#080B12] font-inter text-foreground overflow-hidden">

            {/* STOA INSPIRED LEFT SIDE - HIGH-END 3D VISUAL */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/images/stoa-visual.png"
                        alt="Stoa Visual"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/20 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="h-12 w-12 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all group-hover:scale-110">
                            <Rocket className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-outfit font-black text-3xl tracking-[0.1em] uppercase text-white">ScriptGo</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
                            THE <br /> <span className="text-[#10B981] glow-text">TALENT</span> <br /> ENGINE
                        </h1>
                        <p className="max-w-xs text-white/40 font-bold leading-relaxed uppercase tracking-[0.3em] text-[9px]">
                            Engineered for high-fidelity production // protocol v2.4.0
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        System Status // Optimal
                    </div>
                    <div className="flex gap-6 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer">
                        Help Center
                    </div>
                </div>
            </div>

            {/* STOA INSPIRED RIGHT SIDE - MINIMALIST GLASS FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative bg-[#080B12]">
                <div className="w-full max-w-[500px] space-y-12 animate-in fade-in zoom-in-95 duration-1000">

                    {/* Stoa Content Card */}
                    <div className="bg-[#0B2416]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-16 shadow-[0_40px_120px_rgba(0,0,0,0.7)] relative overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10B981]/10 blur-[100px] pointer-events-none"></div>

                        {/* Tab Switcher */}
                        <div className="grid grid-cols-2 mb-16 border-b border-white/5 relative z-10">
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`pb-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${isLogin ? 'text-[#10B981]' : 'text-white/20 hover:text-white/40'}`}
                            >
                                Login
                                {isLogin && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#10B981] shadow-[0_0_20px_#10B981]"></div>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`pb-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${!isLogin ? 'text-[#10B981]' : 'text-white/20 hover:text-white/40'}`}
                            >
                                Register
                                {!isLogin && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#10B981] shadow-[0_0_20px_#10B981]"></div>}
                            </button>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
                                    <span className="h-1 w-8 bg-[#10B981] rounded-full"></span>
                                    {isLogin ? 'Verify' : 'Initiate'}
                                </h2>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">High-fidelity access // Talent Portal</p>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                await handleSubmit(formData)
                            }} className="space-y-8">

                                {error && (
                                    <div className="p-5 text-[9px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in">
                                        Error // {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-[#10B981] transition-colors" htmlFor="email">
                                            Talent ID
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="h-16 w-full bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/5 focus:border-[#10B981]/40 focus:bg-black/60 outline-none transition-all"
                                                placeholder="talent@network.dev"
                                            />
                                            <Zap className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 opacity-10 group-focus-within:opacity-40 transition-opacity" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-focus-within:text-[#10B981] transition-colors" htmlFor="password">
                                                Security Key
                                            </label>
                                            {isLogin && (
                                                <Link href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-[#10B981] hover:text-white transition-colors">
                                                    Recover
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="h-16 w-full bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white placeholder:text-white/5 focus:border-[#10B981]/40 focus:bg-black/60 outline-none transition-all"
                                                placeholder="••••••••••••••••"
                                            />
                                            <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 opacity-10 group-focus-within:opacity-40 transition-opacity" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-20 w-full rounded-[1.5rem] bg-[#10B981] text-white font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all hover:bg-[#059669] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Execute Login' : 'Authorize Account'} <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="pt-10 border-t border-white/5 flex gap-4">
                                <button className="flex-1 h-14 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:bg-white/[0.05] hover:text-white transition-all">Google</button>
                                <button className="flex-1 h-14 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:bg-white/[0.05] hover:text-white transition-all">Github</button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/10 px-12 leading-relaxed">
                        Authorized access strictly enforced. View our <Link href="#" className="text-white/30 hover:text-[#10B981]">Security Protocols</Link> and <Link href="#" className="text-white/30 hover:text-[#10B981]">Terms of Service</Link>.
                    </p>
                </div>
            </div>

            <style jsx global>{`
                .glow-text {
                    text-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
                }
            `}</style>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#02040A]"><Loader2 className="h-10 w-10 animate-spin text-[#10B981]" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
