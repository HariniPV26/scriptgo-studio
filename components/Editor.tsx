'use client'

import { useState } from 'react'
import { generateScript } from '@/app/editor/actions'
import { generateCalendarContent } from '@/app/calendar/actions'
import { Loader2, Save, Copy, Wand2, ArrowLeft, Menu, X, Sparkles, MonitorPlay, Linkedin, Instagram, Languages, Layers, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { sendScriptEmail } from '@/app/actions/email'
import { Mail as MailIcon } from 'lucide-react'

interface EditorProps {
    initialData?: any
    scriptId?: string
}

export default function Editor({ initialData, scriptId }: EditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)

    // Calendar mode state
    const [isCalendarMode, setIsCalendarMode] = useState(false)
    const [calendarDays, setCalendarDays] = useState(7)

    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
    const [title, setTitle] = useState(initialData?.title || '')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('None')

    // checking for legacy 'visual' structure or new 'text' structure
    const getInitialContent = () => {
        if (!initialData?.content) return ''
        if (typeof initialData.content === 'string') return initialData.content
        if (initialData.content.text) return initialData.content.text
        if (initialData.content.visual) {
            return initialData.content.visual.map((v: string, i: number) => `[Visual]: ${v}\n[Audio]: ${initialData.content.audio[i]}`).join('\n\n')
        }
        return ''
    }

    const [content, setContent] = useState<string>(getInitialContent())

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowMobileSidebar(false)

        try {
            if (isCalendarMode) {
                const params = new URLSearchParams({
                    topic,
                    days: calendarDays.toString(),
                    platform,
                    tone,
                    language,
                    framework,
                    autoGenerate: 'true'
                })
                router.push(`/calendar?${params.toString()}`)
                return
            }
            const result = await generateScript(topic, tone, platform, language, framework)
            setContent(result.text)
            if (!title) setTitle(`${platform} Script: ${topic}`)
        } catch (error) {
            console.error(error)
            alert('Failed to generate')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        const scriptData = {
            user_id: user.id,
            title: title || 'Untitled Script',
            platform,
            content: { text: content }
        }

        let resultId = scriptId

        if (scriptId) {
            const { error } = await supabase
                .from('scripts')
                .update(scriptData)
                .eq('id', scriptId)

            if (error) {
                console.error("Save error:", error)
                alert("Failed to save")
            }
        } else {
            const { data, error } = await supabase
                .from('scripts')
                .insert(scriptData)
                .select()
                .single()

            if (error) {
                console.error("Save error:", error)
                alert("Failed to save")
            } else if (data) {
                resultId = data.id
            }
        }

        setSaving(false)

        if (resultId) {
            router.push('/dashboard')
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        alert('Script copied to clipboard!')
    }

    const [sendingEmail, setSendingEmail] = useState(false)
    const handleEmail = async () => {
        setSendingEmail(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || !user.email) {
            router.push('/login')
            return
        }

        const result = await sendScriptEmail(user.email, title || 'Untitled Script', content)

        if (result.success) {
            alert('Script sent to your email!')
        } else {
            alert('Failed to send email. Ensure your Resend API key is configured.')
        }
        setSendingEmail(false)
    }


    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans selection:bg-primary/30">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md z-40">
                <Link href="/dashboard" className="text-muted-foreground flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                </div>
                <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-foreground">
                    {showMobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Left Sidebar - Command Center */}
            <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6' : 'hidden md:flex w-[340px] bg-background border-r border-white/5 p-8'
                } flex-col transition-all duration-300 relative z-10 custom-scrollbar`}>

                <div className="mb-10">
                    <Link href="/dashboard" className="inline-flex items-center gap-3 group text-sm font-bold text-muted-foreground hover:text-foreground transition-all">
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Back to dashboard
                    </Link>
                </div>

                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                        <Wand2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-outfit tracking-tight">Studio</h2>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Configure Generation</p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-8 flex-1 overflow-y-auto pb-6 scrollbar-none">
                    {/* Platform Selector */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-between">
                            Platform
                            <span className="h-1 w-1 rounded-full bg-primary/40 animate-pulse"></span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', bg: 'hover:bg-blue-500/10' },
                                { name: 'YouTube', icon: MonitorPlay, color: 'text-red-500', bg: 'hover:bg-red-500/10' },
                                { name: 'TikTok', icon: Sparkles, color: 'text-pink-500', bg: 'hover:bg-pink-500/10' },
                                { name: 'Instagram', icon: Instagram, color: 'text-purple-500', bg: 'hover:bg-purple-500/10' }
                            ].map((p) => (
                                <button
                                    key={p.name}
                                    type="button"
                                    onClick={() => setPlatform(p.name)}
                                    className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all duration-300 flex flex-col items-center gap-3 border-2 ${platform === p.name
                                        ? `bg-primary/10 border-primary text-primary shadow-xl shadow-primary/10`
                                        : `bg-white/5 border-transparent text-muted-foreground ${p.bg}`
                                        }`}
                                >
                                    <p.icon className={`h-5 w-5 ${platform === p.name ? 'text-primary' : p.color}`} />
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic Area */}
                    <div className="space-y-4">
                        <label htmlFor="topic" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Objective</label>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Describe your vision..."
                            required={!scriptId && !content}
                            className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.02] h-32 resize-none placeholder:text-muted-foreground/30 font-medium text-sm transition-all shadow-inner"
                        />
                    </div>

                    {/* Tone & Language & Framework Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="tone" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Aesthetic / Tone</label>
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full h-12 px-5 bg-white/5 border border-white/5 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer text-sm font-bold transition-all hover:bg-white/[0.08]"
                            >
                                <option className="bg-background">Professional</option>
                                <option className="bg-background">Friendly</option>
                                <option className="bg-background">Witty</option>
                                <option className="bg-background">Persuasive</option>
                                <option className="bg-background">Edgy</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label htmlFor="language" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Language</label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full h-11 px-4 bg-white/5 border border-white/5 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer text-[10px] font-bold transition-all"
                                >
                                    <option className="bg-background">English</option>
                                    <option className="bg-background">Tamil</option>
                                    <option className="bg-background">Hindi</option>
                                    <option className="bg-background">Spanish</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="framework" className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Framework</label>
                                <select
                                    id="framework"
                                    value={framework}
                                    onChange={(e) => setFramework(e.target.value)}
                                    className="w-full h-11 px-4 bg-white/5 border border-white/5 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer text-[10px] font-bold transition-all"
                                >
                                    <option value="None" className="bg-background">None</option>
                                    <option value="AIDA" className="bg-background">AIDA</option>
                                    <option value="PAS" className="bg-background">PAS</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="pt-4 space-y-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                Strategy Mode
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsCalendarMode(!isCalendarMode)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isCalendarMode ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isCalendarMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {isCalendarMode && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-muted-foreground">CAMPAIGN DURATION</span>
                                    <span className="text-primary">{calendarDays} Days</span>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="30"
                                    value={calendarDays}
                                    onChange={(e) => setCalendarDays(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-[9px] text-muted-foreground leading-tight italic">
                                    Generates a cohesive content matrix for the selected period.
                                </p>
                            </div>
                        )}
                    </div>


                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 relative overflow-hidden bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-[0.98] mt-4 ${loading ? 'animate-pulse opacity-90' : 'shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1'}`}
                    >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="h-4 w-4" />
                            )}
                            <span className="text-xs">{isCalendarMode ? 'Build Matrix' : 'Generate'}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                    </button>
                </form>
            </div>

            {/* Main Editor Surface */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FAF9F6] dark:bg-[#0D0D0E]">
                {/* Status Bar */}
                <div className="h-20 border-b border-black/[0.03] dark:border-white/5 bg-background/50 backdrop-blur-3xl flex items-center justify-between px-10 z-10 shrink-0">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Untitled Masterpiece"
                            className="bg-transparent text-xl font-bold font-outfit text-foreground focus:outline-none placeholder:text-muted-foreground/30 w-full transition-all"
                        />
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${saving ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted text-muted-foreground opacity-40'}`}>
                            {saving ? 'Syncing...' : 'Synced'}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCopy}
                            disabled={!content}
                            className="h-10 px-4 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-xl text-xs font-bold disabled:opacity-30"
                        >
                            <Copy className="h-4 w-4" />
                            Copy
                        </button>
                        <button
                            onClick={handleEmail}
                            disabled={!content || sendingEmail}
                            className="h-10 px-4 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-xl text-xs font-bold disabled:opacity-30"
                        >
                            {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MailIcon className="h-4 w-4" />}
                            Email
                        </button>

                        <div className="h-4 w-px bg-black/[0.05] dark:bg-white/10 mx-2"></div>
                        <button
                            onClick={handleSave}
                            disabled={saving || !content}
                            className="h-11 px-6 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.05] shadow-xl active:scale-95 disabled:opacity-30"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            <span className="ml-2">Deliver</span>
                        </button>
                    </div>
                </div>

                {/* Editor Texture Area */}
                <div className="flex-1 overflow-auto p-12 relative z-0 custom-scrollbar flex flex-col items-center">
                    {!content ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground space-y-8 max-w-2xl text-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
                                <div className="h-32 w-32 bg-background border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 glass-card">
                                    <Sparkles className="h-12 w-12 text-primary animate-bounce-slow" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-4xl font-black text-foreground font-outfit tracking-tighter">Your Story Starts Here</h3>
                                <p className="text-muted-foreground/80 font-medium leading-relaxed max-w-sm mx-auto">
                                    Configure your target and topic on the left to see the AI engine in action.
                                </p>
                            </div>
                            <div className="flex gap-4 opacity-40">
                                <Linkedin className="h-4 w-4" />
                                <MonitorPlay className="h-4 w-4" />
                                <Sparkles className="h-4 w-4" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl h-full pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="saas-card p-0 h-full border-black/[0.03] dark:border-white/5 bg-background dark:bg-background/40 shadow-premium">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full p-12 bg-transparent text-foreground focus:outline-none resize-none font-sans text-lg font-medium leading-relaxed custom-scrollbar selection:bg-primary/20"
                                    placeholder="Type your content here..."
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
