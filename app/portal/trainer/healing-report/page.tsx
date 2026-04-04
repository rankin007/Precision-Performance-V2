'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  LayoutDashboard,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { checkHealingStatus } from '@/utils/clinical'

export default function HealingReport() {
  const supabase = createClient()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStableAnalytics() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Fetch the trainer's stable and roster
      const { data: stable } = await supabase
        .from('stables')
        .select('*, horses(*)')
        .eq('head_trainer_id', user.id)
        .single()

      if (!stable || !stable.horses) return

      // 2. Fetch 7-day clinical window for the entire stable (V3 JOIN)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: records } = await supabase
        .from('daily_records')
        .select(`
          id,
          horse_id,
          created_at,
          biochemistry_logs (
            urine_brix,
            urine_ph,
            urine_salts_c
          )
        `)
        .in('horse_id', stable.horses.map((h: any) => h.id))
        .gte('created_at', sevenDaysAgo.toISOString())

      if (records) {
        let totalTripleHealing = 0
        const horseStatusMap: Record<string, any> = {}

        records.forEach((r: any) => {
          const bio = r.biochemistry_logs?.[0]
          if (bio) {
            const clinical = checkHealingStatus(bio.urine_brix, bio.urine_ph, bio.urine_salts_c)
            if (clinical.isTripleHealing) totalTripleHealing++
            
            // Track individual horse trend
            if (!horseStatusMap[r.horse_id]) horseStatusMap[r.horse_id] = []
            horseStatusMap[r.horse_id].push(clinical.isTripleHealing)
          }
        })

        setStats({
          stableName: stable.name,
          totalHorses: stable.horses.length,
          totalRecords: records.length,
          stabilityIndex: records.length > 0 ? Math.round((totalTripleHealing / records.length) * 100) : 0,
          tripleHealingCount: totalTripleHealing,
          pendingTests: stable.horses.length - new Set(records.map((r: any) => r.horse_id)).size
        })
      }
      setLoading(false)
    }
    loadStableAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F8] flex items-center justify-center">
        <Activity className="w-10 h-10 text-[#C5A059] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] p-8 md:p-12 space-y-12">
      
      {/* HEADER: STABLE ANALYTICS */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl font-light text-slate-900 tracking-tight">Stable Analytics</h1>
            <p className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase">Clinical Performance Overview — {stats?.stableName}</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-[#1B3022] text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg shadow-[#1B3022]/10">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">7-Day Analysis Window</span>
            </div>
        </div>
      </header>

      {/* STABILITY KPI CARDS */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Stability Index */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">Stability</span>
            </div>
            <div>
                <p className="text-5xl font-light text-slate-900">{stats?.stabilityIndex}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stable Stability Index</p>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.stabilityIndex}%` }}
                    className="h-full bg-emerald-500" 
                />
            </div>
        </div>

        {/* Triple Healing Events */}
        <div className="bg-[#1B3022] p-8 rounded-3xl shadow-xl border border-[#1B3022] space-y-6">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/10 rounded-2xl text-[#C5A059]">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#C5A059] bg-white/10 px-2 py-1 rounded-md uppercase tracking-wider">Elite State</span>
            </div>
            <div>
                <p className="text-5xl font-light text-white">{stats?.tripleHealingCount}</p>
                <p className="text-[10px] font-bold text-[#C5A059]/60 uppercase tracking-widest mt-1">Healing Gold Events</p>
            </div>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] pt-2 border-t border-white/5">
                Total Biological Handshakes
            </p>
        </div>

        {/* Pending Tests Alert */}
        <div className={`p-8 rounded-3xl shadow-xl border space-y-6 transition-all ${
            stats?.pendingTests > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100 opacity-60'
        }`}>
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stats?.pendingTests > 0 ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
            </div>
            <div>
                <p className={`text-5xl font-light ${stats?.pendingTests > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {stats?.pendingTests}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Horses Pending Testing</p>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-2 border-t border-slate-100">
                Incomplete 3-Day Cycle
            </p>
        </div>

        {/* Active Roster */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <LayoutDashboard className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-5xl font-light text-slate-900">{stats?.totalHorses}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Managed Thoroughbreds</p>
            </div>
            <div className="flex -space-x-3 overflow-hidden pt-2">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200" />
                ))}
            </div>
        </div>

      </section>

      {/* STABLE INSIGHTS GRID (V3 CORRELATION PLACEHOLDERS) */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
            <TrendingUp className="w-20 h-20 text-[#1B3022]/5" />
            <div className="space-y-3">
                <h3 className="text-2xl font-light text-slate-400">Stable Correlation Heatmap</h3>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Platinum Calibration Active</p>
                <p className="text-[10px] text-slate-300 max-w-sm uppercase tracking-widest font-bold leading-relaxed">
                    Correlating Track Surface (Soft 5) with Biological Recovery States
                </p>
            </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
            <Activity className="w-20 h-20 text-[#1B3022]/5" />
            <div className="space-y-3">
                <h3 className="text-2xl font-light text-slate-400">Clinical Audit Export</h3>
                <button className="bg-[#1B3022] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#1B3022]/10 transition-all hover:bg-[#C5A059]">
                    Instantiate PDF Ledger
                </button>
                <p className="text-[10px] text-slate-300 max-w-sm uppercase tracking-widest font-bold leading-relaxed pt-2">
                    Generate Forensic Biological Records for Owner Distribution
                </p>
            </div>
        </div>
      </section>

    </div>
  )
}
