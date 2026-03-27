import BioDataStepper from '@/components/BioDataStepper'

export default function MobileEntry() {
  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 flex flex-col justify-center font-sans">
      <div className="w-full max-w-md mx-auto">
        <header className="mb-8 text-center">
            <h1 className="text-2xl font-light text-white tracking-tight uppercase">Performance Entry</h1>
            <p className="text-[10px] font-bold tracking-widest text-emerald-500 mt-2 uppercase border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded inline-block">
                Mobile PWA Active
            </p>
        </header>
        <BioDataStepper />
      </div>
    </div>
  )
}
