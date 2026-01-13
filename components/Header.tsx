'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ModeToggle } from './mode-toggle'
import { ThemePicker } from './theme-picker'

export default function Header() {
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 transition-all">
            <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow duration-300">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">ScriptGo</span>
            </Link>

            <div className="flex items-center gap-4">
                <ThemePicker />
                <ModeToggle />
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                    title="Sign Out"
                >
                    <span className="text-sm font-medium">Sign Out</span>
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    )
}
