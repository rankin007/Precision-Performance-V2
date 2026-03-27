export default function HealingReportChart() {
  return (
    <div className="w-full bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-light text-slate-900">Urine pH vs Saliva pH (30 Days)</h3>
          <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">Trend Analysis</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Healing Range Active
        </span>
      </div>
      
      {/* Mock Chart Canvas */}
      <div className="relative w-full h-80 border-l-2 border-b-2 border-slate-200 flex items-center justify-center bg-white rounded-bl-sm overflow-hidden">
        
        {/* The Healing Range Band spanning 6.4 to 7.0 implicitly. Positioned on a mock Y-axis of 0-10 */}
        <div className="absolute w-full h-[6%] bg-emerald-500 opacity-10 bottom-[64%]"></div>
        <div className="absolute w-full h-[6%] border-y border-emerald-500 opacity-30 bottom-[64%] flex items-center pr-4 justify-end">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded opacity-80">6.4 — 7.0 Target</span>
        </div>
        
        {/* Grid lines */}
        <div className="absolute w-full border-b border-slate-100 bottom-1/4"></div>
        <div className="absolute w-full border-b border-slate-100 bottom-2/4"></div>
        <div className="absolute w-full border-b border-slate-100 bottom-3/4"></div>
        
        <p className="text-sm text-slate-400 z-10 text-center font-medium bg-white/80 p-4 rounded">
          Interactive Time-Series Chart Framework<br />
          <span className="text-xs font-normal">Data visualised seamlessly over the green healing bands</span>
        </p>
      </div>
      
      {/* Y-Axis Label mock */}
      <div className="mt-4 flex justify-between text-xs font-medium text-slate-400">
        <span>30 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
