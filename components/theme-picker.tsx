"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemePicker() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const colors = [
        { name: 'Indigo', class: 'theme-indigo', color: '#6366f1' },
        { name: 'Violet', class: 'theme-violet', color: '#8b5cf6' },
        { name: 'Pink', class: 'theme-pink', color: '#ec4899' },
        { name: 'Cyan', class: 'theme-cyan', color: '#06b6d4' },
        { name: 'Orange', class: 'theme-orange', color: '#f97316' },
    ]

    const toggleOpen = () => setIsOpen(!isOpen)

    // Strategy: We will add classes to document.documentElement (html)
    const changeColor = (colorClass: string) => {
        const root = document.documentElement
        root.classList.remove('theme-indigo', 'theme-violet', 'theme-pink', 'theme-cyan', 'theme-orange')
        if (colorClass !== 'theme-indigo') {
            root.classList.add(colorClass)
        }
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-foreground hover:bg-white/5 transition-all"
            >
                <Palette className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 p-1.5 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/10 flex flex-col gap-1 min-w-[140px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Accent Color</div>
                    {colors.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => changeColor(c.class)}
                            className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground text-left group"
                        >
                            <div className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10 group-hover:scale-110 transition-transform" style={{ backgroundColor: c.color }}></div>
                            {c.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
