import HistoricalChart from '@/components/HistoricalChart'
import Link from 'next/link'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <header className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-light text-slate-900 tracking-tight">Clinical History Dashboard</h1>
          <p className="text-sm font-semibold tracking-widest text-slate-500 mt-3 uppercase">Engineered for Mathematical Certainty</p>
        </div>
        <Link 
          href="/api/export/history"
          prefetch={false}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-md text-sm font-bold tracking-wide uppercase shadow transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Export Clinical Data (CSV)
        </Link>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4">
            
            <HistoricalChart />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Healing Compliance</h3>
                    <p className="text-4xl font-light text-slate-900 mt-4">84<span className="text-2xl text-slate-400">%</span></p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">Time spent within absolute target parameter boundaries.</p>
                </div>
                
                <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Data Integrity Gaps</h3>
                    <p className="text-4xl font-light text-slate-900 mt-4">0</p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">Missed observation days in the trailing period.</p>
                </div>
                 
                <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Conductivity Deviation</h3>
                    <p className="text-4xl font-light text-slate-900 mt-4">1.2<span className="text-2xl text-slate-400">C</span></p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">Standard deviation across cohort. Environment is stable.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
