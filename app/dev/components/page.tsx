import BioDataStepper from '@/components/BioDataStepper'
import HistoricalChart from '@/components/HistoricalChart'

export default function DevComponents() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12 font-sans">
      <header className="mb-12 border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light text-slate-900 tracking-tight">Component Library Audit</h1>
          <p className="text-xs font-bold tracking-widest text-emerald-600 mt-3 uppercase border border-emerald-200 bg-emerald-50 px-3 py-1 rounded inline-block">
            Emergency Bypass Active (TTL: 30m)
          </p>
        </div>
      </header>

      <div className="space-y-16 max-w-7xl mx-auto">
        <section>
            <h2 className="text-2xl font-light text-slate-800 mb-6 tracking-tight">1. Biometric Validation Engine</h2>
            <p className="text-sm text-slate-500 mb-6">Test the 1.43 Multiplier Logic and boundary validation constraints.</p>
            <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 shadow-inner">
                <BioDataStepper />
            </div>
        </section>
        
        <section>
            <h2 className="text-2xl font-light text-slate-800 mb-6 tracking-tight">2. Multi-Metric Historical Graph</h2>
            <p className="text-sm text-slate-500 mb-6">Verify the exact scale separation and permanent Healing Target visual overlays.</p>
            <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 shadow-inner">
                <HistoricalChart />
            </div>
        </section>
      </div>
    </div>
  )
}
