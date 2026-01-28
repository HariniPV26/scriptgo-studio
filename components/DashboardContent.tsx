'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Trash2, Sparkles, ArrowRight } from 'lucide-react'

interface DashboardContentProps {
    initialScripts: any[]
}

export default function DashboardContent({ initialScripts }: DashboardContentProps) {
    const [scripts, setScripts] = useState(initialScripts)

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

    if (!scripts || scripts.length === 0) {
        return (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    <Link
                        href="/editor"
                        className="group saas-card flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 transition-all duration-500 h-[380px] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-primary/20">
                                <Plus className="h-10 w-10 text-primary" />
                            </div>
                            <div className="text-center px-8">
                                <h3 className="font-outfit font-bold text-2xl mb-3 tracking-tight">Create New Script</h3>
                                <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-[200px] mx-auto">
                                    Start your first production.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="relative flex flex-col items-center justify-center py-20 rounded-[2.5rem] border border-dashed border-border bg-white/[0.02] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50"></div>
                    <div className="relative z-10 text-center">
                        <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/5">
                            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 font-outfit tracking-tight text-white">Your workshop is empty</h3>
                        <p className="text-muted-foreground/80 mb-10 max-w-sm mx-auto leading-relaxed">
                            The world is waiting for your story. Let AI kickstart your creative process and scale your brand.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {/* Create New Card */}
            <Link
                href="/editor"
                className="group saas-card flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 transition-all duration-500 h-[380px] relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-primary/20">
                        <Plus className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-center px-8">
                        <h3 className="font-outfit font-bold text-2xl mb-3 tracking-tight">Create New Script</h3>
                        <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-[200px] mx-auto">
                            Start a fresh production with AI-powered creativity.
                        </p>
                    </div>
                </div>
            </Link>

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
    )
}
