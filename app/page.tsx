import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between font-sans selection:bg-[#C5A059] selection:text-white">
      {/* BACKGROUND IMAGE AND OVERLAY */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero.png" 
          alt="Elite Racing Horse" 
          fill 
          priority
          className="object-cover object-center"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-10" />
      </div>

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-8">
        {/* Logo Section */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-12 h-12 pt-1 pl-1">
            {/* Geometric Horse Logo SVG Approximation */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#F9FAFB] transition-transform group-hover:scale-105 duration-300 drop-shadow-md">
              <polygon points="10,80 30,30 50,20 60,10 70,30 90,50 70,90 40,80" fill="currentColor" opacity="0.9" />
              <polygon points="30,30 50,40 40,80 10,80" fill="#C5A059" opacity="0.8" />
              <polygon points="50,20 60,10 70,30 50,40" fill="#1B3022" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F9FAFB] drop-shadow-sm leading-tight">
              PRECISION
            </h1>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F9FAFB] drop-shadow-sm leading-none">
              PERFORMANCE
            </h1>
          </div>
        </div>

        {/* Desktop Links & CTA */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors drop-shadow-md uppercase">Home</Link>
          <Link href="#protocols" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors drop-shadow-md uppercase">Protocols</Link>
          <Link href="#portals" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors drop-shadow-md uppercase">Portals</Link>
          <Link href="#contact" className="text-sm font-semibold tracking-wider text-[#F9FAFB] hover:text-[#C5A059] transition-colors drop-shadow-md uppercase">Contact</Link>
          <Link 
            href="/login" 
            className="ml-4 bg-[#C5A059] hover:bg-[#b08d4b] text-white px-6 py-2 rounded-md font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* CENTER HERO COPY */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 w-full">
        <h2 className="text-4xl md:text-6xl font-extrabold text-[#F9FAFB] drop-shadow-2xl mb-2 tracking-tight">
          ELITE EQUINE BIO-ANALYSIS.
        </h2>
        <h3 className="text-3xl md:text-5xl font-bold text-[#F9FAFB] drop-shadow-2xl mb-8 tracking-tight">
          OPTIMISE PERFORMANCE. <br/> <span className="text-[#C5A059]">NO GUESSING.</span>
        </h3>
        <Link 
          href="/login"
          className="bg-[#C5A059] hover:bg-[#b08d4b] text-white px-10 py-4 rounded-md font-bold text-lg tracking-widest uppercase transition-all ring-2 ring-[#C5A059] ring-offset-2 ring-offset-transparent hover:ring-offset-black/50 shadow-2xl hover:scale-105"
        >
          Get Started
        </Link>
      </main>

      {/* BOTTOM PROTOCOLS BANNER */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto bg-[#F9FAFB] rounded-t-xl py-8 px-6 md:px-12 shadow-2xl translate-y-2">
        <h4 className="text-center text-xl font-bold text-slate-900 tracking-widest uppercase mb-6">
          Our Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Protocol 1 */}
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <span className="text-lg font-bold text-slate-800 mb-1">SUGARS (BRIX)</span>
            <span className="text-sm font-medium text-slate-500">Target 3-4%</span>
          </div>

          {/* Protocol 2 */}
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <span className="text-lg font-bold text-slate-800 mb-1">CONDUCTIVITY (C)</span>
            <span className="text-sm font-medium text-slate-500">Target 15C-20C</span>
          </div>

          {/* Protocol 3 */}
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <span className="text-lg font-bold text-slate-800 mb-1">pH (6.4-7.0)</span>
            <span className="text-sm font-medium text-slate-500">Target 6.4-7.0</span>
          </div>

        </div>
      </footer>
    </div>
  )
}
