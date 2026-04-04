'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Download, Filter } from 'lucide-react'
import Link from 'next/link'
import HistoryLedger from '@/components/HistoryLedger'

const mockHistoryData = [
  { id: '1', created_at: '2026-04-01T08:00:00Z', urine_brix: 3.5, urine_ph: 6.7, urine_salts_c: 18.2, observation_notes: 'Optimal metabolic baseline. Healing Gold detected.' },
  { id: '2', created_at: '2026-03-31T14:45:00Z', urine_brix: 3.2, urine_ph: 6.8, urine_salts_c: 17.5, observation_notes: 'Stable recovery curve.' },
  { id: '3', created_at: '2026-03-30T09:12:00Z', urine_brix: 2.8, urine_ph: 6.5, urine_salts_c: 22.1, observation_notes: 'Salt intake adjustment required. Conductivity spike noted.' },
  { id: '4', created_at: '2026-03-29T18:30:00Z', urine_brix: 3.9, urine_ph: 7.2, urine_salts_c: 16.8, observation_notes: 'High endurance session followup.' },
  { id: '5', created_at: '2026-03-28T07:15:00Z', urine_brix: 3.6, urine_ph: 6.6, urine_salts_c: 19.5, observation_notes: 'Core hydration window maintained.' }
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#1B3022]/5 p-8 lg:p-12 space-y-12">
      {/* Immersive Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-4">
          <Link href="/portal/trainer/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-gold transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Telemetry Dashboard
          </Link>
          <div>
            <h1 className="text-4xl font-light text-slate-900 tracking-tight">Clinical Forensic Ledger</h1>
            <p className="text-[11px] font-bold text-paddock/50 uppercase tracking-[0.3em] mt-2">Horse Identity: Silver Streak · Laboratory Audit Elite V2</p>
          </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:border-gold/30 transition-all shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                Select Range
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-paddock text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                <Download className="w-3.5 h-3.5 text-gold" />
                Export Audit
            </button>
        </div>
      </motion.header>

      {/* Forensic Controls */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-6 items-center border-b border-slate-200 pb-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-paddock/10 rounded-full border border-paddock/5">
            <Filter className="w-3 h-3 text-paddock" />
            <span className="text-[10px] font-bold text-paddock uppercase tracking-widest">Filters Applied: All Biometrics</span>
        </div>
        <div className="h-4 w-px bg-slate-300" />
        <p className="text-[11px] text-slate-400 font-medium italic">Showing 5 chronological handshake records.</p>
      </motion.div>

      {/* The Master Ledger */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <HistoryLedger records={mockHistoryData} />
      </motion.div>

      {/* Footer Disclaimer */}
      <footer className="text-center pt-12 pb-6">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Precision Performance · Clinical Data Integrity Protocol 4.0</p>
      </footer>
    </div>
  )
}
