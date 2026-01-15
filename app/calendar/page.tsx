'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    Calendar as CalendarIcon,
    Wand2,
    Loader2,
    ChevronRight,
    MonitorPlay,
    Linkedin,
    Instagram,
    Sparkles,
    Languages,
    Layers,
    Clock,
    CheckCircle2,
    X,
    Copy,
    Hash,
    Save
} from 'lucide-react'
import { generateCalendarContent } from './actions'

export default function ContentCalendarPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [authLoading, setAuthLoading] = useState(true)

    // Form state
    const [topic, setTopic] = useState('')
    const [days, setDays] = useState(7)
    const [platform, setPlatform] = useState('LinkedIn')
    const [tone, setTone] = useState('Professional')
    const [language, setLanguage] = useState('English')

    const [framework, setFramework] = useState('None')
    // new Date().toISOString().split('T')[0] gives YYYY-MM-DD
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

    // Result state
    const [calendarItems, setCalendarItems] = useState<any[]>([])
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
            } else {
                setUser(user)

                // Handle search params for auto-generation
                const searchParams = new URLSearchParams(window.location.search)
                const topicParam = searchParams.get('topic')
                const daysParam = searchParams.get('days')
                const platformParam = searchParams.get('platform')
                const toneParam = searchParams.get('tone')
                const langParam = searchParams.get('language')
                const frameworkParam = searchParams.get('framework')
                const autoGen = searchParams.get('autoGenerate')

                if (topicParam) setTopic(topicParam)
                if (daysParam) setDays(parseInt(daysParam))
                if (platformParam) setPlatform(platformParam)
                if (toneParam) setTone(toneParam)
                if (langParam) setLanguage(langParam)
                if (frameworkParam) setFramework(frameworkParam)

                if (autoGen === 'true' && topicParam) {
                    setTimeout(() => {
                        const form = document.querySelector('form')
                        if (form) form.requestSubmit()
                    }, 500)
                }
            }
            setAuthLoading(false)
        }
        checkUser()
    }, [router])

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowMobileSidebar(false)
        try {
            const result = await generateCalendarContent(topic, days, tone, platform, language, framework, startDate)
            if (result.items && result.items.length > 0) {
                setCalendarItems(result.items)
            } else if (result.error) {
                alert(result.error)
            } else {
                alert('No content was generated. Please try again.')
            }
        } catch (error: any) {
            console.error('Generation error:', error)
            alert(`Failed to generate calendar: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveAll = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setSaving(true)
        const supabase = createClient()

        try {
            const scriptsToInsert = calendarItems.map(item => {
                const date = new Date(startDate)
                date.setDate(date.getDate() + (item.day - 1))

                return {
                    user_id: user.id,
                    title: item.title,
                    platform: platform,
                    content: { text: item.content },
                    label: item.label,
                    scheduled_for: date.toISOString(),
                    created_at: new Date().toISOString()
                }
            })

            const { error } = await supabase
                .from('scripts')
                .insert(scriptsToInsert)

            if (error) throw error

            alert(`Successfully saved ${calendarItems.length} posts to your Workshop!`)
            router.push('/dashboard')
        } catch (error) {
            console.error('Save All Error:', error)
            alert('Failed to save posts.')
        } finally {
            setSaving(false)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
            <Header />

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed bottom-6 right-6 z-[60]">
                <button
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                >
                    {showMobileSidebar ? <X className="h-6 w-6" /> : <Wand2 className="h-6 w-6" />}
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar - Command Center */}
                <aside className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-8 pt-20' : 'hidden md:block w-[360px]'
                    } border-r border-white/5 bg-background p-8 overflow-y-auto shrink-0 transition-all custom-scrollbar z-10 relative`}>

                    {/* Mobile Close Button (Alternative to the FAB) */}
                    {showMobileSidebar && (
                        <button
                            onClick={() => setShowMobileSidebar(false)}
                            className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center text-muted-foreground"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}

                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-outfit tracking-tight">Strategy</h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Plan Content Loop</p>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-8 pb-32">
                        {/* Days Selection */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-between">
                                Horizon
                                <span className="h-1 w-1 rounded-full bg-primary animate-pulse"></span>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[7, 15, 30].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDays(d)}
                                        className={`py-3 px-1 rounded-xl text-[10px] font-black tracking-widest transition-all border-2 ${days === d
                                            ? 'bg-primary/10 text-primary border-primary shadow-xl shadow-primary/10'
                                            : 'bg-white/5 text-muted-foreground border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        {d} DAYS
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deployment Start</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-12 px-5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Platform Vector</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' },
                                    { name: 'YouTube', icon: MonitorPlay, color: 'text-red-500' },
                                    { name: 'TikTok', icon: Sparkles, color: 'text-pink-500' },
                                    { name: 'Instagram', icon: Instagram, color: 'text-purple-500' }
                                ].map((p) => (
                                    <button
                                        key={p.name}
                                        type="button"
                                        onClick={() => setPlatform(p.name)}
                                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all duration-300 flex flex-col items-center gap-2 border-2 ${platform === p.name
                                            ? 'bg-primary/10 text-primary border-primary shadow-lg shadow-primary/10'
                                            : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'
                                            }`}
                                    >
                                        <p.icon className={`h-5 w-5 ${platform === p.name ? 'text-primary' : p.color}`} />
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Central Theme</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="E.g. Daily productivity tips for remote workers..."
                                required
                                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 h-32 resize-none font-medium placeholder:text-muted-foreground/30 transition-all shadow-inner"
                            />
                        </div>

                        {/* Advanced Rows */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Target Aesthetic</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full h-12 px-5 bg-white/5 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none font-bold cursor-pointer hover:bg-white/10 transition-colors text-foreground"
                                >
                                    <option className="bg-background">Professional</option>
                                    <option className="bg-background">Friendly</option>
                                    <option className="bg-background">Witty</option>
                                    <option className="bg-background">Persuasive</option>
                                    <option className="bg-background">Edgy</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full h-11 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] focus:outline-none font-bold"
                                >
                                    <option className="bg-background">English</option>
                                    <option className="bg-background">Tamil</option>
                                    <option className="bg-background">Hindi</option>
                                </select>
                                <select
                                    value={framework}
                                    onChange={(e) => setFramework(e.target.value)}
                                    className="w-full h-11 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] focus:outline-none font-bold"
                                >
                                    <option value="None" className="bg-background">No Framework</option>
                                    <option value="AIDA" className="bg-background">AIDA</option>
                                    <option value="PAS" className="bg-background">PAS</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 relative overflow-hidden bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-[0.98] ${loading ? 'animate-pulse opacity-90' : 'shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1'}`}
                        >
                            <div className="flex items-center justify-center gap-3 relative z-10">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>
                                    <Wand2 className="h-5 w-5" />
                                    <span className="text-xs">Compile System</span>
                                </>}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                        </button>
                    </form>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-10 overflow-auto relative custom-scrollbar bg-[#FAF9F6] dark:bg-[#0D0D0E]">
                    {calendarItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000 max-w-2xl mx-auto">
                            <div className="relative mb-10">
                                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
                                <div className="h-32 w-32 bg-background border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 glass-card">
                                    <CalendarIcon className="h-12 w-12 text-primary animate-bounce-slow" />
                                </div>
                            </div>
                            <h2 className="text-5xl font-outfit font-black mb-6 tracking-tight">Strategy Blueprint</h2>
                            <p className="text-muted-foreground leading-relaxed text-xl max-w-lg mx-auto">
                                Define your vision on the left to architect a high-converting {days}-day content ecosystem.
                            </p>
                            <div className="mt-12 flex gap-10 opacity-20 filter grayscale">
                                <Linkedin className="h-6 w-6" />
                                <MonitorPlay className="h-6 w-6" />
                                <Sparkles className="h-6 w-6" />
                                <Instagram className="h-6 w-6" />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 pb-32">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 sticky top-0 z-20 bg-background/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-black/[0.03] dark:border-white/5 shadow-premium">
                                <div className="max-w-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary text-white tracking-[0.2em] uppercase">Tactical Map</span>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{days} Days Output</span>
                                    </div>
                                    <h2 className="text-3xl font-bold font-outfit tracking-tight leading-tight truncate">
                                        {topic}
                                    </h2>
                                </div>
                                <button
                                    onClick={handleSaveAll}
                                    disabled={saving}
                                    className="h-14 px-10 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.05] shadow-2xl active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    <span className="ml-3">Deploy All Posts</span>
                                </button>
                            </div>

                            <div className={`grid gap-6 ${days === 30 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                {calendarItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group saas-card p-0 overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-500"
                                    >
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                                        {(() => {
                                                            const d = new Date(startDate);
                                                            d.setDate(d.getDate() + (item.day - 1));
                                                            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                        })()}
                                                    </span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-0.5 rounded border border-black/[0.05] dark:border-white/5 w-fit">
                                                        {item.label || 'Tactical'}
                                                    </span>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center border border-black/[0.03] dark:border-white/5">
                                                    {platform === 'LinkedIn' ? <Linkedin className="h-4 w-4 text-blue-500" /> :
                                                        platform === 'YouTube' ? <MonitorPlay className="h-4 w-4 text-red-500" /> :
                                                            <Sparkles className="h-4 w-4 text-pink-500" />}
                                                </div>
                                            </div>
                                            <h3 className={`font-bold font-outfit mb-3 leading-tight group-hover:text-primary transition-colors ${days === 30 ? 'text-sm' : 'text-xl'}`}>
                                                {item.title}
                                            </h3>
                                            {days !== 30 && (
                                                <p className="text-muted-foreground text-xs line-clamp-4 leading-relaxed opacity-70 mb-6 font-medium">
                                                    {item.content}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-black/[0.03] dark:border-white/5">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="w-full h-10 rounded-xl bg-muted/50 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    View Asset
                                                    <ChevronRight className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal - Preview Studio */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedItem(null)}></div>
                    <div className="relative bg-background border border-white/10 w-full max-w-3xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex gap-5">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
                                    <span className="font-outfit font-black text-primary text-base leading-none">D{selectedItem.day}</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-outfit font-bold text-2xl tracking-tight leading-tight">{selectedItem.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{platform} • {tone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleCopy(selectedItem.content)}
                                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                >
                                    <Copy className="h-5 w-5 group-active:scale-90" />
                                </button>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-10 md:p-12 overflow-y-auto font-sans text-lg font-medium leading-relaxed max-height-[50vh] custom-scrollbar bg-white/[0.01]">
                            {selectedItem.content}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">System v2.45 Output</span>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="h-12 px-8 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
