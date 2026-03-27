import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-center p-8">
      <h1 className="text-5xl font-light text-slate-900 tracking-tight mb-4">Precision Performance</h1>
      <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase mb-12">
        Go by the Numbers, No Guessing
      </p>
      <Link 
        href="/login" 
        className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-8 py-4 text-sm font-semibold transition-colors"
      >
        Access Portal
      </Link>
    </div>
  )
}
