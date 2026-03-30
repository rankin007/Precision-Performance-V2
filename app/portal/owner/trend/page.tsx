import { createClient } from '@/utils/supabase/server'
import OwnerTrendChart from './OwnerTrendChart'

export default async function OwnerTrendDashboard() {
  const supabase = await createClient()

  // Fetch the 10 real horses seeded from legacy archives
  const { data: horses } = await supabase
    .from('horses')
    .select('id, name')
    .limit(10)

  // Fetch the 30-day bio_logs window
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: logs } = await supabase
    .from('bio_logs')
    .select(`
      recorded_at,
      urine_brix,
      urine_ph,
      urine_salts_c,
      is_healing_brix,
      is_healing_ph_urine,
      is_healing_salts,
      horse_id
    `)
    .gte('recorded_at', thirtyDaysAgo.toISOString())
    .order('recorded_at', { ascending: true })

  return (
    <div className="p-10 space-y-10">
      <header>
        <h2 className="text-3xl font-light text-slate-900 tracking-tight">30-Day Stability View</h2>
        <p className="text-xs font-bold tracking-widest text-[#1B3022]/60 mt-1 uppercase">
          Owner Portal · Trend Analysis · "Trust the Numbers"
        </p>
      </header>

      <OwnerTrendChart horses={horses ?? []} logs={logs ?? []} />
    </div>
  )
}
