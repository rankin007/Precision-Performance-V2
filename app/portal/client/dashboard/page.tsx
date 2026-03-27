export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 md:p-12">
      <header className="mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight">My Horses</h1>
        <p className="text-sm font-medium tracking-wide text-slate-500 mt-3 uppercase">Client Portal</p>
      </header>
      
      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-medium text-slate-800">Recent Activity</h2>
            <p className="text-sm text-slate-500 mt-4">Your trainer has updated the biometrics for "Thunder". Urine pH is currently stable at 7.2.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
