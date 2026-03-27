import BioDataStepper from '@/components/BioDataStepper'
import HealingReportChart from '@/components/HealingReportChart'

export default function HealingReportPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <header className="mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight">Healing Report & Data Engine</h1>
        <p className="text-sm font-semibold tracking-wide text-slate-500 mt-3 uppercase">Go by the Numbers, No Guessing</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-5 relative">
          <div className="sticky top-12">
            <h2 className="text-2xl font-light text-slate-800 mb-6 tracking-tight">Biometric Collection</h2>
            <BioDataStepper />
          </div>
        </div>
        <div className="xl:col-span-7">
          <h2 className="text-2xl font-light text-slate-800 mb-6 tracking-tight">Performance Visualisation</h2>
          <HealingReportChart />
          
          <div className="mt-8 grid grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Ideal State</h3>
               <p className="text-3xl font-light text-slate-900">2 <span className="text-lg text-slate-500">Horses</span></p>
               <p className="text-xs text-emerald-600 mt-2 font-medium">Currently within global healing ranges.</p>
             </div>
             <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Deficient State</h3>
               <p className="text-3xl font-light text-slate-900">0 <span className="text-lg text-slate-500">Horses</span></p>
               <p className="text-xs text-slate-500 mt-2 font-medium">No critical deficiencies detected.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
