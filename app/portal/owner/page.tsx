'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  MapPin, 
  ShieldCheck,
  Star,
  Info
} from 'lucide-react'
import { checkHealingStatus } from '@/utils/clinical'

export default function OwnerDashboard() {
  const supabase = createClient()
  const [ownedHorses, setOwnedHorses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPortfolio() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('horse_ownership')
        .select(`
          ownership_percent,
          horses (
            id,
            name,
            photo_urls,
            stables (name, location)
          )
        `)
        .eq('owner_id', user.id)

      if (data) {
        // Fetch latest bio logs for each horse to show current state
        const horsesWithLogs = await Promise.all(data.map(async (entry: any) => {
          const { data: logs } = await supabase
            .from('daily_records')
            .select('*, biochemistry_logs(*)')
            .eq('horse_id', entry.horses.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          
          return { ...entry, latestLog: logs }
        }))
        setOwnedHorses(horsesWithLogs)
      }
      setLoading(false)
    }
    loadPortfolio()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F8]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-10 h-10 text-[#C5A059] animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing Portfolio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] p-8 lg:p-12 space-y-12">
      
      {/* HEADER: PORTFOLIO OVERVIEW */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight text-slate-900">Your Portfolio</h1>
          <p className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase">Precision Performance Elite Access</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Managed Horses</p>
                <p className="text-3xl font-light text-[#1B3022]">{ownedHorses.length}</p>
            </div>
        </div>
      </header>

      {/* PORTFOLIO GRID */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {ownedHorses.map((entry, index) => {
            const horse = entry.horses
            const log = entry.latestLog
            const bio = log?.biochemistry_logs?.[0]
            const clinical = bio ? checkHealingStatus(bio.urine_brix, bio.urine_ph, bio.urine_salts_c) : null

            return (
              <motion.div
                key={horse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Horse Visual Aspect */}
                <div className="relative h-64 w-full bg-slate-200">
                  {horse.photo_urls?.[0] ? (
                    <img 
                      src={horse.photo_urls[0]} 
                      alt={horse.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <Star className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                      clinical?.isTripleHealing 
                      ? 'bg-[#C5A059]/80 text-white border-[#C5A059]' 
                      : 'bg-white/70 text-slate-600 border-white/50'
                    }`}>
                      {clinical?.isTripleHealing ? '✦ Healing Gold' : 'Calibrating'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content Aspect */}
                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-light text-[#1B3022] tracking-tight">{horse.name}</h3>
                      <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        {entry.ownership_percent}% Stake
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3" />
                      {horse.stables?.name || 'Monitoring Stable'}
                    </p>
                  </div>

                  {/* Summary Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Brix Level</p>
                      <p className={`text-xl font-light ${clinical?.isHealingBrix ? 'text-[#C5A059]' : 'text-slate-600'}`}>
                        {bio?.urine_brix ?? '—'} <span className="text-[10px] font-bold">%</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">Stability (pH)</p>
                      <p className={`text-xl font-light ${clinical?.isHealingPh ? 'text-[#C5A059]' : 'text-slate-600'}`}>
                        {bio?.urine_ph ?? '—'}
                      </p>
                    </div>
                  </div>

                  {/* Trainer Insights Preview */}
                  {log?.notes && (
                    <div className="bg-[#1B3022]/5 p-5 rounded-2xl border border-[#1B3022]/10 relative">
                      <p className="text-[9px] uppercase font-bold text-[#1B3022]/40 tracking-widest mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" />
                        Trainer Perspective
                      </p>
                      <p className="text-xs text-[#1B3022]/70 leading-relaxed italic line-clamp-2">
                        &quot;{log.notes}&quot;
                      </p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 flex gap-4">
                    <Link href={`/portal/owner/trend?horse=${horse.id}`} className="flex-1">
                      <button className="w-full py-4 bg-[#1B3022] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#2A4533] active:scale-95 shadow-lg shadow-[#1B3022]/10">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Clinical Charts
                      </button>
                    </Link>
                    <button className="p-4 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-all active:scale-90 shadow-sm group">
                      <Info className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Empty State */}
        {ownedHorses.length === 0 && (
          <div className="col-span-full bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-6">
              <Star className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-light text-slate-400">No Verified Portfolio</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto uppercase tracking-widest font-bold">Ownership Stake Required for Clinical Access</p>
          </div>
        )}
      </section>

    </div>
  )
}
