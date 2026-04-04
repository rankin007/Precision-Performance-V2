import { createClient } from '@/utils/supabase/server'
import OwnerTrendChart from './OwnerTrendChart'

export default async function OwnerTrendDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div>Auth Context Missing</div>

  // 1. Fetch the owner's horses via V3 horse_ownership
  const { data: portfolio } = await supabase
    .from('horse_ownership')
    .select('horses(id, name)')
    .eq('owner_id', user.id)

  const horses = portfolio?.map((p: any) => p.horses) || []

  // 2. Fetch the 30-day clinical logs window via biochemistry_logs JOIN daily_records
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: logs } = await supabase
    .from('daily_records')
    .select(`
      created_at,
      horse_id,
      biochemistry_logs (
        urine_brix,
        urine_ph,
        urine_salts_c
      )
    `)
    .in('horse_id', horses.map(h => h.id))
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // 3. Map for Chart (Compatibility Shim)
  const mappedLogs = logs?.map((r: any) => ({
    recorded_at: r.created_at,
    horse_id: r.horse_id,
    urine_brix: r.biochemistry_logs?.[0]?.urine_brix,
    urine_ph: r.biochemistry_logs?.[0]?.urine_ph,
    urine_salts_c: r.biochemistry_logs?.[0]?.urine_salts_c,
  })) || []

  return (
    <div className="p-10 space-y-10">
      <header>
        <h2 className="text-3xl font-light text-slate-900 tracking-tight">30-Day Stability View</h2>
        <p className="text-xs font-bold tracking-widest text-[#1B3022]/60 mt-1 uppercase">
          Owner Portal · Trend Analysis · "Trust the Numbers"
        </p>
      </header>

      <OwnerTrendChart horses={horses} logs={mappedLogs} />
    </div>
  )
}
