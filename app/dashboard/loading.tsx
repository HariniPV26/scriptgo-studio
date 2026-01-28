import Header from '@/components/Header'

export default function DashboardLoading() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-white selection:bg-emerald-500/30 font-inter relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px] -z-10"></div>

            <Header />

            <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Skeleton for Create New Card */}
                    <div className="h-[380px] rounded-[2.5rem] bg-white/[0.02] border-2 border-dashed border-white/5 animate-pulse"></div>

                    {/* Skeletons for existing scripts */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[380px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse flex flex-col p-6">
                            <div className="h-6 w-20 bg-white/5 rounded-lg mb-6"></div>
                            <div className="h-8 w-3/4 bg-white/5 rounded-xl mb-4"></div>
                            <div className="flex-1 bg-white/5 rounded-2xl mb-6"></div>
                            <div className="h-6 w-full bg-white/5 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
