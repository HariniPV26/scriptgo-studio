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

    // Result state
    const [calendarItems, setCalendarItems] = useState<any[]>([])
    const [selectedItem, setSelectedItem] = useState<any>(null)

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
                    // Trigger generation after a short delay to ensure state is set
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
        try {
            const result = await generateCalendarContent(topic, days, tone, platform, language, framework)
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
            // Bulk insert into scripts table
            const scriptsToInsert = calendarItems.map(item => ({
                user_id: user.id,
                title: item.title,
                platform: platform,
                content: { text: item.content },
                created_at: new Date().toISOString()
            }))

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
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Configuration */}
                <aside className="w-full md:w-80 border-r border-border bg-card/50 backdrop-blur-sm p-6 overflow-y-auto shrink-0 transition-all">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Plan Content</h2>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6 pb-20">
                        {/* Days Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Duration
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[7, 15, 30].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDays(d)}
                                        className={`py-2 rounded-xl text-sm font-bold transition-all border ${days === d
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                            : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                                            }`}
                                    >
                                        {d} Days
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Platform</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'LinkedIn', icon: Linkedin },
                                    { name: 'YouTube', icon: MonitorPlay },
                                    { name: 'TikTok', icon: Sparkles },
                                    { name: 'Instagram', icon: Instagram }
                                ].map((p) => (
                                    <button
                                        key={p.name}
                                        type="button"
                                        onClick={() => setPlatform(p.name)}
                                        className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 border ${platform === p.name
                                            ? 'bg-primary/10 text-primary border-primary shadow-sm'
                                            : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
                                            }`}
                                    >
                                        <p.icon className="h-4 w-4" />
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic / Goal</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="E.g. Daily productivity tips for remote workers..."
                                required
                                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-28 resize-none font-medium"
                            />
                        </div>

                        {/* Tone */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Professional</option>
                                <option>Friendly</option>
                                <option>Witty</option>
                                <option>Persuasive</option>
                                <option>Edgy</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Languages className="h-3 w-3" /> Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option>English</option>
                                <option>Tamil</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>

                        {/* Framework */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <Layers className="h-3 w-3" /> Framework
                            </label>
                            <select
                                value={framework}
                                onChange={(e) => setFramework(e.target.value)}
                                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="None">None</option>
                                <option value="AIDA">AIDA</option>
                                <option value="PAS">PAS</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Wand2 className="h-5 w-5" /> Generate Calendar</>}
                        </button>
                    </form>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 overflow-auto relative">
                    {/* Background noise/gradient */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    {calendarItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                            <div className="h-24 w-24 bg-card rounded-3xl flex items-center justify-center mb-8 ring-1 ring-border shadow-xl">
                                <CalendarIcon className="h-10 w-10 text-primary opacity-20" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">Your Content Journey Starts Here</h2>
                            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                Use the configuration on the left to generate your {days}-day content strategy.
                                We'll create unique titles and scripts for every single day.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-zinc-500">
                                        {days} Day Strategy: {topic}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                            {platform}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <Hash className="h-3 w-3" /> {calendarItems.length} Posts Generated
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveAll}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:opacity-90 rounded-xl font-bold transition-all shadow-xl disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    <span>Save All to Workshop</span>
                                </button>
                            </div>

                            <div className={`grid gap-4 ${days === 30 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                                {calendarItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col ${days === 30 ? 'aspect-square md:aspect-auto' : ''}`}
                                    >
                                        <div className={`p-4 flex-1 ${days === 30 ? 'flex flex-col' : ''}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`${days === 30 ? 'text-2xl' : 'text-4xl'} font-black text-muted-foreground/10 group-hover:text-primary/10 transition-colors`}>
                                                    Day-{String(item.day || idx + 1).padStart(2, '0')}
                                                </span>
                                                <CheckCircle2 className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                                            </div>
                                            <h3 className={`font-bold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors ${days === 30 ? 'text-xs' : 'text-sm'}`}>
                                                {item.title}
                                            </h3>
                                            {days !== 30 && (
                                                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed opacity-70">
                                                    {item.content}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="w-full py-2 bg-muted/30 border-t border-border text-[10px] font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1"
                                        >
                                            {days === 30 ? 'View' : 'View Script'} <ChevronRight className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal for viewing script */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
                    <div className="relative bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="font-black text-primary text-xs">Day-{String(selectedItem.day).padStart(2, '0')}</span>
                                </div>
                                <h3 className="font-bold text-xl">{selectedItem.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCopy(selectedItem.content)}
                                    className="p-2.5 rounded-xl bg-muted hover:bg-muted-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                                    title="Copy to clipboard"
                                >
                                    <Copy className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2.5 rounded-xl bg-muted hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-primary/20">
                            {selectedItem.content}
                        </div>
                        <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
