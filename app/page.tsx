'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Rocket, Zap, Target, TrendingUp, Sparkles, CheckCircle2, Play, ChevronRight, Users, Award, BarChart3, Globe, MousePointer2 } from 'lucide-react'
import { LandingNavbar } from '@/components/LandingNavbar'

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-inter selection:bg-emerald-500/30 overflow-x-hidden">

      {/* FLOATING GLASS NAVBAR */}
      <LandingNavbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-44 pb-32 px-6">
          {/* Mesh Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
            <div
              className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] transition-transform duration-500"
              style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)` }}
            ></div>
            <div
              className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] transition-transform duration-500"
              style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
            ></div>
            <div
              className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px] transition-transform duration-500"
              style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -20}px)` }}
            ></div>
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Center Logo/Label */}
            <div
              className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000 transition-transform duration-500"
              style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">AI-Powered Content Studio</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black font-outfit uppercase tracking-tighter leading-[0.9]">
                <span className="block italic font-light lowercase text-emerald-400 opacity-90 mb-2">Script</span>
                <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Go Studio</span>
              </h1>

              <p className="text-xl md:text-2xl font-medium text-white/50 max-w-2xl leading-relaxed">
                You think it. <span className="text-white italic">We write it.</span>
                <br />
                The ultimate AI studio for viral creators.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <Link
                href="/login?tab=signup"
                className="h-16 px-10 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all active:scale-95 group shadow-xl"
              >
                Get Started Free
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="h-16 px-10 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 hover:bg-white/10 backdrop-blur-xl transition-all group">
                <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                Watch Demo
              </button>
            </div>

            {/* 3D GRAPHIC PREVIEW */}
            <div
              className="relative pt-16 max-w-4xl mx-auto animate-float transition-all duration-1000"
              style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
            >
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10"></div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2rem] blur-[50px] group-hover:opacity-75 transition duration-1000"></div>
                <img
                  src="/images/studio-mockup.png"
                  alt="ScriptGo Studio Mockup"
                  className="relative rounded-[2rem] border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-[#0A0A0B] bg-gradient-to-br transition-transform hover:scale-110 hover:z-10 ${i % 2 === 0 ? 'from-emerald-500 to-teal-600' : 'from-slate-700 to-slate-800'}`}></div>
                ))}
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                Trusted by <span className="text-white">5,000+</span> elite creators
              </p>
            </div>
          </div>
        </section>

        {/* LOGO WALL */}
        <div className="py-20 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all">
              {[Users, Award, BarChart3, Globe, Sparkles, Target, Rocket].map((Icon, i) => (
                <Icon key={i} className="h-8 w-8 text-white hover:text-emerald-400 cursor-pointer" />
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-24">
              <h2 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter">
                Built for <span className="text-emerald-400 italic">Speed.</span> Optimized for <span className="text-teal-400 italic">Growth.</span>
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Stop wasting hours on manual scriptwriting. Our AI engine is trained on 10,000+ viral posts to ensure your content converts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'AI Automation', desc: 'Generate production-ready scripts in seconds using advanced LLMs.', color: 'emerald' },
                { icon: Target, title: 'Growth Frameworks', desc: 'Optimized with AIDA, PAS, and professional storytelling hooks.', color: 'teal' },
                { icon: TrendingUp, title: 'Platform Master', desc: 'Custom formats for LinkedIn, YouTube, TikTok, and Instagram.', color: 'blue' },
                { icon: Sparkles, title: 'Visual Storyboard', desc: 'Automatically generate AI visuals for every scene in your script.', color: 'purple' },
                { icon: MousePointer2, title: 'One-Click Share', desc: 'Send scripts directly to your production team or client via email.', color: 'orange' },
                { icon: BarChart3, title: 'Strategy Mode', desc: 'Plan your entire content week with our integrated calendar.', color: 'cyan' }
              ].map((f, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{ transform: `translate(${mousePos.x * (i % 3 - 1) * 10}px, ${mousePos.y * (Math.floor(i / 3) - 0.5) * 10}px)` }}
                >
                  <div className={`h-12 w-12 rounded-2xl bg-${f.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`h-6 w-6 text-${f.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>

                  {/* Subtle Gradient Shadow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-1 bg-opacity-10 overflow-hidden">
            <div
              className="bg-[#0A0A0B] rounded-[2.9rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden transition-transform duration-500"
              style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 -z-10 blur-3xl"></div>

              <h2 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-tight">
                Ready to scale <br />
                <span className="text-emerald-400">your influence?</span>
              </h2>

              <div className="flex flex-col items-center gap-8 relative">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 animate-float opacity-50 blur-2xl bg-emerald-500/20 rounded-full -z-10"></div>
                <img
                  src="/images/success-badge.png"
                  alt="Success Badge"
                  className="w-32 h-32 md:w-40 md:h-40 animate-float drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                />

                <p className="text-white/50 text-xl max-w-xl mx-auto">
                  Join the elite group of creators using ScriptGo to dominate their niche.
                </p>

                <Link
                  href="/login?tab=signup"
                  className="inline-flex h-16 px-12 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.2em] items-center justify-center gap-3 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all active:scale-95 group shadow-2xl"
                >
                  Get Started Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="font-outfit font-black text-2xl tracking-tight">ScriptGo</span>
              </Link>
              <p className="text-white/40 text-sm leading-relaxed">
                The world's most advanced AI studio for modern content creators and viral educators.
              </p>
            </div>

            {['Product', 'Company', 'Legal'].map((title, i) => (
              <div key={i} className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{title}</h3>
                <div className="flex flex-col gap-4">
                  {['Link 1', 'Link 2', 'Link 3'].map((link, j) => (
                    <Link key={j} href="#" className="text-sm text-white/30 hover:text-emerald-400 transition-colors">{link}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">© 2026 ScriptGo Studio. Built for creators.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
              <Link href="#" className="hover:text-white">Twitter</Link>
              <Link href="#" className="hover:text-white">LinkedIn</Link>
              <Link href="#" className="hover:text-white">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
