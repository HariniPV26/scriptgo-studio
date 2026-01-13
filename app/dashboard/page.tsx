'use client'

import { createClient } from '@/utils/supabase/client'
import Header from '@/components/Header'
import Link from 'next/link'
import { Plus, FileText, Calendar, Loader2, Trash2, BarChart3, TrendingUp, Zap } from 'lucide-react'
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
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            setUser(user)

            const { data: scriptsData } = await supabase
                .from('scripts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (scriptsData) {
                setScripts(scriptsData)
            }
            setLoading(false)
        }

        fetchData()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Your Workshop</h1>
                        <p className="text-muted-foreground">Manage and create your scripts</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/calendar"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </Link>
                        <Link
                            href="/editor"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            New Script
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                {scripts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Total Scripts */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Scripts</p>
                                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{totalScripts}</p>
                            <p className="text-xs text-muted-foreground mt-1">All time</p>
                        </div>

                        {/* This Week */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                                <div className="h-8 w-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{thisWeek}</p>
                            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                        </div>

                        {/* Top Platform */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-muted-foreground">Top Platform</p>
                                <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                                    <BarChart3 className="h-4 w-4 text-purple-500" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{Object.keys(platformCounts)[0] || 'None'}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {(Object.values(platformCounts)[0] as number) || 0} scripts
                            </p>
                        </div>
                    </div>
                )}

                {/* Scripts Grid */}
                {(!scripts || scripts.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No scripts yet</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-sm">
                            Get started by creating your first AI-generated script
                        </p>
                        <Link
                            href="/editor"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Your First Script
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scripts.map((script) => (
                            <Link
                                key={script.id}
                                href={`/editor?id=${script.id}`}
                                className="group relative rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/50"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${script.platform === 'LinkedIn'
                                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                        : script.platform === 'YouTube'
                                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                        {script.platform || 'General'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleDelete(e, script.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(script.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {script.title || 'Untitled Script'}
                                </h3>

                                {/* Preview */}
                                <div className="rounded-md bg-muted/50 p-3 border border-border">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {(script.content as any)?.text?.substring(0, 120) || (script.content as any)?.visual?.[0] || 'No content preview'}...
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
