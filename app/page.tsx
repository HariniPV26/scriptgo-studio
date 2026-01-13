import Link from 'next/link'
import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse opacity-50"></div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ScriptGo</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=signup"
              className="px-5 py-2 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-semibold text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            AI-Powered Script Generation
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Create Viral Scripts <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-indigo-600">
              in Seconds
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop staring at a blank page. Generate professional scripts for YouTube, TikTok, and LinkedIn with the power of AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/login?tab=signup"
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 flex items-center gap-2"
            >
              Generate Free Script <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-card border border-border text-foreground font-bold text-lg hover:bg-muted/50 transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <PlayCircle className="h-5 w-5" /> Live Demo
            </Link>
          </div>

          {/* Demo Video Section - Browser Mockup */}
          <div className="mt-20 w-full max-w-5xl mx-auto relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500">
              {/* Browser Title Bar */}
              <div className="h-12 border-b border-border/50 bg-muted/20 flex items-center px-4 gap-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 bg-background/50 h-8 rounded-lg border border-border/30 flex items-center justify-center text-xs text-muted-foreground font-mono">
                  scriptgo.com/demo
                </div>
                <div className="w-16"></div>
              </div>

              {/* Video Container */}
              <div className="aspect-video relative bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 z-0 pointer-events-none"></div>

                {/* Placeholder Video - Autoplay enabled for attention */}
                <iframe
                  className="w-full h-full relative z-10"
                  src="https://www.youtube.com/embed/xcJtL7QggTI?autoplay=1&mute=1&loop=1&playlist=xcJtL7QggTI&controls=0&rel=0"
                  title="ScriptGo Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <p className="mt-8 text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
              Watch ScriptGo in Action
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
