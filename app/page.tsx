'use client'

import Link from 'next/link'
import { Rocket, ArrowRight, Zap, ShieldCheck, Sparkles, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080B12] text-foreground selection:bg-primary selection:text-white font-inter overflow-x-hidden">

      {/* STOA NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#080B12]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all group-hover:scale-110">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="font-outfit font-bold text-2xl tracking-tighter text-white">ScriptGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Method', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/login?tab=signup"
              className="h-11 px-8 bg-primary rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center hover:bg-primary/80 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
            >
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-32 px-6">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Protocol v2.0 Live</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Scale at <br />
              <span className="text-primary glow-text">Lightspeed ⚡</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 font-medium leading-relaxed animate-in fade-in delay-300">
              The high-fidelity scripting environment for elite creators. Engineered for algorithmic dominance across all platforms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in delay-500">
              <Link
                href="/login?tab=signup"
                className="h-16 px-12 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all group shadow-xl"
              >
                Get Access <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="h-16 px-12 border border-white/5 bg-white/[0.03] backdrop-blur text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center hover:bg-white/[0.08] transition-all"
              >
                View Method
              </Link>
            </div>
          </div>
        </section>

        {/* VISUAL PREVIEW - MOCKUP SECTION */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="relative p-2 rounded-[3.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <div className="rounded-[3rem] overflow-hidden bg-[#0A1A12] aspect-video relative group">
                <img
                  src="/assets/images/stoa-visual.png"
                  alt="Platform Preview"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12] to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.6)] animate-pulse cursor-pointer">
                    <Zap className="h-10 w-10 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="h-1 w-24 bg-primary rounded-full"></div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">DATA-DRIVEN CORE</h3>
                  </div>
                  <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase border-l border-white/10 pl-8">
                    Latency: 12ms <br /> Precision: 99.9%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 bg-black/40">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                Engineered for <br /> <span className="text-primary">Performance.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                Every component of ScriptGo is built to eliminate friction and maximize output. High-fidelity frameworks meet neural-speed processing.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Neural Engine",
                  desc: "Generate production-ready scripts in milliseconds using our low-latency AI core."
                },
                {
                  icon: ShieldCheck,
                  title: "Verified Loop",
                  desc: "Every script is cross-validated against current algorithmic high-performers for guaranteed impact."
                },
                {
                  icon: Sparkles,
                  title: "Universal Export",
                  desc: "Optimized formats for LinkedIn, X, YouTube, and TikTok integrated natively into your workflow."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] bg-[#0A1A12]/50 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-4">{feature.title}</h3>
                  <p className="text-white/40 font-medium leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF MARQUEE */}
        <section className="py-20 border-y border-white/5 bg-[#080B12] overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-12 px-12">
                <span className="text-4xl font-black text-white/10 uppercase tracking-[0.2em] italic">Used by Legends</span>
                <Star className="h-6 w-6 text-primary fill-current" />
                <span className="text-4xl font-black text-white/10 uppercase tracking-[0.2em] italic">Top 1% Creators</span>
                <Zap className="h-6 w-6 text-primary" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 px-6 text-center">
          <div className="max-w-4xl mx-auto p-20 rounded-[4rem] bg-gradient-to-b from-primary/20 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

            <div className="relative z-10 space-y-10">
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                Claim your <br /> <span className="text-primary">Edge.</span>
              </h2>
              <p className="max-w-lg mx-auto text-xl text-white/40 font-medium leading-relaxed">
                Join the network of 5,000+ creators scaling their influence with high-fidelity AI.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/login?tab=signup"
                  className="h-20 px-16 bg-primary text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.5em] flex items-center justify-center hover:bg-primary/80 transition-all hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-95 shadow-2xl"
                >
                  Join Protocol
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* STOA FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tighter text-white">ScriptGo</span>
          </div>

          <div className="flex gap-12">
            {['Twitter', 'Discord', 'Updates'].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">© 2026 ScriptGo Protocol // All Rights Reserved</p>
        </div>
      </footer>

      <style jsx global>{`
                .glow-text {
                    text-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
                }
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
            `}</style>
    </div>
  )
}
