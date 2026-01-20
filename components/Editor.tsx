'use client'

import { useState, useEffect } from 'react'
import { generateScript, generateVisuals } from '@/app/editor/actions'
import {
    Loader2, Save, Copy, Wand2, ArrowLeft, Menu, X, Sparkles,
    MonitorPlay, Linkedin, Instagram, Calendar,
    Image as ImageIcon, Mail as MailIcon, Layout, FileText, RefreshCw, Zap
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

    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
    const [title, setTitle] = useState(initialData?.title || '')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('None')
    const [visualData, setVisualData] = useState<any>(null)
    const [seed, setSeed] = useState(Date.now())

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

    const handleGenerateVisuals = async () => {
        if (!content) { alert('Please generate a script first.'); return }
        setGeneratingVisuals(true)
        setSeed(Date.now())
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

    const handleRefreshVisuals = () => {
        setSeed(Date.now())
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans selection:bg-primary/30">
            {/* Left Sidebar */}
            <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6' : 'hidden md:flex w-[380px] bg-background border-r border-white/5 p-8'
                } flex-col transition-all duration-300 relative z-10 custom-scrollbar overflow-y-auto`}>

                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-3 group text-sm font-bold text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Back to dashboard
                    </Link>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 flex-1">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[{ name: 'LinkedIn', icon: Linkedin }, { name: 'YouTube', icon: MonitorPlay }, { name: 'TikTok', icon: Sparkles }, { name: 'Instagram', icon: Instagram }].map((p) => (
                                <button key={p.name} type="button" onClick={() => setPlatform(p.name)} className={`p-3 rounded-xl border transition-all ${platform === p.name ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'}`}>
                                    <p.icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Objective (Topic)</label>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Cinderella's magical journey..." className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 h-32 text-xs font-medium" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tone</label>
                            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                <option>Professional</option><option>Friendly</option><option>Witty</option><option>Persuasive</option><option>Edgy</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                <option>English</option><option>Tamil</option><option>Hindi</option><option>Spanish</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                        <button type="submit" disabled={loading || generatingVisuals} className={`w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all ${loading ? 'opacity-50' : 'hover:-translate-y-1'}`}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Generate Script'}
                        </button>
                        <button type="button" onClick={handleGenerateVisuals} disabled={loading || generatingVisuals || !content} className={`w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold uppercase tracking-widest rounded-2xl transition-all ${generatingVisuals ? 'animate-pulse' : 'hover:bg-emerald-500/20'}`}>
                            {generatingVisuals ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Generate Visuals'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#0D0D0E] h-full overflow-hidden relative">
                <div className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-10 shrink-0 z-20">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-transparent text-xl font-bold font-outfit text-foreground focus:outline-none w-full" />
                    <div className="flex items-center gap-4">
                        {visualData && (
                            <div className="flex bg-white/5 p-1 rounded-xl mr-4">
                                <button onClick={() => setViewMode('script')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'script' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Script</button>
                                <button onClick={() => setViewMode('visuals')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'visuals' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>Visuals</button>
                            </div>
                        )}
                        <button onClick={handleSave} className="h-10 px-6 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Deliver</button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                    {!content ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20"><Sparkles className="h-10 w-10 text-primary" /></div>
                            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">ScriptGo Studio</h2>
                            <p className="text-muted-foreground max-w-sm">Enter your topic and platform to start building your production.</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl mx-auto h-full">
                            {viewMode === 'script' ? (
                                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-12 h-full">
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-full bg-transparent text-foreground text-xl leading-relaxed outline-none resize-none font-medium" />
                                </div>
                            ) : (
                                <div className="space-y-12 pb-32">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Storyboard Production</h3>
                                        <button onClick={handleRefreshVisuals} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase transition-all">
                                            <RefreshCw className="h-3.5 w-3.5" /> Re-Render All
                                        </button>
                                    </div>

                                    {visualData?.thumbnailPrompt && (
                                        <div className="relative group rounded-[3rem] overflow-hidden aspect-[21/9] border border-white/5 shadow-2xl">
                                            <img src={`https://pollinations.ai/p/${encodeURIComponent(visualData.thumbnailPrompt + ", high quality, masterwork, 8k")}?width=1920&height=1080&seed=${seed}&model=flux`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                            <div className="absolute bottom-12 left-12">
                                                <div className="flex items-center gap-2 mb-4"><Zap className="h-4 w-4 text-primary fill-primary" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 text-white">Hero Visual</span></div>
                                                <h4 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter leading-none">{title || 'The Legend'}</h4>
                                                <p className="text-white/60 text-xs mt-4 font-bold max-w-xl">CGI Animated Feature Style Storyboard</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {visualData?.visuals?.map((shot: any, idx: number) => (
                                            <div key={idx} className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all hover:bg-white/[0.07]">
                                                <div className="aspect-video relative overflow-hidden bg-black/40">
                                                    <img src={`https://pollinations.ai/p/${encodeURIComponent(shot.imagePrompt)}?width=1080&height=608&seed=${seed + idx}&model=flux`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg"><span className="text-[10px] font-black text-white uppercase">{shot.shot}</span></div>
                                                </div>
                                                <div className="p-8 space-y-4">
                                                    <p className="text-sm font-bold leading-relaxed text-foreground/80">{shot.description}</p>
                                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                        <span>Animated Series</span>
                                                        <span>Aset-ID: {Math.floor(Math.random() * 10000)}</span>
                                                    </div>
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
