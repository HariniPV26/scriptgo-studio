'use client'

import { useState } from 'react'
// import { generateScript, saveScript } from '@/app/editor/actions' // Removed for static export
import { Loader2, Save, Copy, Wand2, ArrowLeft, Menu, X, Sparkles, MonitorPlay, Linkedin, Instagram, Twitter } from 'lucide-react'
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

    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [platform, setPlatform] = useState(initialData?.platform || 'LinkedIn')
    const [title, setTitle] = useState(initialData?.title || '')

    const [content, setContent] = useState<{ visual: string[], audio: string[] }>(
        initialData?.content || { visual: [], audio: [] }
    )

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setShowMobileSidebar(false)

        // Mock AI generation for static export
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockVisuals = [
            "Opening shot: Excited host facing camera",
            "Cut to: B-roll of the topic subject",
            "Text overlay: 'Top Tips'",
            "Host holds up one finger",
            "Graphic: Summary of points"
        ];
        const mockAudio = [
            `Hey guys! Welcome back. Today let's talk about ${topic}.`,
            "It's easier than you think.",
            "Tip number one: Start small.",
            "And that's how you do it!",
            "Follow for more!"
        ];

        const safeContent = {
            visual: mockVisuals,
            audio: mockAudio
        }
        setContent(safeContent)
        if (!title) setTitle(`${platform} Script: ${topic}`)

        setLoading(false)
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
            content
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
        const text = content.visual.map((v, i) => `[Visual]: ${v}\n[Audio]: ${content.audio[i] || ''}`).join('\n\n')
        navigator.clipboard.writeText(text)
        alert('Script copied to clipboard!')
    }

    const updateCell = (type: 'visual' | 'audio', index: number, value: string) => {
        const newContent = { ...content }
        newContent[type][index] = value
        setContent(newContent)
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md z-40">
                <Link href="/dashboard" className="text-muted-foreground">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <span className="font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">ScriptGo</span>
                <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="text-foreground">
                    {showMobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Left Sidebar */}
            <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6' : 'hidden md:flex w-80 bg-muted/30 border-r border-border p-6'
                } flex-col transition-all duration-300`}>

                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <div className="bg-muted p-1.5 rounded-lg group-hover:bg-muted/80 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">Dashboard</span>
                    </Link>
                    {showMobileSidebar && (
                        <button onClick={() => setShowMobileSidebar(false)} className="bg-muted p-2 rounded-lg text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-foreground">Configuration</h2>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 flex-1 overflow-y-auto pb-6 scrollbar-none">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Platform</label>
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
                                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 border ${platform === p.name
                                        ? 'bg-primary/10 text-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                                        : 'bg-card text-muted-foreground border-border hover:bg-muted hover:border-border/80'
                                        }`}
                                >
                                    <p.icon className="h-5 w-5" />
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="topic" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Topic</label>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What are we creating today?..."
                            required={!scriptId && content.visual.length === 0}
                            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent h-32 resize-none placeholder:text-muted-foreground font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="tone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tone & Style</label>
                        <div className="relative">
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full px-4 py-3 appearance-none bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <option>Professional</option>
                                <option>Funny & Witty</option>
                                <option>Inspirational</option>
                                <option>Casual & Friendly</option>
                                <option>Controversial / Edgy</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 text-primary-foreground font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Wand2 className="h-5 w-5" /> Generate Magic</>}
                    </button>
                </form>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                {/* Toolbar */}
                <div className="h-auto md:h-16 border-b border-border bg-background/50 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between px-6 py-3 md:py-0 shrink-0 gap-4 md:gap-0 z-10">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Untitled Project"
                        className="bg-transparent text-xl font-bold text-foreground focus:outline-none placeholder:text-muted-foreground w-full md:max-w-md order-2 md:order-1 text-center md:text-left"
                    />
                    <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
                        <button
                            onClick={handleCopy}
                            disabled={content.visual.length === 0}
                            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:bg-muted rounded-lg"
                        >
                            <Copy className="h-4 w-4" />
                            <span className="hidden sm:inline">Copy to Clipboard</span>
                        </button>
                        <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>
                        <button
                            onClick={handleSave}
                            disabled={saving || content.visual.length === 0}
                            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            <span>Save Script</span>
                        </button>
                    </div>
                </div>

                {/* Script Editor Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative z-0 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    {content.visual.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <div className="h-24 w-24 bg-card rounded-3xl flex items-center justify-center mb-6 ring-1 ring-border animate-bounce-slow">
                                <Wand2 className="h-10 w-10 text-primary opacity-80" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">Ready to create?</h3>
                            <p className="text-muted-foreground">Enter a topic in the sidebar to generate your first script.</p>
                        </div>
                    ) : (
                        <div className="bg-card/60 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto ring-1 ring-border">
                            {/* Column Headers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-x-0 md:divide-x divide-border border-b border-border bg-muted/20 hidden md:grid">
                                <div className="p-4 flex items-center justify-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                    <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">Visual Direction</span>
                                </div>
                                <div className="p-4 flex items-center justify-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                    <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">Audio Script</span>
                                </div>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-border">
                                {content.visual.map((vis, i) => (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-border group hover:bg-muted/5 transition-colors">
                                        <div className="relative p-1">
                                            <span className="md:hidden text-[10px] font-bold text-indigo-400 p-2 block opacity-70">VISUAL</span>
                                            <textarea
                                                value={vis}
                                                onChange={(e) => updateCell('visual', i, e.target.value)}
                                                className="w-full min-h-[100px] p-5 bg-transparent text-foreground focus:text-foreground outline-none resize-none transition-colors border-l-2 border-transparent focus:border-indigo-500 font-sans leading-relaxed selection:bg-indigo-500/30"
                                                placeholder="Describe the scene..."
                                            />
                                        </div>
                                        <div className="relative p-1 bg-muted/5">
                                            <span className="md:hidden text-[10px] font-bold text-purple-400 p-2 block opacity-70">AUDIO</span>
                                            <textarea
                                                value={content.audio[i] || ''}
                                                onChange={(e) => updateCell('audio', i, e.target.value)}
                                                className="w-full min-h-[100px] p-5 bg-transparent text-foreground focus:text-foreground outline-none resize-none transition-colors border-l-2 border-transparent focus:border-purple-500 font-mono text-sm leading-relaxed selection:bg-purple-500/30"
                                                placeholder="Spoken words..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
