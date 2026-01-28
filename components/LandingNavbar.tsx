'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Rocket } from 'lucide-react'

export function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="fixed top-6 left-0 w-full z-50 px-6">
            <nav className={`max-w-5xl mx-auto h-16 rounded-full border border-white/5 transition-all duration-500 flex items-center justify-between px-8 ${scrolled ? 'bg-black/40 backdrop-blur-2xl shadow-2xl shadow-emerald-500/10 py-2' : 'bg-white/5 backdrop-blur-md'}`}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all">
                        <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-outfit font-black text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">ScriptGo</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'How it Works', 'Pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                        Sign in
                    </Link>
                    <Link
                        href="/login?tab=signup"
                        className="h-10 px-6 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                    >
                        Join now
                    </Link>
                </div>
            </nav>
        </div>
    )
}
