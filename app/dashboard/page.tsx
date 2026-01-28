import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import DashboardContent from '@/components/DashboardContent'
import { redirect } from 'next/navigation'

function ScriptListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            <div className="h-[380px] rounded-[2.5rem] bg-white/[0.02] border-2 border-dashed border-white/5 animate-pulse"></div>
            {[1, 2].map((i) => (
                <div key={i} className="h-[380px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse p-8">
                    <div className="h-6 w-20 bg-white/5 rounded-lg mb-6"></div>
                    <div className="h-8 w-3/4 bg-white/5 rounded-xl mb-4"></div>
                    <div className="flex-1 bg-white/5 rounded-2xl mb-6"></div>
                </div>
            ))}
        </div>
    )
}

async function ScriptList() {
    const supabase = await createClient()
    const { data: scriptsData } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false })

    return <DashboardContent initialScripts={scriptsData || []} />
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Check user on the server (Fast)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-white selection:bg-emerald-500/30 font-inter relative overflow-hidden">
            {/* Mesh Gradients */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] -z-10"></div>

            <Header />

            <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
                <Suspense fallback={<ScriptListSkeleton />}>
                    <ScriptList />
                </Suspense>
            </main>
        </div>
    )
}
