'use client'

import { createClient } from '@/utils/supabase/client'
import Header from '@/components/Header'
import Link from 'next/link'
import { Plus, FileText, Calendar, Loader2, Trash2, BarChart3, TrendingUp, Zap, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [scripts, setScripts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('Are you sure you want to delete this script?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('scripts')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            alert('Failed to delete script')
        } else {
            setScripts(scripts.filter(s => s.id !== id))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()

            // Fetch user and scripts in parallel for maximum speed
            const [
                { data: { user } },
                { data: scriptsData }
            ] = await Promise.all([
                supabase.auth.getUser(),
                supabase.from('scripts').select('*').order('created_at', { ascending: false })
            ])

            if (!user) {
                router.push('/login')
                return
            }

            setUser(user)
            if (scriptsData) {
                setScripts(scriptsData)
            }
            setLoading(false)
        }

        fetchData()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Calculate stats
    const totalScripts = scripts.length
    const thisWeek = scripts.filter(s => {
        const created = new Date(s.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return created > weekAgo
    }).length

    const platformCounts = scripts.reduce((acc, script) => {
        const platform = script.platform || 'Other'
        acc[platform] = (acc[platform] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Header />

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="space-y-1">
                        <h1 className="font-outfit text-3xl font-bold tracking-tight">Your Workshop</h1>
                        <p className="text-muted-foreground">Manage and create your viral content.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/calendar"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background/50 hover:bg-muted/50 px-4 text-sm font-medium transition-all hover:scale-105"
                        >
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </Link>
                        <Link
                            href="/editor"
                            className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105"
                        >
                            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                            New Script
                        </Link>
                    </div>
                </div>

                {/* Stats Cards - REFINED */}
                {scripts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Total Scripts */}
                        <div className="saas-card p-1 p-6 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Total Scripts</p>
                                    <p className="font-outfit text-3xl font-bold tracking-tight">{totalScripts}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[70%]" />
                            </div>
                        </div>

                        {/* This Week */}
                        <div className="saas-card p-6 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Zap className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">This Week</p>
                                    <p className="font-outfit text-3xl font-bold tracking-tight">{thisWeek}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[40%]" />
                            </div>
                        </div>

                        {/* Top Platform */}
                        <div className="saas-card p-6 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 h-24 w-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <BarChart3 className="h-6 w-6 text-purple-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Top Platform</p>
                                    <p className="font-outfit text-2xl font-bold tracking-tight truncate max-w-[120px]">{Object.keys(platformCounts)[0] || 'None'}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[60%]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Scripts Grid */}
                {(!scripts || scripts.length === 0) ? (
                    <div className="relative flex flex-col items-center justify-center py-32 rounded-[2.5rem] border border-dashed border-border bg-white/[0.02] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50"></div>
                        <div className="relative z-10 text-center">
                            <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/5">
                                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 font-outfit tracking-tight">Your workshop is ready</h3>
                            <p className="text-muted-foreground/80 mb-10 max-w-sm mx-auto leading-relaxed">
                                The world is waiting for your story. Let AI kickstart your creative process and scale your brand.
                            </p>
                            <Link
                                href="/editor"
                                className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.05] hover:shadow-[0_20px_40px_-10px_rgba(124,58,237,0.4)]"
                            >
                                <Plus className="h-5 w-5" />
                                Create Your First Script
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {scripts.map((script, index) => (
                            <Link
                                key={script.id}
                                href={`/editor?id=${script.id}`}
                                className="group saas-card p-0 overflow-hidden flex flex-col"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`
                                            inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border 
                                            ${script.platform === 'LinkedIn' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                script.platform === 'YouTube' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    script.platform === 'TikTok' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' :
                                                        'bg-gray-500/10 text-gray-500 border-gray-500/20'}
                                        `}>
                                            {script.platform || 'General'}
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, script.id)}
                                            className="p-2 rounded-xl bg-muted/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="space-y-4 mb-6 flex-1">
                                        <h3 className="font-outfit font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                                            {script.title || 'Untitled Script'}
                                        </h3>
                                        <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 h-28 overflow-hidden relative">
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {(script.content as any)?.text?.substring(0, 180) || (script.content as any)?.visual?.[0] || 'No preview available...'}
                                            </p>
                                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#161618] to-transparent group-hover:from-[#1c1c1e] transition-colors"></div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                            {new Date(script.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 opacity-0 group-hover:opacity-100 transition-all">
                                            <ArrowRight className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
