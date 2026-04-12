'use client'

// Note: This page only appears if portal_access_granted = false in the profiles table.
// To approve a user: run UPDATE profiles SET portal_access_granted = true WHERE id = '<user-id>';

import { motion } from 'framer-motion'
import { Clock, ShieldCheck, ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-[#1B3022] text-white flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Background geometric overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border border-white rounded-full rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] border border-[#C5A059] rounded-full -rotate-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full text-center space-y-12 relative z-10"
      >
        {/* Icon */}
        <div className="w-32 h-32 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto relative">
          <div className="absolute inset-0 rounded-full border border-[#C5A059]/10 animate-ping" />
          <Clock className="w-14 h-14 text-[#C5A059]" />
        </div>

        {/* Copy */}
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight font-display italic">
            Awaiting Clearance
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed uppercase tracking-[0.2em] font-medium max-w-sm mx-auto">
            Your Professional BE Kit application is under review by the Principal Orchestrator.
            Access to the clinical portal will be granted within 24 hours.
          </p>
        </div>

        {/* Status indicators */}
        <div className="bg-black/20 border border-white/5 rounded-[2rem] p-8 space-y-4 text-left backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Application Received</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Your BE Kit application has been encrypted and logged.</p>
            </div>
          </div>
          <div className="w-px h-6 bg-white/5 ml-[10px]" />
          <div className="flex items-center gap-4 opacity-40">
            <Clock className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Orchestrator Review</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Manual clearance in progress.</p>
            </div>
          </div>
          <div className="w-px h-6 bg-white/5 ml-[10px]" />
          <div className="flex items-center gap-4 opacity-20">
            <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Portal Access Granted</p>
              <p className="text-[10px] text-slate-500 mt-0.5">You will be notified when access is active.</p>
            </div>
          </div>
        </div>

        {/* Contact note */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <Mail className="w-3 h-3" />
          <span>Queries: admin@precisionperformance.com.au</span>
        </div>

        <a
          href="https://www.precisionperformance.com.au"
          className="inline-flex items-center gap-3 px-10 py-5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Assets
        </a>
      </motion.div>
    </div>
  )
}
