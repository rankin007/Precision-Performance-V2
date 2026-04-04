'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, ShieldCheck, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import HistoryLedger from '@/components/HistoryLedger'

const mockHistoryData = [
  { id: '1', created_at: '2026-04-01T08:00:00Z', urine_brix: 3.5, urine_ph: 6.7, urine_salts_c: 18.2, observation_notes: 'Optimal metabolic baseline. Healing Gold detected.' },
  { id: '2', created_at: '2026-03-31T14:45:00Z', urine_brix: 3.2, urine_ph: 6.8, urine_salts_c: 17.5, observation_notes: 'Stable recovery curve.' },
  { id: '3', created_at: '2026-03-30T09:12:00Z', urine_brix: 2.8, urine_ph: 6.5, urine_salts_c: 22.1, observation_notes: 'Salt intake adjustment required. Conductivity spike noted.' },
  { id: '4', created_at: '2026-03-29T18:30:00Z', urine_brix: 3.9, urine_ph: 7.2, urine_salts_c: 16.8, observation_notes: 'High endurance session followup.' },
  { id: '5', created_at: '2026-03-28T07:15:00Z', urine_brix: 3.6, urine_ph: 6.6, urine_salts_c: 19.5, observation_notes: 'Core hydration window maintained.' }
]

export default function ClientHistoryPage() {
  return (
    <div className="min-h-screen bg-[#1B3022]/5 p-8 lg:p-12 space-y-12">
      {/* Owner Forensic Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-4">
          <Link href="/portal/client/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-gold transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Stable Oversight
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                <ShieldCheck className="w-8 h-8 text-paddock" />
            </div>
            <div>
                <h1 className="text-4xl font-light text-slate-900 tracking-tight">Biometric Forensic Audit</h1>
                <p className="text-[11px] font-bold text-paddock/50 uppercase tracking-[0.3em] mt-2">Verified Handshake · Clinical Integrity V2</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-8 py-4 bg-paddock text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                <Download className="w-4 h-4 text-gold" />
                Download Certified Audit
            </button>
        </div>
      </motion.header>

      {/* Audit Transparency Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-200 pb-10"
      >
        <div className="flex items-center gap-3 px-5 py-2.5 bg-gold/10 rounded-full border border-gold/20">
            <ClipboardCheck className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold text-paddock uppercase tracking-widest">Handshake Verified by Precision Performance</span>
        </div>
        <div className="h-4 w-px bg-slate-300 hidden md:block" />
        <p className="text-[11px] text-slate-500 font-medium italic">Transparency Protocol: All biometric telemetry is direct-from-stable without post-processing.</p>
      </motion.div>

      {/* The Master Ledger (Read-Only context for owner) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <HistoryLedger records={mockHistoryData} />
      </motion.div>

      {/* Owner Footer */}
      <footer className="text-center pt-16 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg mb-4">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Metadata Sync</span>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Precision Performance · Elite Owner Accountability</p>
      </footer>
    </div>
  )
}
