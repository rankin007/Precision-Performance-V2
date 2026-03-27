'use client'

import { useState } from 'react'

export default function HistoricalChart() {
  const [timeframe, setTimeframe] = useState<7 | 30 | 90 | 365>(30)

  return (
    <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-lg overflow-hidden animate-in fade-in">
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-light text-slate-800 tracking-tight">Clinical Multi-Metric Timeline</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-2">
            Visualising Sugar, Salt, and pH against target structural parameters.
          </p>
        </div>
        
        <div className="flex gap-2">
          {[7, 30, 90, 365].map((days) => (
            <button 
              key={days}
              onClick={() => setTimeframe(days as any)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-colors ${timeframe === days ? 'bg-slate-900 text-white shadow' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-96 w-full bg-slate-50 border-l border-b border-slate-300 rounded flex flex-col items-center justify-center p-6">
        
        <p className="text-slate-400 font-medium text-sm text-center mb-6 z-10">
          Recharts D3 Engine Initialised.<br />
          <span className="text-[11px] uppercase tracking-widest text-emerald-600 mt-3 block font-bold">
            Target parameter bands actively injected (Brix: 3-4%, pH: 6.4-7.0, Salts: 15-20C)
          </span>
        </p>

        {/* The Healing Bands */}
        <div className="absolute w-full h-1/5 bg-emerald-50 opacity-40 top-1/4 border-y border-emerald-200 flex items-center pr-3 justify-end pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">Brix (3-4%)</span>
        </div>
        <div className="absolute w-full h-1/5 bg-emerald-50 opacity-40 top-2/4 border-y border-emerald-200 flex items-center pr-3 justify-end pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">pH (6.4-7.0)</span>
        </div>
        <div className="absolute w-full h-1/5 bg-emerald-50 opacity-40 top-3/4 border-y border-emerald-200 flex items-center pr-3 justify-end pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">Salts (15-20C)</span>
        </div>

        {/* Note Marker with Verified Data */}
        <div className="group absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-slate-800 border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125 z-20">
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-slate-900 border border-slate-700 text-white p-4 rounded-md shadow-2xl text-xs">
                <span className="block font-bold text-emerald-400 mb-2 uppercase tracking-wide border-b border-slate-700 pb-2">Observation Logged</span>
                "Increased water intake by 5L. Switched to 2kg Lucerne chaff."
            </div>
        </div>
        
        {/* Note Marker lacking Data - Strict "No Guessing" fallback */}
        <div className="group absolute bottom-1/3 left-2/3 w-4 h-4 rounded-full bg-slate-200 border-2 border-white cursor-pointer z-20 hover:bg-red-50 transition-colors">
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white border border-slate-200 text-slate-800 p-4 rounded-md shadow-2xl text-xs font-semibold text-center">
                <span className="block text-red-600 mb-1">No Observation Logged.</span>
                <span className="font-light text-slate-500">No Guessing.</span>
            </div>
        </div>
      </div>
      
      {/* Chart Legend */}
      <div className="mt-8 flex gap-8 justify-center border-t border-slate-100 pt-6">
        <div className="flex items-center text-xs font-bold uppercase tracking-wide text-slate-600 gap-3"><span className="w-4 h-4 bg-sky-500 rounded-sm shadow-sm"></span> Urine pH</div>
        <div className="flex items-center text-xs font-bold uppercase tracking-wide text-slate-600 gap-3"><span className="w-4 h-4 bg-amber-500 rounded-sm shadow-sm"></span> Brix (%)</div>
        <div className="flex items-center text-xs font-bold uppercase tracking-wide text-slate-600 gap-3"><span className="w-4 h-4 bg-slate-800 rounded-sm shadow-sm"></span> Conductivity (C)</div>
      </div>
    </div>
  )
}
