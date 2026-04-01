import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function StablePage() {
  const supabase = await createClient()

  const { data: horses } = await supabase
    .from('horses')
    .select('id, name, default_weight_kg, created_at')
    .order('name')

  // Fetch the latest bio log per horse to show current health status
  const { data: latestLogs } = await supabase
    .from('bio_logs')
    .select('horse_id, urine_brix, urine_ph, urine_salts_c, is_healing_brix, is_healing_ph_urine, is_healing_salts, recorded_at')
    .order('recorded_at', { ascending: false })

  // Build a map: horse_id -> latest log
  const latestByHorse = new Map<string, typeof latestLogs extends (infer T)[] | null ? T : never>()
  for (const log of latestLogs ?? []) {
    if (!latestByHorse.has(log.horse_id)) {
      latestByHorse.set(log.horse_id, log)
    }
  }

  // Use the seeded horse names if DB is empty (dev fallback)
  const displayHorses = horses && horses.length > 0 ? horses : [
    { id: '1', name: 'Autum', default_weight_kg: 490, created_at: '' },
    { id: '2', name: 'Deloviere', default_weight_kg: 510, created_at: '' },
    { id: '3', name: 'Lunar Lover', default_weight_kg: 485, created_at: '' },
    { id: '4', name: 'Idle Flyer', default_weight_kg: 505, created_at: '' },
    { id: '5', name: 'Inn Count', default_weight_kg: 520, created_at: '' },
    { id: '6', name: 'Midiaro', default_weight_kg: 495, created_at: '' },
    { id: '7', name: 'Mountain Queen', default_weight_kg: 500, created_at: '' },
    { id: '8', name: 'Golden Standard', default_weight_kg: 515, created_at: '' },
    { id: '9', name: 'Febright', default_weight_kg: 480, created_at: '' },
    { id: '10', name: 'Blue Squares', default_weight_kg: 500, created_at: '' },
  ]

  return (
    <div className="p-10 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">Stable Roster</h2>
          <p className="text-xs font-bold tracking-widest text-[#1B3022]/60 mt-1 uppercase">
            {displayHorses.length} Horses · Precision Performance Stables
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-slate-400 font-medium">Status: <span className="text-[#1B3022] font-bold">Live Telemetry</span></span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayHorses.map((horse) => {
          const log = latestByHorse.get(horse.id)
          const tripleHealing = log?.is_healing_brix && log?.is_healing_ph_urine && log?.is_healing_salts
          const hasLog = !!log

          return (
            <div
              key={horse.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md group ${
                tripleHealing ? 'border-[#C5A059]/40' : 'border-slate-200'
              }`}
            >
              {/* Colour-coded status bar */}
              <div className={`h-1.5 ${tripleHealing ? 'bg-[#C5A059]' : hasLog ? 'bg-slate-300' : 'bg-slate-100'}`} />

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{horse.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{horse.default_weight_kg} kg</p>
                  </div>
                  {tripleHealing ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                      ✦ Triple Healing
                    </span>
                  ) : hasLog ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                      Monitoring
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-50 text-amber-500 border border-amber-200">
                      No Data
                    </span>
                  )}
                </div>

                {hasLog && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Brix</p>
                      <p className={`text-lg font-bold ${log.is_healing_brix ? 'text-[#1B3022]' : 'text-slate-500'}`}>
                        {log.urine_brix?.toFixed(1) ?? '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">pH</p>
                      <p className={`text-lg font-bold ${log.is_healing_ph_urine ? 'text-[#1B3022]' : 'text-slate-500'}`}>
                        {log.urine_ph?.toFixed(1) ?? '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Salts C</p>
                      <p className={`text-lg font-bold ${log.is_healing_salts ? 'text-[#C5A059]' : 'text-slate-500'}`}>
                        {log.urine_salts_c?.toFixed(1) ?? '—'}
                      </p>
                    </div>
                  </div>
                )}

                {!hasLog && (
                  <div className="mb-5 text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-lg">
                    No biometric readings on file.<br />Enter the first test below.
                  </div>
                )}

                <Link
                  href={`/entry?horse=${horse.id}`}
                  className="block w-full text-center py-3 bg-[#1B3022] hover:bg-[#2d4a35] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                >
                  Record Today's Reading
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
