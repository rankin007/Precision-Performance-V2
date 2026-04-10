import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { checkHealingStatus } from '@/utils/clinical'

export default async function StablePage() {
  const cookieStore = await cookies()

  const supabase = createClient(cookieStore)

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

  // Standard Horse Library Mapping
  const horseImages: Record<string, string> = {
    'Autum': '/images/autum.png',
    'Deloviere': '/images/deloviere.png',
    'Lunar Lover': '/images/lunar_lover.png',
    'Idle Flyer': '/images/idle_flyer.png',
    'Inn Count': '/images/inn_count.png',
    'Midiaro': '/images/midiaro.png',
    'Mountain Queen': '/images/mountain_queen.png',
    'Golden Standard': '/images/golden_standard.png',
    'Febright': '/images/febright.png',
    'Blue Squares': '/images/blue_squares.png'
  }

  // Use the seeded horse names if DB is empty (dev fallback)
  const displayHorses = horses && horses.length > 0 ? horses : [
    { id: '1', name: 'Autum', default_weight_kg: 490, breed: 'Arabian' },
    { id: '2', name: 'Deloviere', default_weight_kg: 510, breed: 'Thoroughbred' },
    { id: '3', name: 'Lunar Lover', default_weight_kg: 485, breed: 'Warmblood' },
    { id: '4', name: 'Idle Flyer', default_weight_kg: 505, breed: 'Sport Horse' },
    { id: '5', name: 'Inn Count', default_weight_kg: 520, breed: 'Percheron' },
    { id: '6', name: 'Midiaro', default_weight_kg: 495, breed: 'Holsteiner' },
    { id: '7', name: 'Mountain Queen', default_weight_kg: 500, breed: 'PRE Stallion' },
    { id: '8', name: 'Golden Standard', default_weight_kg: 515, breed: 'Warmblood' },
    { id: '9', name: 'Febright', default_weight_kg: 480, breed: 'Thoroughbred' },
    { id: '10', name: 'Blue Squares', default_weight_kg: 500, breed: 'Appaloosa' },
  ]

  return (
    <div className="p-10 space-y-10 min-h-screen bg-[#F8F9F8]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-light text-slate-900 tracking-tight">Stable Roster</h2>
          <p className="text-[10px] font-bold tracking-[0.4em] text-paddock/40 uppercase mt-2">
            Precision Performance Stables · {displayHorses.length} Athletes Active
          </p>
        </div>
        <div className="flex gap-4 items-center px-4 py-2 bg-white/50 rounded-full border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#C5A059]" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Live Telemetry Handshake</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayHorses.map((horse) => {
          const log = latestByHorse.get(horse.id)
          const status = checkHealingStatus(
            log?.urine_brix ?? 0, 
            log?.urine_ph ?? 0, 
            log?.urine_salts_c ?? 0
          )
          const tripleHealing = status.isTripleHealing
          const hasLog = !!log

          return (
            <div
              key={horse.id}
              className="glass-panel rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group bg-white/40"
            >
                <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                        src={horseImages[horse.name] || '/images/autum.png'} 
                        alt={horse.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {tripleHealing && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-paddock text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                            ✦ Triple Healing
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-light text-paddock">{horse.name}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Weight: {horse.default_weight_kg} kg</p>
                        </div>
                        {hasLog ? (
                             <div className="text-right">
                                <p className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tripleHealing ? 'bg-green-500' : 'bg-amber-400'}`} />
                                    <span className="text-[10px] font-bold text-paddock uppercase tracking-widest">{tripleHealing ? 'Optimal' : 'Monitoring'}</span>
                                </div>
                             </div>
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                                No Data
                            </span>
                        )}
                    </div>

                    {hasLog && (
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className={`p-4 rounded-2xl border text-center transition-colors ${status.isHealingBrix ? 'bg-paddock/5 border-paddock/10' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Brix</p>
                                <p className="text-lg font-medium text-paddock">{log.urine_brix?.toFixed(1) ?? '—'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl border text-center transition-colors ${status.isHealingPh ? 'bg-paddock/5 border-paddock/10' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">pH</p>
                                <p className="text-lg font-medium text-paddock">{log.urine_ph?.toFixed(1) ?? '—'}</p>
                            </div>
                            <div className={`p-4 rounded-2xl border text-center transition-colors ${status.isHealingCond ? 'bg-gold/5 border-gold/10' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Salts</p>
                                <p className="text-lg font-medium text-gold">{log.urine_salts_c?.toFixed(1) ?? '—'}</p>
                            </div>
                        </div>
                    )}

                    {!hasLog && (
                        <div className="mb-8 text-center py-6 text-[11px] text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 font-medium italic">
                            Biometric telemetry sync required.<br />Stable baseline pending first test.
                        </div>
                    )}

                    <Link
                        href={`/entry?horse=${horse.id}`}
                        className={`block w-full py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${
                            tripleHealing 
                                ? 'bg-gold text-paddock shadow-[0_4px_20px_rgba(197,160,89,0.3)] hover:scale-[1.02]' 
                                : 'bg-paddock text-white hover:bg-paddock/90'
                        }`}
                    >
                        Secure Entry Channel
                    </Link>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
