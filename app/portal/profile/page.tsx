'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Shield, 
  Award, 
  Fingerprint,
  LogOut,
  Settings,
  Bell,
  BadgeCheck
} from 'lucide-react'

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*, membership_levels(*)')
        .eq('id', user.id)
        .single()
      
      setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F8]">
        <div className="flex flex-col items-center gap-4">
          <Fingerprint className="w-12 h-12 text-[#C5A059] animate-pulse" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authenticating Identity</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] p-8 lg:p-12 space-y-12">
      
      {/* HEADER: IDENTITY OVERVIEW */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#1B3022] flex items-center justify-center border-2 border-[#C5A059]/20 shadow-2xl">
                    <User className="w-10 h-10 text-white opacity-80" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#C5A059] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                    <BadgeCheck className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-light tracking-tight text-slate-900">{profile?.full_name || 'Anonymous User'}</h1>
                <p className="text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase mt-2">{profile?.role} · {profile?.membership_levels?.name || 'Standard'} Authority</p>
            </div>
        </div>
        
        <div className="flex gap-3">
            <button onClick={handleSignOut} className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 shadow-sm">
                <LogOut className="w-3.5 h-3.5" />
                Revoke Session
            </button>
        </div>
      </header>

      {/* IDENTITY DATA GRID */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1B3022]">Clinical Profile</h3>
                <Settings className="w-4 h-4 text-slate-300" />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors group hover:bg-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-[#C5A059] transition-colors">
                        <Mail className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Email Identity</p>
                        <p className="text-sm font-medium text-slate-700">Checking Auth context...</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors group hover:bg-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-[#C5A059] transition-colors">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Access Role</p>
                        <p className="text-sm font-medium text-slate-700">{profile?.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors group hover:bg-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:text-[#C5A059] transition-colors">
                        <Award className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">System Tier</p>
                        <p className="text-sm font-medium text-slate-700">{profile?.membership_levels?.name || 'Standard'}</p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Security & System Info */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
        >
            <div className="bg-[#1B3022] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Fingerprint className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-gold/20 w-fit rounded-full border border-gold/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C5A059]" />
                        <span className="text-[9px] font-bold text-gold uppercase tracking-[0.1em]">Security Active</span>
                    </div>
                    
                    <h3 className="text-2xl font-light leading-snug">V3 Precision <br/> System Access</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                        Your account is currently managed under the Elite Equine Bio-Analysis protocol. 
                        Multi-factor authentication is recommended for Super Admin tier access.
                    </p>
                    <button className="w-full py-4 bg-gold text-[#1B3022] font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#b08d4b] transition-colors">
                        Manage Security
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Notifications</h4>
                    <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Your login session is secured by V3 Tokenization.</p>
                    </div>
                </div>
            </div>
        </motion.div>
      </section>

    </div>
  )
}
