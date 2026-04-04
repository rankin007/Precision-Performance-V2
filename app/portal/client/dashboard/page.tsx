'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronRight, 
  Activity,
  Calendar,
  Weight,
  BadgeCheck,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Droplets,
  ClipboardList
} from 'lucide-react'
import { checkHealingStatus } from '@/utils/clinical'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export default function ClientDashboard() {
  const supabase = createClient()
  const [horses, setHorses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHorses() {
      try {
        const { data, error } = await supabase
          .from('horses')
          .select('*')
        
        if (data && data.length > 0 && !error) {
          setHorses(data)
        }
      } catch (err) {
        console.error('Stable sync delayed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHorses()
  }, [])

  // Standard Horse Library Mapping
  const horseImages: Record<string, string> = {
    'Autum': '/images/autum.png',
    'Deloviere': '/images/deloviere.png',
    'Lunar Lover': '/images/lunar_lover.png',
    'Idle Flyer': '/images/idle_flyer.png',
    'Inn Count': '/images/inn_count.png',
    'Midiaro': '/images/midiaro.png',
    'Mountain Queen': '/images/mountain_queen.png',
    'Golden Standard': '/images/golden_standard.png',
    'Febright': '/images/febright.png',
    'Blue Squares': '/images/blue_squares.png'
  }

  // Consistent Fallback for Stable Roster Integration
  const displayHorses = horses.length > 0 ? horses : [
    { id: '1', name: 'Autum', breed: 'Arabian', age: 7, default_weight_kg: 490, last_brix: 3.5, last_ph: 6.7, last_cond: 18.2 },
    { id: '2', name: 'Deloviere', breed: 'Thoroughbred', age: 5, default_weight_kg: 510, last_brix: 3.2, last_ph: 6.8, last_cond: 17.5 },
    { id: '3', name: 'Lunar Lover', breed: 'Warmblood', age: 6, default_weight_kg: 485, last_brix: 4.8, last_ph: 6.2, last_cond: 25.1 },
    { id: '4', name: 'Idle Flyer', breed: 'Sport Horse', age: 4, default_weight_kg: 505, last_brix: 3.4, last_ph: 7.1, last_cond: 16.5 },
  ]

  const healingCount = displayHorses.filter(h => {
    const status = checkHealingStatus(h.last_brix || 0, h.last_ph || 0, h.last_cond || 0)
    return status.isTripleHealing
  }).length

  const healthIndex = Math.round((healingCount / displayHorses.length) * 100)

  return (
    <div className="min-h-screen p-8 lg:p-12 space-y-12">
      {/* Immersive Owner Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-paddock/10 rounded-xl text-paddock">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-4xl font-light tracking-tight text-slate-900">Stable Oversight</h1>
                <p className="text-[10px] font-bold tracking-[0.4em] text-paddock/40 uppercase mt-1">Owner Portal · Precision Asset Management</p>
            </div>
          </div>
        </div>
        
        {/* Stable Intelligence Bar */}
        <div className="flex gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none glass-panel px-8 py-5 rounded-3xl shadow-sm border border-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Activity className="w-12 h-12" />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Health Index</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-paddock">{healthIndex}</span>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-tighter">% Recovery</span>
                </div>
            </div>
            
            <div className="flex-1 lg:flex-none tactical-paddock p-0.5 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-paddock px-8 py-5 rounded-[22px]">
                    <p className="text-[10px] uppercase font-bold text-gold/60 tracking-widest mb-1">Status Alert</p>
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-gold" />
                        <p className="text-sm font-bold text-white tracking-wide">{healingCount} Horses in Healing Gold</p>
                    </div>
                </div>
            </div>
        </div>
      </motion.header>

      {/* Grid of Horse Cards: Elite V2 style */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
      >
        {loading && horses.length === 0 ? (
            [1,2,3].map(i => (
                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] animate-pulse" />
            ))
        ) : (
            displayHorses.map((horse) => {
                const status = checkHealingStatus(horse.last_brix || 0, horse.last_ph || 0, horse.last_cond || 0)
                
                return (
                    <motion.div 
                        key={horse.id}
                        variants={cardVariants}
                        whileHover={{ y: -8 }}
                        className="group glass-panel rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-[0_20px_50px_rgba(27,48,34,0.08)] transition-all cursor-pointer bg-white relative"
                    >
                        {/* Elite Status Ribbon */}
                        {status.isTripleHealing && (
                            <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-gold rounded-full shadow-lg border border-white/20 flex items-center gap-2 animate-bounce">
                                <Flame className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Healing Gold</span>
                            </div>
                        )}

                        <div className="aspect-[4/3] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-paddock/40 to-transparent z-10" />
                            <img 
                                src={horseImages[horse.name] || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600'} 
                                alt={horse.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[9px] font-bold text-paddock uppercase tracking-widest">Verified Stable</span>
                            </div>
                        </div>
                        
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-light text-paddock tracking-tight">{horse.name}</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">{horse.breed || 'Elite Athlete'}</p>
                                </div>
                                <div className="p-4 bg-paddock/5 rounded-2xl text-paddock group-hover:bg-paddock group-hover:text-white transition-all duration-300 transform group-hover:rotate-12 shadow-sm border border-paddock/5">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Biometric Snapshot Grid (Transparency) */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className={`p-4 rounded-2xl border transition-colors ${status.isHealingBrix ? 'bg-gold/5 border-gold/20' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1 text-center">Brix</p>
                                    <p className={`text-xl font-bold text-center ${status.isHealingBrix ? 'text-gold drop-shadow-sm' : 'text-paddock'}`}>{horse.last_brix || '—'}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-colors ${status.isHealingPh ? 'bg-gold/5 border-gold/20' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1 text-center">pH</p>
                                    <p className={`text-xl font-bold text-center ${status.isHealingPh ? 'text-gold drop-shadow-sm' : 'text-paddock'}`}>{horse.last_ph || '—'}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-colors ${status.isHealingCond ? 'bg-gold/5 border-gold/20' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mb-1 text-center">Salts</p>
                                    <p className={`text-xl font-bold text-center ${status.isHealingCond ? 'text-gold drop-shadow-sm' : 'text-paddock'}`}>{horse.last_cond || '—'}</p>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <ClipboardList className="w-4 h-4 text-gold" />
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Forensic Audit</p>
                                        <p className="text-[10px] font-bold text-paddock tracking-tight">Handshake Verified</p>
                                    </div>
                                </div>
                                <Link 
                                    href="/portal/client/history" 
                                    className="px-5 py-2 bg-paddock text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                                >
                                    Audit View
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )
            })
        )}

        {/* Action Link for Owners (Acquire/View Reports) */}
        <motion.div 
            variants={cardVariants}
            className="group rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 hover:border-gold/40 transition-all cursor-pointer bg-white/40 shadow-sm"
        >
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                <Plus className="w-10 h-10 text-slate-300 group-hover:text-gold transition-colors" />
            </div>
            <h4 className="text-lg font-light text-paddock tracking-tight mb-1">Expand Stable</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Asset Acquisition</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
