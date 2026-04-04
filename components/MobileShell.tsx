'use client'

import React from 'react'
import MobileNav from './MobileNav'
import { motion } from 'framer-motion'
import { Wifi, BatteryMedium, SignalLow } from 'lucide-react'

export default function MobileShell({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-[#C5A059]/30">
      
      {/* TACTICAL STATUS BAR (MOBILE HUD) */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-slate-950/80 backdrop-blur-lg flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tactical Link Active</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
            <SignalLow className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">04:42 AM</span>
        </div>
      </header>

      {/* PAGE HEADER */}
      {title && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-8 pt-8 pb-4"
        >
            <h1 className="text-3xl font-light text-white tracking-tight uppercase">{title}</h1>
            <p className="text-[9px] font-bold tracking-[0.3em] text-[#C5A059] mt-2 uppercase">Precision Performance Precision Platform</p>
        </motion.div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 lg:px-8 pb-32">
        {children}
      </main>

      {/* PERSISTENT BOTTOM NAVIGATION */}
      <MobileNav />

      {/* BACKGROUND DEPTH (MIST-MODE) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#C5A059]/5 blur-[80px] rounded-full" />
      </div>
      
    </div>
  )
}
