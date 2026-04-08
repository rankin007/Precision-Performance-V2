'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Scale, 
  Plus, 
  BadgeCheck, 
  AlertTriangle,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react'
import { checkHealingStatus, checkCriticalState } from '@/utils/clinical'

export default function DataEntryPage() {
  const supabase = createClient()
  
  const [horseRoster, setHorseRoster] = useState<any[]>([])
  const [selectedHorse, setSelectedHorse] = useState<any>(null)
  const [horseId, setHorseId] = useState<string | null>(null)
  
  const [msValue, setMsValue] = useState<string>('')
  const [brixValue, setBrixValue] = useState<string>('')
  const [urinePh, setUrinePh] = useState<string>('')
  const [salivaPh, setSalivaPh] = useState<string>('')
  const [hydrationNotes, setHydrationNotes] = useState<string>('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCriticalAlert, setShowCriticalAlert] = useState(false)
  const [canEnterMetrics, setCanEnterMetrics] = useState<boolean>(true) // Default true for entry page, verify via effect

  const cValue = (parseFloat(msValue) || 0) * 1.43

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Fetch Profile & Permissions
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, membership_levels(*)')
        .eq('id', user.id)
        .single()

      if (profile) {
        const { data: perms } = await supabase
          .from('level_permissions')
          .select('permissions(slug)')
          .eq('level_id', profile.membership_level_id)

        const flatPerms = perms?.map((p: any) => p.permissions.slug) || []
        setCanEnterMetrics(flatPerms.includes('entry_daily_metrics') || profile.role === 'Super Admin' || profile.role === 'Admin')
      }

      // 2. Fetch Horses (Accessible horses)
      // This might need refinement based on role (Trainer's stable vs Owner's horses)
      const { data: horses } = await supabase
        .from('horses')
        .select('*')
        .order('name', { ascending: true })
      
      if (horses && horses.length > 0) {
        setHorseRoster(horses)
        setSelectedHorse(horses[0])
        setHorseId(horses[0].id)
      }
    }
    loadData()
  }, [])

  const submitData = async () => {
    const brix = parseFloat(brixValue) || 0
    const ph = parseFloat(urinePh) || 0
    const cond = cValue

    if (checkCriticalState(brix, ph, cond)) {
      setShowCriticalAlert(true)
    }

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !horseId) throw new Error('Sync Identity Missing')

      // 1. Create Daily Record
      const { data: record, error: recordError } = await supabase
        .from('daily_records')
        .insert([{ 
            horse_id: horseId, 
            staff_id: user.id,
            notes: hydrationNotes
        }])
        .select()
        .single()

      if (recordError) throw recordError

      // 2. Insert Biochemistry Telemetry
      const { error: bioError } = await supabase
        .from('biochemistry_logs')
        .insert([{ 
            record_id: record.id,
            urine_salts_ms: parseFloat(msValue) || 0,
            urine_brix: brix,
            urine_ph: ph,
            saliva_ph: parseFloat(salivaPh) || 0
        }])

      if (bioError) throw bioError
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setMsValue(''); setBrixValue(''); setUrinePh(''); setSalivaPh(''); setHydrationNotes('')
    } catch (error) {
      console.error('Handshake failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] p-8 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12">
        
        {/* Left Column: Guidance & Context */}
        <div className="col-span-12 lg:col-span-5 space-y-12">
            <div>
                <h1 className="text-5xl font-light tracking-tight text-[#1B3022]">Biometric <br/> Handshake</h1>
                <p className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase mt-4">Precision Telemetry Entry · V3</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Activity className="w-32 h-32" />
                </div>
                
                <h3 className="text-lg font-bold text-[#1B3022] flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#C5A059]" />
                    Sync Protocol
                </h3>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#1B3022] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                            <p className="text-sm font-bold text-[#1B3022]">Select Elite Subject</p>
                            <p className="text-xs text-slate-400 mt-1">Identification of horse for clinical recording.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#1B3022] text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                            <p className="text-sm font-bold text-[#1B3022]">Validate Metrics</p>
                            <p className="text-xs text-slate-400 mt-1">Input Salts, Sugar, and pH values from certified instruments.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#1B3022] text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div>
                            <p className="text-sm font-bold text-[#1B3022]">Handshake Confirmation</p>
                            <p className="text-xs text-slate-400 mt-1">Submit to the blockchain-secured clinical audit trail.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1B3022] rounded-3xl p-8 text-white shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-3">Live Clinical Law</p>
                <p className="text-xl font-light italic leading-relaxed">
                    &quot;We don&apos;t look at a horse and guess its health. We analyze its biology. Go by the numbers. No guessing.&quot;
                </p>
            </div>
        </div>

        {/* Right Column: Entry Form */}
        <div className="col-span-12 lg:col-span-7">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1B3022] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5"
            >
                <div className="space-y-10 relative z-10">
                    
                    {/* Subject Selection */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Clinical Subject Identification</label>
                        <div className="relative group">
                            <select 
                                value={horseId || ''} 
                                onChange={(e) => {
                                    const horse = horseRoster.find(h => h.id === e.target.value)
                                    setSelectedHorse(horse)
                                    setHorseId(horse.id)
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl font-light outline-none transition-all focus:bg-white/10 appearance-none cursor-pointer"
                            >
                                {horseRoster.map(h => (
                                    <option key={h.id} value={h.id} className="text-[#1B3022]">{h.name}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 rotate-90" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Salts Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Urine Salts (ms)</label>
                            <div className="relative flex gap-3">
                                <input 
                                    type="number"
                                    value={msValue}
                                    onChange={(e) => setMsValue(e.target.value)}
                                    placeholder="0.0"
                                    className="flex-1 bg-white text-[#1B3022] rounded-2xl px-6 py-5 text-3xl font-light outline-none transition-all placeholder:text-slate-200"
                                />
                                <div className="w-24 bg-[#C5A059] rounded-2xl flex flex-col items-center justify-center border border-white/10">
                                    <span className="text-[9px] font-bold text-[#1B3022] uppercase tracking-[0.1em]">Salts C</span>
                                    <span className="text-lg font-bold text-[#1B3022] tracking-tighter">{cValue.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sugar Input */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Urine Brix (%)</label>
                            <input 
                                type="number"
                                value={brixValue}
                                onChange={(e) => setBrixValue(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-3xl font-light outline-none transition-all focus:bg-white/10 placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* pH Inputs */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Urine Balance (pH)</label>
                            <input 
                                type="number"
                                value={urinePh}
                                onChange={(e) => setUrinePh(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-3xl font-light outline-none transition-all focus:bg-white/10 placeholder:text-white/10"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Saliva Balance (pH)</label>
                            <input 
                                type="number"
                                value={salivaPh}
                                onChange={(e) => setSalivaPh(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-3xl font-light outline-none transition-all focus:bg-white/10 placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 block">Clinical Observations (Optional)</label>
                        <textarea 
                            value={hydrationNotes}
                            onChange={(e) => setHydrationNotes(e.target.value)}
                            placeholder="Hydration assessment, feeding changes, or activity notes..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm font-medium h-32 outline-none transition-all focus:bg-white/10 placeholder:text-white/10 resize-none"
                        />
                    </div>

                    <div className="pt-6">
                    <button 
                        onClick={submitData}
                        disabled={isSaving || !canEnterMetrics || !horseId}
                        className={`w-full py-6 font-bold uppercase tracking-[0.3em] text-sm rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative disabled:opacity-30 disabled:grayscale ${
                            showSuccess 
                            ? 'bg-[#C5A059] text-white shadow-[0_0_40px_rgba(197,160,89,0.3)]' 
                            : 'bg-white text-[#1B3022] shadow-2xl hover:bg-slate-100'
                        }`}
                    >
                            {!canEnterMetrics ? (
                                <>Access Permission Required</>
                            ) : isSaving ? (
                                <Activity className="w-5 h-5 animate-spin" />
                            ) : showSuccess ? (
                                <>
                                    <BadgeCheck className="w-5 h-5" />
                                    Synchronized
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Synchronize Biometrics
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Critical Alert Portal */}
      <AnimatePresence>
        {showCriticalAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1B3022]/90 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-slate-100"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400">
                <Flame className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-light text-[#1B3022] mb-4">Clinical Boundary Deviation</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-10">
                The values entered for <span className="font-bold text-slate-600 italic">{selectedHorse?.name}</span> have deviated from safely established physiological thresholds. 
                Immediate clinical review is required.
              </p>
              <button 
                onClick={() => setShowCriticalAlert(false)}
                className="w-full py-5 bg-[#1B3022] text-white font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-slate-800 transition-colors"
              >
                Acknowledge Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
