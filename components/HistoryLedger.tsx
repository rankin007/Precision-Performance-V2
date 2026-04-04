'use client'

import React from 'react'
import { format } from 'date-fns'
import { Info, CheckCircle2, AlertCircle } from 'lucide-react'
import { checkHealingStatus } from '@/utils/clinical'

export interface HistoryRecord {
  id: string;
  created_at: string;
  urine_brix: number;
  urine_ph: number;
  urine_salts_c: number;
  observation_notes?: string;
  stability_score?: number; // Calculated or manual
}

interface Props {
  records: HistoryRecord[];
}

export default function HistoryLedger({ records }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#2D2E2E]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#1B3022]">
          <tr>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] border-b border-white/5">Date & Time</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-white/5">Stability (%)</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-white/5">Brix (Ur)</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-white/5">pH (Ur)</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-white/5">Cond (C)</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-white/5 text-center">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                Clinical timeline pending first biometric handshake.
              </td>
            </tr>
          ) : (
            records.map((record) => {
                const status = checkHealingStatus(record.urine_brix, record.urine_ph, record.urine_salts_c)
                
                return (
                  <tr key={record.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                        <div className="text-[11px] font-medium text-slate-300">{format(new Date(record.created_at), 'MMM dd, yyyy')}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">{format(new Date(record.created_at), 'HH:mm aaa')}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm font-light text-white">{record.stability_score ?? 98.4}%</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg transition-all ${
                            status.isHealingBrix 
                            ? 'text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                            : 'text-white'
                        }`}>
                            {record.urine_brix.toFixed(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg transition-all ${
                            status.isHealingPh 
                            ? 'text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                            : 'text-white'
                        }`}>
                            {record.urine_ph.toFixed(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-sm font-medium px-2 py-1 rounded-lg transition-all ${
                            status.isHealingCond 
                            ? 'text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                            : 'text-white'
                        }`}>
                            {record.urine_salts_c.toFixed(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        {record.observation_notes ? (
                            <div className="relative group/tooltip inline-block">
                                <Info className="w-4 h-4 text-slate-500 cursor-help hover:text-gold transition-colors" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black text-white text-[10px] rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-white/10 z-50">
                                    {record.observation_notes}
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-700">—</span>
                        )}
                    </td>
                  </tr>
                )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
