'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import dynamic from 'next/dynamic'

// Dynamically import Recharts to avoid SSR hydration issues with heavy geometry
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const ReferenceArea = dynamic(() => import('recharts').then(mod => mod.ReferenceArea), { ssr: false })

export default function TrainerDashboard() {
  const [msValue, setMsValue] = useState<string>('11.2')
  
  // Real-time calculation using the 1.43 Precision Multiplier
  const cValue = (parseFloat(msValue) || 0) * 1.43

  return (
    <div className="p-10 space-y-10">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">Silver Streak Overview</h2>
          <p className="text-xs font-bold tracking-widest text-[#1B3022] mt-1 opacity-60 uppercase">Stable: Precision Stables | Last Test: 5:00 AM</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 border border-slate-200 rounded-lg bg-white shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Health Score</p>
            <p className="text-2xl font-light text-[#1B3022]">94%</p>
          </div>
          <div className="px-6 py-3 border border-[#D4AF37]/30 rounded-lg bg-[#D4AF37]/5 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-[#D4AF37] mb-1">Status</p>
            <p className="text-2xl font-light text-[#1B3022]">Healing Gold</p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Trend Graph Area */}
        <div className="col-span-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1B3022]"></div>
          <h3 className="text-lg font-bold text-slate-800 mb-8 px-4 border-l-2 border-[#D4AF37]">Bio-Metrics Trend</h3>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide domain={[0, 15]} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                
                {/* Shaded Healing Ranges (The "Zones") */}
                <ReferenceArea y1={3} y2={4} fill="#1B3022" fillOpacity={0.05} label={{ value: 'Brix Target', position: 'insideLeft', fill: '#1B3022', fontSize: 10, opacity: 0.3 }} />
                <ReferenceArea y1={6.4} y2={7.0} fill="#D4AF37" fillOpacity={0.05} label={{ value: 'pH Target', position: 'insideRight', fill: '#D4AF37', fontSize: 10, opacity: 0.3 }} />

                <Line type="monotone" dataKey="brix" stroke="#1B3022" strokeWidth={3} dot={{r: 4, fill: '#1B3022'}} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="ph" stroke="#D4AF37" strokeWidth={3} dot={{r: 4, fill: '#D4AF37'}} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Input Card (Right Sidebar) */}
        <div className="col-span-4 space-y-8">
          <div className="bg-[#1B3022] p-8 rounded-xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {/* Stallion Watermark Symbol */}
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
            </div>

            <h3 className="text-xl font-light mb-6 flex items-center gap-2">
                Daily Input Panel
                <span className="text-[10px] bg-[#D4AF37] px-2 py-0.5 rounded text-[#1B3022] font-bold uppercase tracking-tighter self-start mt-1">PRO</span>
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Conductivity (ms)</label>
                    <div className="relative">
                        <input 
                            type="number"
                            value={msValue}
                            onChange={(e) => setMsValue(e.target.value)}
                            className="w-full bg-[#2D2E2E] border border-transparent focus:border-[#D4AF37] rounded-lg px-4 py-4 text-2xl font-light outline-none transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xs font-bold uppercase">
                            ms
                        </div>
                    </div>
                </div>

                <div className="bg-[#D4AF37] p-6 rounded-lg text-[#1B3022] shadow-inner">
                    <p className="text-[10px] uppercase font-bold mb-1 opacity-70">Calculated Salts (C)</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tighter">{cValue.toFixed(3)}</span>
                        <span className="text-xs font-bold opacity-60">C</span>
                    </div>
                    <p className="text-[10px] mt-4 opacity-60 italic border-t border-[#1B3022]/10 pt-2 font-medium">
                        *Precision Multiplier: 1.43 applied.
                    </p>
                </div>

                <button className="w-full py-4 bg-white text-[#1B3022] font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-slate-100 transition-all shadow-md active:scale-[0.98]">
                    Sync to Stable Records
                </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Stable Gallery</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=200" alt="Siver Streak 1" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1598974357851-98166a9d9b4c?auto=format&fit=crop&q=80&w=200" alt="Silver Streak 2" className="w-full h-full object-cover opacity-80" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mockTrendData = [
  { name: 'Mon', brix: 3.2, ph: 6.8 },
  { name: 'Tue', brix: 4.5, ph: 7.2 },
  { name: 'Wed', brix: 3.8, ph: 6.5 },
  { name: 'Thu', brix: 3.5, ph: 6.7 },
  { name: 'Fri', brix: 4.1, ph: 7.1 },
  { name: 'Sat', brix: 3.4, ph: 6.6 },
  { name: 'Sun', brix: 3.6, ph: 6.8 },
]
