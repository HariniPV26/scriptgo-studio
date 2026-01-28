'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, Rocket, Calendar, LayoutDashboard, Settings, Menu, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ModeToggle } from './mode-toggle'
import { ThemePicker } from './theme-picker'
import { useState } from 'react'

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.refresh()
    }

    const navLinks = [
        { href: '/dashboard', label: 'Workshop', icon: LayoutDashboard },
        { href: '/editor', label: 'Studio', icon: Rocket },
        { href: '/calendar', label: 'Calendar', icon: Calendar },
    ]

    return (
        <>
            <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-50 transition-all">
                <div className="flex items-center gap-10">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
                            <Rocket className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-outfit font-black text-xl tracking-tight text-white uppercase">ScriptGo<span className="text-emerald-400 font-light lowercase">.studio</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group
                                        ${isActive
                                            ? 'text-white bg-white/10'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-emerald-400' : 'text-current/40 group-hover:text-white'}`} />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pro Studio</span>
                        </div>
                        <ThemePicker />
                        <ModeToggle />
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
                        title="Sign Out"
                    >
                        <span>Sign out</span>
                        <LogOut className="h-3.5 w-3.5" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-3xl p-8 animate-in fade-in slide-in-from-top-8">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                                    ${pathname === link.href
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-12 pt-8 border-t border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Studio Prefs</span>
                            <div className="flex items-center gap-4">
                                <ThemePicker />
                                <ModeToggle />
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                handleSignOut()
                                setMobileMenuOpen(false)
                            }}
                            className="w-full h-14 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest"
                        >
                            Terminate Session
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
