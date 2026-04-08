'use client'

import { useState, Suspense } from 'react'
import { login, signup } from './actions'
import { Activity, ShieldAlert, KeyRound, UserPlus, Info } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F9F8]"><Activity className="w-12 h-12 text-[#1B3022] animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F8] p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        
        {/* BRANDING */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Activity className="w-12 h-12 text-[#1B3022]" />
          </div>
          <h1 className="text-4xl font-extralight text-slate-900 tracking-tight">PRECISION</h1>
          <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.4em] mt-3 mr-[-0.4em]">Performance V3</p>
        </div>

        {/* AUTH BOX */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          
          {/* VIEW TOGGLE */}
          <div className="flex p-1 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
            <button 
              onClick={() => setView('login')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${view === 'login' ? 'bg-white text-[#1B3022] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setView('register')}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${view === 'register' ? 'bg-white text-[#1B3022] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Register
            </button>
          </div>

          <form action={view === 'login' ? login : signup} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1 block mb-2">Email Address</label>
                <div className="relative group">
                    <input
                        name="email"
                        type="email"
                        placeholder="you@precision.com"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-[#C5A059]/20 transition-all outline-none"
                    />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1 block mb-2">Security Key</label>
                <div className="relative group">
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-[#C5A059]/20 transition-all outline-none"
                    />
                </div>
              </div>

              {view === 'register' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1 block mb-2">Full Name</label>
                    <input
                        name="fullName"
                        placeholder="Clinical Signature"
                        required={view === 'register'}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-[#C5A059]/20 transition-all outline-none"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1 block mb-2">Access Authority (Role)</label>
                    <select 
                      name="role" 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#1B3022] focus:ring-2 ring-[#C5A059]/20 transition-all outline-none appearance-none"
                    >
                      <option value="Trainer">Trainer Authority</option>
                      <option value="Owner">Owner Authority</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button 
                type="submit"
                className={`w-full py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                    view === 'login' 
                    ? 'bg-[#1B3022] text-white hover:bg-slate-800' 
                    : 'bg-[#C5A059] text-white hover:bg-[#b08d4b]'
                }`}
            >
                {view === 'login' ? (
                    <>
                        <KeyRound className="w-4 h-4 text-[#C5A059]" />
                        Validate Credentials
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Initialize Access
                    </>
                )}
            </button>
          </form>

          {/* DYNAMIC SYSTEM MESSAGES */}
          {(error || message) && (
            <div className={`mt-8 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                error ? 'bg-red-50/50 border-red-100' : 'bg-[#1B3022]/5 border-[#1B3022]/10'
            }`}>
              {error ? (
                <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
              )}
              <p className={`text-xs font-medium leading-relaxed ${error ? 'text-red-700' : 'text-[#1B3022]'}`}>
                {error || message}
              </p>
            </div>
          )}
        </div>

        {/* VERSION FOOTER */}
        <div className="text-center">
            <p className="text-[9px] uppercase font-bold text-slate-300 tracking-[0.2em]">Build 2026.04.05.V3</p>
            {process.env.NODE_ENV === 'development' && (
                <Link href="/portal/trainer/dashboard" className="text-[9px] font-bold text-[#C5A059] hover:underline mt-2 inline-block uppercase tracking-[0.1em]">
                    Skip Authentication (Dev Mode Active)
                </Link>
            )}
        </div>
      </div>
    </div>
  )
}
