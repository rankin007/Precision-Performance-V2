export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 md:p-12">
      <header className="mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight">Stable Overview</h1>
        <p className="text-sm font-medium tracking-wide text-slate-500 mt-3 uppercase">Trainer Portal</p>
      </header>
      
      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-medium text-slate-800">Pending Biometrics</h2>
            <p className="text-4xl font-light text-slate-900 mt-4">4</p>
            <p className="text-sm text-slate-500 mt-2">Horses awaiting data collection</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm md:col-span-2">
            <h2 className="text-lg font-medium text-slate-800">Recent Analysis Focus</h2>
            <div className="mt-6 flex items-center justify-center p-8 bg-slate-50 rounded border border-dashed border-slate-300">
              <p className="text-sm text-slate-500 text-center">Chart Visualisations will render here.<br />Shaded green bands indicate the "Target Healing Range".<br />No horses currently outside operational parameters.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
