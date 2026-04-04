'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  Beaker, 
  Droplet, 
  Wind, 
  History,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { checkHealingStatus } from '@/utils/clinical'

export default function BioDataStepper() {
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [horseId, setHorseId] = useState('')
  const [roster, setRoster] = useState<any[]>([])
  
  // LOG DATA STATE
  const [brix, setBrix] = useState('')
  const [ph, setPh] = useState('')
  const [saltsMs, setSaltsMs] = useState('')
  const [salivaPh, setSalivaPh] = useState('')
  const [notes, setNotes] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoster() {
      const { data } = await supabase.from('horses').select('id, name')
      if (data) {
        setRoster(data)
        if (data.length > 0) setHorseId(data[0].id)
      }
    }
    loadRoster()
  }, [])

  const saltsC = saltsMs ? (parseFloat(saltsMs) * 1.43).toFixed(2) : '0.00'
  const clinical = checkHealingStatus(parseFloat(brix) || 0, parseFloat(ph) || 0, parseFloat(saltsC) || 0)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required.')

      // 1. V3 HEADER: Create Daily Record
      const { data: record, error: recordError } = await supabase
        .from('daily_records')
        .insert([{ 
            horse_id: horseId, 
            staff_id: user.id,
            notes: notes
        }])
        .select()
        .single()

      if (recordError) throw recordError

      // 2. V3 DETAIL: Create Biochemistry Log
      const { error: bioError } = await supabase
        .from('biochemistry_logs')
        .insert([{ 
            record_id: record.id,
            urine_brix: parseFloat(brix) || 0,
            urine_ph: parseFloat(ph) || 0,
            urine_salts_ms: parseFloat(saltsMs) || 0,
            saliva_ph: parseFloat(salivaPh) || 0
        }])

      if (bioError) throw bioError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setStep(1) // Reset
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // REUSABLE TACTICAL INPUT
  const TacticalInput = ({ label, value, onChange, placeholder, suffix, icon: Icon, healing }: any) => (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-[#C5A059]" />
          {label}
        </label>
        {healing && (
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
                Healing Range
            </span>
        )}
      </div>
      <div className="relative">
        <input 
          type="number" 
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 text-4xl font-light text-white focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-slate-700"
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-600 uppercase tracking-widest">
            {suffix}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-[3rem] p-4 lg:p-12 shadow-2xl relative overflow-hidden">
      
      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1B3022] flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-24 h-24 bg-[#C5A059] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#C5A059]/20">
                <Check className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-light text-white tracking-tight">Record Synchronized</h3>
            <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em] mt-3">Precision Performance Handshake Complete</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER: TACTICAL HUD */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Link Active</span>
        </div>
        <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
            Step {step} / 3
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
            {error}
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="min-h-[350px]">
        {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-12 pt-4">
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-[#C5A059]" />
                        Select Thoroughbred
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                        {roster.map((h: any) => (
                            <button
                                key={h.id}
                                onClick={() => { setHorseId(h.id); setStep(2); }}
                                className={`w-full p-8 rounded-[2rem] text-left transition-all border-2 ${
                                    horseId === h.id 
                                    ? 'bg-[#1B3022] border-[#C5A059] text-white' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-light tracking-tight">{h.name}</span>
                                    <ChevronRight className={`w-6 h-6 ${horseId === h.id ? 'text-[#C5A059]' : 'text-slate-700'}`} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}

        {step === 2 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-10">
                <TacticalInput 
                    label="Sugars (Brix %)" 
                    value={brix} 
                    onChange={setBrix} 
                    placeholder="3.5" 
                    suffix="Brix" 
                    icon={Activity}
                    healing={clinical.isHealingBrix}
                />
                <div className="grid grid-cols-2 gap-6">
                    <TacticalInput 
                        label="Urine pH" 
                        value={ph} 
                        onChange={setPh} 
                        placeholder="6.7" 
                        suffix="pH" 
                        icon={Droplet}
                        healing={clinical.isHealingPh}
                    />
                    <TacticalInput 
                        label="Salts (ms)" 
                        value={saltsMs} 
                        onChange={setSaltsMs} 
                        placeholder="12.0" 
                        suffix="ms" 
                        icon={Zap}
                        healing={clinical.isHealingCond}
                    />
                </div>
                {/* Real-time Status Card */}
                <div className={`p-6 rounded-3xl border-2 transition-all ${
                    clinical.isTripleHealing ? 'bg-[#1B3022] border-[#C5A059]' : 'bg-slate-800 border-slate-700'
                }`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stability Conversion</p>
                            <p className={`text-2xl font-light ${clinical.isTripleHealing ? 'text-white' : 'text-slate-300'}`}>
                                {saltsC} <span className="text-xs font-bold text-[#C5A059]">C</span>
                            </p>
                        </div>
                        {clinical.isTripleHealing && (
                            <ShieldCheck className="w-10 h-10 text-[#C5A059]" />
                        )}
                    </div>
                </div>
            </motion.div>
        )}

        {step === 3 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-10">
                <TacticalInput 
                    label="Saliva pH" 
                    value={salivaPh} 
                    onChange={setSalivaPh} 
                    placeholder="6.8" 
                    suffix="pH" 
                    icon={Beaker} 
                />
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Wind className="w-3.5 h-3.5 text-[#C5A059]" />
                        Observational Notes
                    </label>
                    <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Atmospheric or physical observations..."
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 text-xl font-light text-white focus:outline-none focus:border-[#C5A059] transition-all min-h-[150px] placeholder:text-slate-700"
                    />
                </div>
            </motion.div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="mt-12 pt-8 border-t border-slate-800 flex gap-4">
        {step > 1 && (
            <button 
                onClick={() => setStep(s => s - 1)}
                className="p-6 bg-slate-800 text-slate-400 rounded-3xl border border-slate-700 active:scale-95 transition-all"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
        )}
        
        {step < 3 ? (
            <button 
                onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-[#1B3022] text-white py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-xl shadow-[#1B3022]/20 active:scale-95 transition-all"
            >
                Continue <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            </button>
        ) : (
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-[#C5A059] text-[#1B3022] py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/20 active:scale-95 disabled:opacity-50 transition-all"
            >
                {loading ? 'Synchronizing...' : 'Commit Data Handshake'}
                {!loading && <Zap className="w-4 h-4" />}
            </button>
        )}
      </div>

    </div>
  )
}
