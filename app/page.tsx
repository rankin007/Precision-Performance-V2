import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#C5A059] selection:text-white bg-[#1B3022]">
      
      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-between overflow-hidden">
        {/* HERO IMAGE (Elite Randwick Asset) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.jpg" 
            alt="Elite Equine Performance" 
            fill 
            priority
            className="object-cover brightness-[0.4]"
          />
          {/* Subtle noise and gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#1B3022] z-10" />
        </div>

        {/* NAVIGATION HEADER */}
        <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#F9FAFB] transition-transform group-hover:scale-105 duration-300">
                <polygon points="10,80 30,30 50,20 60,10 70,30 90,50 70,90 40,80" fill="currentColor" opacity="0.9" />
                <polygon points="30,30 50,40 40,80 10,80" fill="#C5A059" opacity="0.8" />
                <polygon points="50,20 60,10 70,30 50,40" fill="#1B3022" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#F9FAFB] leading-tight">PRECISION</span>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-[#F9FAFB] leading-none">PERFORMANCE</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#mission" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors uppercase">Mission</Link>
            <Link href="#protocols" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors uppercase">Protocols</Link>
            <Link href="#investment" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors uppercase">Investment</Link>
            <Link 
              href="/login" 
              className="ml-4 bg-[#C5A059] hover:bg-[#b08d4b] text-white px-6 py-2 rounded-md font-bold text-sm tracking-widest uppercase transition-all shadow-lg"
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* HERO COPY */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-4 mb-12">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter drop-shadow-2xl">
              ELITE EQUINE <br/> BIO-ANALYSIS.
            </h2>
            <p className="text-xl md:text-2xl font-medium text-white/90 tracking-widest uppercase">
              GO BY THE NUMBERS. <span className="text-[#C5A059] font-bold">NO GUESSING.</span>
            </p>
          </div>
          <Link href="/portal">
            <button className="bg-[#C5A059] text-[#1B3022] font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-2xl active:scale-95 tracking-widest uppercase">
              ACCESS THE HEALING ZONE
            </button>
          </Link>
        </main>

        {/* SCROLL INDICATOR */}
        <div className="relative z-20 pb-12 animate-bounce">
          <div className="w-1 h-12 bg-gradient-to-b from-[#C5A059] to-transparent rounded-full mx-auto" />
        </div>
      </section>

      {/* CORE MISSION */}
      <section id="mission" className="relative z-20 -mt-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-12 md:p-20 border border-[#C5A059]/20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h3 className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase">The Precision Protocol</h3>
            <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed italic">
              &quot;We don&apos;t look at a horse and guess its health. We analyze its biology. In REAL TIME with scientific instruments specifically for the elite athletes, we identify its <span className="text-[#C5A059] not-italic font-sans font-bold">Optimum Performance State</span>, the Healing Zone, and provide an individual guide to Nutrition and Hydration.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* PROTOCOLS TABLE */}
      <section id="protocols" className="py-24 bg-[#1B3022] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <h3 className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase">The Science</h3>
              <h4 className="text-4xl md:text-5xl font-bold tracking-tight">The Pillars of Stability</h4>
            </div>
            <p className="max-w-md text-white/60 text-lg">
              Our clinical ranges are derived from thousands of elite performance data points. We operate only in the high-stakes reality of biology.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-6 px-8 text-[#C5A059] text-xs font-bold uppercase tracking-widest">Pillar</th>
                  <th className="py-6 px-8 text-[#C5A059] text-xs font-bold uppercase tracking-widest">The Metric</th>
                  <th className="py-6 px-8 text-[#C5A059] text-xs font-bold uppercase tracking-widest">The Healing Zone</th>
                  <th className="py-6 px-8 text-[#C5A059] text-xs font-bold uppercase tracking-widest">The Clinical Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-8 px-8 font-bold text-xl group-hover:text-[#C5A059] transition-colors">Brix</td>
                  <td className="py-8 px-8 text-white/80">Sugars</td>
                  <td className="py-8 px-8"><span className="bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full border border-[#C5A059]/30 font-mono">3 - 4 %</span></td>
                  <td className="py-8 px-8 text-white/60">Optimal fuel availability and carbohydrate balance.</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-8 px-8 font-bold text-xl group-hover:text-[#C5A059] transition-colors">pH (Urine)</td>
                  <td className="py-8 px-8 text-white/80">Balance</td>
                  <td className="py-8 px-8"><span className="bg-white/10 text-white px-3 py-1 rounded-full border border-white/20 font-mono">6.4 - 7.0</span></td>
                  <td className="py-8 px-8 text-white/60">Resistance to metabolic stress and inflammatory response.</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="py-8 px-8 font-bold text-xl group-hover:text-[#C5A059] transition-colors">Conductivity (C)</td>
                  <td className="py-8 px-8 text-white/80">Salts</td>
                  <td className="py-8 px-8"><span className="bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full border border-[#C5A059]/30 font-mono">15 - 20 C</span></td>
                  <td className="py-8 px-8 text-white/60">Precision hydration and electrolyte synchronization.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL SERVICES */}
      <section id="investment" className="py-32 bg-[#1B3022]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-20">
            <h3 className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase">Professional Services</h3>
            <h4 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Elite Investment</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* BE KIT */}
            <div className="group relative bg-white/10 border-2 border-white/10 hover:border-[#C5A059] rounded-2xl p-8 md:p-12 text-left shadow-xl transition-all hover:-translate-y-2">
              <div className="mb-8">
                <h5 className="text-white text-2xl font-bold mb-2">Professional BE Kit</h5>
                <p className="text-white/60 text-lg">Elite Onboarding Experience</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-white text-5xl font-extrabold">$2,500</span>
                  <span className="text-white/40 font-bold">AUD</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 text-white/80">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />In-house performance testing station setup & training.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />Certified testing instruments & calibration services.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />200 Specimen containers & custom testing tray.</li>
              </ul>
              <Link href="/login" className="block w-full">
                <button className="w-full py-4 bg-[#C5A059] hover:bg-[#1B3022] text-white rounded-md font-bold tracking-widest uppercase transition-colors">Select Onboarding</button>
              </Link>
            </div>

            {/* MONTHLY SERVICE */}
            <div className="group relative bg-[#1B3022] border-2 border-transparent hover:border-[#C5A059] rounded-2xl p-8 md:p-12 text-left shadow-xl transition-all hover:-translate-y-2">
              <div className="mb-8">
                <h5 className="text-white text-2xl font-bold mb-2">Performance Service</h5>
                <p className="text-white/60 text-lg">Daily Diagnostic Monitoring</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-white text-5xl font-extrabold">$600</span>
                  <span className="text-white/40 font-bold">/ Horse</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 text-white/80">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />Daily diagnostic monitoring via the Precision Portal.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />Real-time &quot;Race Ready&quot; status alerts.</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />Historical trend analysis for owners and stakeholders.</li>
              </ul>
              <Link href="/login" className="block w-full">
                <button className="w-full py-4 bg-[#C5A059] text-white rounded-md font-bold tracking-widest uppercase transition-transform active:scale-95">Enroll Horses</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <footer className="bg-[#1B3022] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold tracking-tighter text-xl">PRECISION PERFORMANCE</span>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 Sports Performance Recovery V2. All Rights Reserved. Elite Equine Bio-Analysis.
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">Trainer Portal</Link>
            <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">Client Login</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
