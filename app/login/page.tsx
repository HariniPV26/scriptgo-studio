'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Sparkles } from 'lucide-react'

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
                    // options: { emailRedirectTo: `${location.origin}/auth/callback` } // optional
                })
                if (error) {
                    setError(error.message)
                } else {
                    // For auto-confirm or confirm-email flow
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        } catch (e) {
            console.error("Login Error:", e)
            setError('An unexpected error occurred: ' + (e instanceof Error ? e.message : String(e)))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '7s' }}></div>

            <div className="w-full max-w-md space-y-8 z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative h-16 w-16 bg-background rounded-xl flex items-center justify-center border border-border">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                        {isLogin ? 'Welcome back' : 'Join ScriptGo'}
                    </h2>
                    <p className="mt-3 text-muted-foreground text-lg">
                        {isLogin
                            ? 'Your creative AI partner awaits.'
                            : 'Create viral scripts in seconds.'}
                    </p>
                </div>

                <div className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden">
                    {/* Fancy Tabs */}
                    <div className="flex p-2 gap-2 bg-muted/20">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${isLogin
                                ? 'bg-background text-foreground shadow-lg ring-1 ring-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${!isLogin
                                ? 'bg-background text-foreground shadow-lg ring-1 ring-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-8 pt-6">
                        <form action={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 text-sm font-medium text-red-600 dark:text-red-200 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 bg-background/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                                    placeholder="creator@scriptgo.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-3 bg-background/50 border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        isLogin ? 'Sign in to Dashboard' : 'Create Free Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
