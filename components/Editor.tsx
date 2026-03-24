'use client'

import { useState, useEffect } from 'react'
import { generateScript } from '@/app/editor/actions'
import {
    Loader2, Save, Copy, Wand2, ArrowLeft, Menu, X, Sparkles,
    MonitorPlay, Linkedin, Instagram, Calendar,
    Image as ImageIcon, Mail as MailIcon, Layout, FileText, RefreshCw, Zap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface EditorProps {
    initialData?: any
    scriptId?: string
}

export default function Editor({ initialData, scriptId }: EditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [saving, setSaving] = useState(false)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)


    const [isCalendarMode, setIsCalendarMode] = useState(false)
    const [calendarDays, setCalendarDays] = useState(7)

    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
    const [title, setTitle] = useState(initialData?.title || '')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('None')


    const getInitialContent = () => {
        if (!initialData?.content) return ''
        if (typeof initialData.content === 'string') return initialData.content
        if (initialData.content.text) return initialData.content.text
        return ''
    }

    const [content, setContent] = useState<string>(getInitialContent())

    // Initialize states from existing data
    useEffect(() => {

        if (initialData?.content?.language) {
            setLanguage(initialData.content.language)
        }
        if (initialData?.content?.framework) {
            setFramework(initialData.content.framework)
        }
    }, [initialData])

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowMobileSidebar(false)

        setContent('')

        try {
            if (isCalendarMode) {
                const params = new URLSearchParams({
                    topic, days: calendarDays.toString(), platform, tone, language, framework, autoGenerate: 'true'
                })
                router.push(`/calendar?${params.toString()}`)
                return
            }

            // Set title early if not present, so the user sees something happening
            if (!title) setTitle(`${platform} Script: ${topic}`)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, tone, platform, language, framework })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate');
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let accumulatedContent = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, { stream: true })
                    accumulatedContent += chunk
                    setContent(accumulatedContent)
                }
            }

            if (!accumulatedContent) {
                throw new Error('The AI returned an empty response. The service may be temporarily unavailable, please try again.');
            }
        } catch (error: any) {
            console.error(error);
            alert(`Generation Error: ${error.message || 'Unknown error'}`)
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
            content: {
                text: content,
                visuals: null,
                language: language,
                framework: framework
            }
        }
        let resultId = scriptId
        if (scriptId) {
            const { error } = await supabase.from('scripts').update(scriptData).eq('id', scriptId)
            if (error) { console.error('Update error:', error); alert("Failed to save: " + error.message); }
        } else {
            const { data, error } = await supabase.from('scripts').insert(scriptData).select().single()
            if (error) { console.error('Insert error:', error); alert("Failed to save: " + error.message); }
            else if (data) resultId = data.id
        }
        setSaving(false)
        if (resultId) router.push('/dashboard')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        alert('Script copied to clipboard!')
    }




    const handlePublish = () => {
        if (!content) return
        navigator.clipboard.writeText(content)

        const platformUrls: { [key: string]: string } = {
            'LinkedIn': 'https://www.linkedin.com/feed/',
            'YouTube': 'https://studio.youtube.com/',
            'Instagram': 'https://www.instagram.com/',
            'TikTok': 'https://www.tiktok.com/upload'
        }

        const url = platformUrls[platform] || 'https://google.com'
        window.open(url, '_blank')
        alert(`Content copied for ${platform}! Opening platform...`)
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans selection:bg-primary/30">
            {/* Left Sidebar */}
            <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6' : 'hidden md:flex w-[400px] bg-background border-r border-white/5 p-8'
                } flex-col transition-all duration-300 relative z-10 custom-scrollbar overflow-y-auto`}>

                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-3 group text-sm font-bold text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Back to dashboard
                    </Link>
                </div>

                <div className="flex items-center gap-3 mb-8 shrink-0">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"><Wand2 className="h-5 w-5 text-primary" /></div>
                    <div>
                        <h2 className="text-xl font-bold font-outfit tracking-tight">Studio</h2>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Configure Generation</p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 flex-1">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Platform</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { name: 'LinkedIn', icon: Linkedin }, { name: 'YouTube', icon: MonitorPlay },
                                { name: 'TikTok', icon: Sparkles }, { name: 'Instagram', icon: Instagram }
                            ].map((p) => (
                                <button key={p.name} type="button" onClick={() => setPlatform(p.name)} className={`p-3 rounded-xl transition-all border ${platform === p.name ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'}`}>
                                    <p.icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Objective</label>
                        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Describe your vision..." className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-foreground focus:ring-2 focus:ring-primary/40 h-32 text-xs font-medium" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tone</label>
                            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                <option value="Professional">Professional</option>
                                <option value="Friendly">Friendly</option>
                                <option value="Witty">Witty</option>
                                <option value="Persuasive">Persuasive</option>
                                <option value="Edgy">Edgy</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Language</label>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                    <option value="English">English</option>
                                    <option value="Tamil">Tamil</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Framework</label>
                                <select value={framework} onChange={(e) => setFramework(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/5 rounded-lg text-foreground text-xs font-bold">
                                    <option value="None">None</option>
                                    <option value="AIDA">AIDA</option>
                                    <option value="PAS">PAS</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Strategy Mode</label></div>
                            <button type="button" onClick={() => setIsCalendarMode(!isCalendarMode)} className={`relative w-10 h-5 rounded-full transition-colors ${isCalendarMode ? 'bg-primary' : 'bg-white/10'}`}>
                                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isCalendarMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                        <button type="submit" disabled={loading} className={`w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all ${loading ? 'opacity-80' : 'hover:-translate-y-1'}`}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Generate Script'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#0D0D0E] h-full overflow-hidden relative">
                <div className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-10 shrink-0 z-20">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-transparent text-xl font-bold font-outfit text-foreground focus:outline-none w-full" />
                    <div className="flex items-center gap-4">

                        <button onClick={handleCopy} disabled={!content} title="Copy Content" className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all"><Copy className="h-5 w-5" /></button>
                        <button onClick={handlePublish} disabled={!content} title={`Publish to ${platform}`} className="h-10 px-4 bg-primary/20 text-primary border border-primary/30 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all flex items-center gap-2">
                            <Zap className="h-3 w-3" /> Publish
                        </button>
                        <button onClick={handleSave} disabled={saving || !content} className="h-10 px-6 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deliver'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                    {!content ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20"><Sparkles className="h-10 w-10 text-primary" /></div>
                            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">Inscribe AI Studio</h2>
                            <p className="text-muted-foreground max-w-sm">Enter your topic and platform to start building your production.</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl mx-auto h-full">
                                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-12 h-full">
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-full bg-transparent text-foreground text-xl leading-relaxed outline-none resize-none font-medium" />
                                </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
