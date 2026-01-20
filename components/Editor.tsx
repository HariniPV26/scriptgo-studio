'use client'

import { useState, useEffect } from 'react'
import { generateScript, generateVisuals } from '@/app/editor/actions'
import {
    Loader2, Save, Copy, Wand2, ArrowLeft, Menu, X, Sparkles,
    MonitorPlay, Linkedin, Instagram, Calendar,
    Image as ImageIcon, Mail as MailIcon, Layout, FileText, RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { sendScriptEmail } from '@/app/actions/email'

interface EditorProps {
    initialData?: any
    scriptId?: string
}

export default function Editor({ initialData, scriptId }: EditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [generatingVisuals, setGeneratingVisuals] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)
    const [viewMode, setViewMode] = useState<'script' | 'visuals'>('script')

    const [isCalendarMode, setIsCalendarMode] = useState(false)
    const [calendarDays, setCalendarDays] = useState(7)

    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
    const [title, setTitle] = useState(initialData?.title || '')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('None')
    const [visualData, setVisualData] = useState<any>(null)
    const [seed, setSeed] = useState(Math.floor(Math.random() * 100000))

    const getInitialContent = () => {
        if (!initialData?.content) return ''
        if (typeof initialData.content === 'string') return initialData.content
        if (initialData.content.text) return initialData.content.text
        return ''
    }

    const [content, setContent] = useState<string>(getInitialContent())

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowMobileSidebar(false)
        setVisualData(null)
        setViewMode('script')

        try {
            if (isCalendarMode) {
                const params = new URLSearchParams({
                    topic, days: calendarDays.toString(), platform, tone, language, framework, autoGenerate: 'true'
                })
                router.push(`/calendar?${params.toString()}`)
                return
            }
            const result = await generateScript(topic, tone, platform, language, framework)
            setContent(result.text)
            if (!title) setTitle(`${platform} Script: ${topic}`)
        } catch (error) {
            console.error(error); alert('Failed to generate')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) { router.push('/login'); return }

        const scriptData = {
            user_id: user.id,
            title: title || 'Untitled Script',
            platform,
            content: { text: content, visuals: visualData }
        }

        let resultId = scriptId
        if (scriptId) {
            const { error } = await supabase.from('scripts').update(scriptData).eq('id', scriptId)
            if (error) alert("Failed to save")
        } else {
            const { data, error } = await supabase.from('scripts').insert(scriptData).select().single()
            if (error) alert("Failed to save")
            else if (data) resultId = data.id
        }
        setSaving(false)
        if (resultId) router.push('/dashboard')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        alert('Script copied to clipboard!')
    }

    const handleGenerateVisuals = async () => {
        if (!content) { alert('Please generate a script first.'); return }
        setGeneratingVisuals(true)
        setSeed(Math.floor(Math.random() * 100000))
        try {
            const result = await generateVisuals(content, platform, topic, tone)
            const parsed = JSON.parse(result.text)
            setVisualData(parsed)
            setViewMode('visuals')
        } catch (error) {
            console.error(error); alert('Failed to generate visuals')
        } finally {
            setGeneratingVisuals(false)
        }
    }

    const [sendingEmail, setSendingEmail] = useState(false)
    const handleEmail = async () => {
        setSendingEmail(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) { router.push('/login'); return }
        const result = await sendScriptEmail(user.email, title || 'Untitled Script', content)
        if (result.success) alert('Script sent to your email!')
        else alert('Failed to send email.')
        setSendingEmail(false)
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans selection:bg-primary/30">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md z-40">
                <Link href="/dashboard" className="text-muted-foreground flex items-center gap-2"><ArrowLeft className="h-5 w-5" /></Link>
                <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-foreground">{showMobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            </div>

            {/* Left Sidebar */}
            <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6' : 'hidden md:flex w-[380px] bg-background border-r border-white/5 p-8'
                } flex-col transition-all duration-300 relative z-10 custom-scrollbar overflow-y-auto`}>

                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-3 group text-sm font-bold text-muted-foreground hover:text-foreground transition-all">
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all"><ArrowLeft className="h-4 w-4" /></div>
                        Back to dashboard
                    </Link>
                </div>

                <div className="flex items-center gap-3 mb-8 shrink-0">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"><Wand2 className="h-5 w-5 text-primary" /></div>
                    <div>
                        <h2 className="text-xl font-bold font-outfit tracking-tight leading-none">Studio</h2>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black mt-1">Configure Generation</p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 flex-1">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Platform</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { name: 'LinkedIn', icon: Linkedin }, { name: 'YouTube', icon: MonitorPlay }, { name: 'TikTok', icon: Sparkles }, { name: 'Instagram', icon: Instagram }
                            ].map((p) => (
                                <button key={p.name} type="button" onClick={() => setPlatform(p.name)} className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center border ${platform === p.name ? `bg-primary/10 border-primary/50 text-white` : `bg-white/5 border-transparent text-muted-foreground hover:bg-white/10`}`}>
                                    <p.icon className={`h-4 w-4 ${platform === p.name ? 'text-primary' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Objective</label>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Describe your vision..." className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 h-24 resize-none placeholder:text-muted-foreground/30 font-medium text-xs transition-all shadow-inner" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tone</label>
                            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                <option>Professional</option><option>Friendly</option><option>Witty</option><option>Persuasive</option><option>Edgy</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                <option>English</option><option>Tamil</option><option>Hindi</option><option>Spanish</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                        <button type="submit" disabled={loading || generatingVisuals} className={`w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-[0.98] ${loading ? 'opacity-80' : 'hover:shadow-primary/50 hover:-translate-y-1'}`}>
                            <div className="flex items-center justify-center gap-3">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}<span className="text-xs">Generate Script</span></div>
                        </button>
                        <button type="button" onClick={handleGenerateVisuals} disabled={loading || generatingVisuals || !content} className={`w-full py-4 bg-white/5 border border-white/10 text-foreground font-bold uppercase tracking-[0.1em] rounded-2xl transition-all active:scale-[0.98] disabled:opacity-20 ${generatingVisuals ? 'animate-pulse' : 'hover:bg-emerald-500/10 hover:border-emerald-500/30'}`}>
                            <div className="flex items-center justify-center gap-2 text-emerald-500">{generatingVisuals ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}<span className="text-[10px]">Generate Visuals</span></div>
                        </button>
                    </div>
                </form>
            </div>

            {/* Main Editor Surface */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FAF9F6] dark:bg-[#0D0D0E]">
                <div className="h-20 border-b border-black/[0.03] dark:border-white/5 bg-background flex items-center justify-between px-10 z-10 shrink-0">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled Masterpiece" className="bg-transparent text-xl font-bold font-outfit text-foreground focus:outline-none w-full" />
                    <div className="flex items-center gap-4">
                        {visualData && (
                            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-xl p-1 mr-4">
                                <button onClick={() => setViewMode('script')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'script' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Script</button>
                                <button onClick={() => setViewMode('visuals')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'visuals' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Visuals</button>
                            </div>
                        )}
                        <button onClick={handleCopy} disabled={!content} className="p-2 text-muted-foreground"><Copy className="h-5 w-5" /></button>
                        <button onClick={handleEmail} disabled={!content || sendingEmail} className="p-2 text-muted-foreground">{sendingEmail ? <Loader2 className="h-5 w-5 animate-spin" /> : <MailIcon className="h-5 w-5" />}</button>
                        <button onClick={handleSave} disabled={saving || !content} className="h-10 px-6 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl">Deliver</button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-12 custom-scrollbar flex flex-col items-center">
                    {!content ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-8 text-center max-w-2xl">
                            <div className="h-32 w-32 bg-background border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl"><Sparkles className="h-12 w-12 text-primary" /></div>
                            <h3 className="text-4xl font-black text-foreground font-outfit tracking-tighter uppercase">ScriptGo Studio</h3>
                            <p className="text-muted-foreground/80 font-medium">Configure your target and topic on the left to start.</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-5xl h-full pb-20">
                            {viewMode === 'script' ? (
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-full p-16 bg-background rounded-3xl border border-white/5 text-foreground focus:outline-none resize-none font-sans text-xl font-medium leading-[1.8] custom-scrollbar" spellCheck={false} />
                            ) : (
                                <div className="space-y-12">
                                    {visualData?.thumbnailPrompt && (
                                        <div className="relative group rounded-[3rem] overflow-hidden bg-black/20 aspect-[16/7] border border-white/5 shadow-2xl">
                                            <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(visualData.thumbnailPrompt + ", Disney style animation, masterpiece, vibrant colors")}?seed=${seed}&nologo=true`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                                            <div className="absolute bottom-10 left-10"><h4 className="text-4xl font-black text-white font-outfit uppercase">{title || 'Production Cover'}</h4></div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                                        {visualData?.visuals?.map((shot: any, idx: number) => (
                                            <div key={idx} className="group bg-background/50 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-2">
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(shot.imagePrompt + ", Disney Pixar style animation, highly detailed, expressive eyes, vibrant colors")}?seed=${seed + idx}&nologo=true`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                    <div className="absolute top-4 left-4 h-6 px-3 bg-black/60 backdrop-blur-md rounded-lg flex items-center border border-white/10"><span className="text-[10px] font-black text-white uppercase">{shot.shot}</span></div>
                                                </div>
                                                <div className="p-8 space-y-4">
                                                    <p className="text-sm font-bold leading-relaxed text-foreground/70 group-hover:text-foreground">{shot.description}</p>
                                                    <div className="pt-4 border-t border-white/5"><span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Animated Series Asset</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
