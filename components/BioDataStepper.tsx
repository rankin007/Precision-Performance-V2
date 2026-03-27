'use client'

import { useState } from 'react'

export default function BioDataStepper() {
  const [step, setStep] = useState(1)
  const [saltsMs, setSaltsMs] = useState<number | ''>('')
  const [brix, setBrix] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  // Real-time Conversion Logic C = ms * 1.43
  const saltsC = typeof saltsMs === 'number' ? (saltsMs * 1.43).toFixed(2) : '0.00'

  const validateStep2 = () => {
    if (typeof brix === 'number' && (brix < 0 || brix > 13)) {
      setError('Data Out of Bounds: Sugars (Brix) must be between 0 and 13%.')
      return false
    }
    if (typeof saltsMs === 'number' && ((saltsMs * 1.43) < 0 || (saltsMs * 1.43) > 70)) {
      setError('Data Out of Bounds: Salts (C) must be between 0 and 70.')
      return false
    }
    setError(null)
    return true
  }

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return
    setStep((s) => Math.min(s + 1, 4))
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm w-full">
      <h2 className="text-xl font-light text-slate-900 mb-6">Biometric Data Entry (Step {step} of 4)</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200 font-medium">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°C)</label>
            <input type="number" step="0.1" className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="37.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
            <input type="number" step="0.5" className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="500" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Sugars (Brix %)</label>
            <input 
              type="number" step="0.1" 
              className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" 
              placeholder="Operational Range: 0 - 13%" 
              value={brix} onChange={(e) => setBrix(e.target.value ? Number(e.target.value) : '')}
            />
             {typeof brix === 'number' && brix >= 3.0 && brix <= 4.0 && (
              <p className="text-xs font-semibold text-emerald-600 mt-2 uppercase tracking-wide">✓ Target Healing Range</p>
            )}
          </div>

          <div className="p-5 bg-slate-50 rounded-md border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Conductivity / Salts (Input in ms)</label>
            <input 
              type="number" step="0.1"
              className="w-full rounded-md border border-slate-300 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white" 
              placeholder="Enter microsiemens (ms)" 
              value={saltsMs} onChange={(e) => setSaltsMs(e.target.value ? Number(e.target.value) : '')}
            />
            <div className="flex items-center justify-between text-sm bg-white p-3 rounded border border-slate-100">
              <span className="text-slate-500 font-medium">Converted Conductivity (C):</span>
              <span className={`text-lg font-bold ${Number(saltsC) >= 15 && Number(saltsC) <= 20 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {saltsC} C
              </span>
            </div>
            {Number(saltsC) >= 15 && Number(saltsC) <= 20 && (
              <p className="text-xs font-semibold text-emerald-600 mt-3 text-right uppercase tracking-wide">✓ Target Healing Range</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Urine pH</label>
            <input type="number" step="0.1" className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Operational Range: 0 - 10" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Saliva pH</label>
            <input type="number" step="0.1" className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Operational Range: 0 - 10" />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Distance Travelled (m)</label>
            <input type="number" className="w-full rounded-md border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trainer Comments</label>
            <textarea className="w-full rounded-md border border-slate-300 p-3 h-28 focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Observational notes (optional)..."></textarea>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
        <button 
          onClick={() => setStep((s) => Math.max(s - 1, 1))}
          className={`px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ${step === 1 ? 'invisible' : ''}`}
        >
          Back
        </button>
        {step < 4 ? (
          <button 
            onClick={handleNext}
            className="px-8 py-3 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button className="px-8 py-3 bg-emerald-700 text-white text-sm font-bold tracking-wide uppercase rounded-md hover:bg-emerald-600 transition-colors">
            Save Record
          </button>
        )}
      </div>
    </div>
  )
}
