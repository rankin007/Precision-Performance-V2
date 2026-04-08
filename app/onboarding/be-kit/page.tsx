'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { submitBeKitApplication } from './actions'

export default function BeKitOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitBeKitApplication(formData)

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else if (result?.success) {
      setIsSuccess(true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1B3022] text-white flex flex-col font-sans selection:bg-[#C5A059]/30">
      
      {/* HEADER: ELITE NAVIGATION */}
      <header className="p-8 lg:p-12 flex justify-between items-center bg-black/10 backdrop-blur-sm sticky top-0 z-50 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">Return to Base</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#C5A059]/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A059]">Sync Active</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-24 relative overflow-hidden">
        
        {/* BACKGROUND GEOMETRIC OVERLAY */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] border border-white rounded-full rotate-45" />
            <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] border border-[#C5A059] rounded-full -rotate-12" />
        </div>

        <section className="max-w-xl w-full relative z-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                {/* HEADINGS: MONTSERRAT */}
                <div className="text-center space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">Professional BE Kit</h1>
                  <p className="text-slate-400 text-sm uppercase tracking-[0.4em] font-bold">Onboarding Application · Precision Asset Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-black/20 p-10 lg:p-12 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                  
                  {/* FORM FIELDS: INTER */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Full Name</label>
                        <input 
                            name="fullName" required placeholder="Dr. Jonathan Stable"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Business Name</label>
                        <input 
                            name="businessName" required placeholder="Elite Equine Diagnostics"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Shipping Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                name="shippingAddress" required placeholder="Randwick, NSW 2031, Australia"
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Mobile</label>
                            <div className="relative">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    name="mobile" required placeholder="+61 400 000 000"
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    name="email" type="email" required placeholder="contact@eliteequine.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] px-1">Professional Website (include http/https)</label>
                        <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                name="website" required placeholder="https://precisionperformance.com.au"
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-medium focus:bg-white/10 outline-none transition-all focus:border-[#C5A059]/50 placeholder:text-white/10"
                            />
                        </div>
                    </div>
                  </div>

                  {/* ERROR MESSAGE (CLINICAL CALM STYLE) */}
                  {error && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{error}</p>
                    </div>
                  )}

                  <div className="pt-6">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 bg-[#C5A059] text-white rounded-full font-bold uppercase tracking-[0.3em] text-xs shadow-[0_0_40px_rgba(197,160,89,0.3)] hover:shadow-[0_0_60px_rgba(197,160,89,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                    >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Initialize Onboarding
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                    </button>
                  </div>
                </form>

                {/* FOOTER: CLINICAL DISCLOSURE */}
                <p className="text-[9px] uppercase font-bold text-slate-500 text-center tracking-[0.4em] leading-loose">
                    Clinical Protocols Protected · Master History Ledger System · V3 Compliance Active
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-12"
              >
                  <div className="w-32 h-32 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto relative">
                      <div className="absolute inset-0 bg-[#C5A059] rounded-full animate-ping opacity-20" />
                      <CheckCircle2 className="w-16 h-16 text-[#C5A059]" />
                  </div>
                  <div className="space-y-6">
                      <h2 className="text-5xl font-bold font-display leading-tight italic">Handshake Verified</h2>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed uppercase tracking-[0.2em] font-medium">
                          Your application for the Professional BE Kit has been encrypted and sent to the Principal Orchestrator. 
                          The clinical calibration team will reach out within 24 hours.
                      </p>
                  </div>
                  <div className="pt-8">
                      <Link 
                        href="/"
                        className="inline-flex items-center gap-3 px-10 py-5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Assets
                      </Link>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  )
}
