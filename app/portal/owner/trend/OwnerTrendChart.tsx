'use client'

import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend,
} from 'recharts'
import { TrendingUp, Droplets, Activity, Zap } from 'lucide-react'

type Horse = { id: string; name: string }
type Log = {
  recorded_at: string
  urine_brix: number | null
  urine_ph: number | null
  urine_salts_c: number | null
  is_healing_brix: boolean | null
  is_healing_ph_urine: boolean | null
  is_healing_salts: boolean | null
  horse_id: string
}

type Props = { horses: Horse[]; logs: Log[] }

// Format a date to a short label
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// Transform logs into recharts-compatible series for a specific horse
function buildSeries(logs: Log[], horseId: string) {
  return logs
    .filter((l) => l.horse_id === horseId)
    .map((l) => ({
      date: shortDate(l.recorded_at),
      brix: l.urine_brix ?? undefined,
      ph: l.urine_ph ?? undefined,
      salts_c: l.urine_salts_c ?? undefined,
      healingEvent: l.is_healing_brix && l.is_healing_ph_urine && l.is_healing_salts,
    }))
}

// A single metric stat badge
function StatBadge({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className={`px-5 py-4 rounded-lg border ${gold ? 'bg-[#C5A059]/10 border-[#C5A059]/30' : 'bg-white border-slate-200'} shadow-sm`}>
      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-light ${gold ? 'text-[#C5A059]' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}

// Custom tooltip showing point data + healing status
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  const isHealing = d?.healingEvent

  return (
    <div className={`p-4 rounded-xl shadow-xl text-sm border ${isHealing ? 'bg-[#1B3022] border-[#C5A059]/30 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
      <p className="font-bold mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value?.toFixed(2)}</span>
        </p>
      ))}
      {isHealing && (
        <div className="mt-3 border-t border-[#C5A059]/20 pt-2">
          <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest">✦ Triple Healing</span>
        </div>
      )}
    </div>
  )
}

export default function OwnerTrendChart({ horses, logs }: Props) {
  const [selectedHorseId, setSelectedHorseId] = useState(horses[0]?.id ?? '')
  const chartData = buildSeries(logs, selectedHorseId)
  const selectedHorse = horses.find((h) => h.id === selectedHorseId)

  const healingCount = chartData.filter((d) => d.healingEvent).length
  const latestBrix = chartData.at(-1)?.brix?.toFixed(2) ?? '—'
  const latestPh = chartData.at(-1)?.ph?.toFixed(2) ?? '—'

  // Fall back to mock data if Supabase has no logs yet
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { date: '01 Mar', brix: 4.5, ph: 7.2, salts_c: 18.1, healingEvent: false },
          { date: '05 Mar', brix: 3.8, ph: 6.5, salts_c: 14.3, healingEvent: false },
          { date: '10 Mar', brix: 3.5, ph: 6.7, salts_c: 15.8, healingEvent: true },
          { date: '15 Mar', brix: 3.2, ph: 6.9, salts_c: 16.2, healingEvent: true },
          { date: '20 Mar', brix: 3.6, ph: 6.8, salts_c: 17.0, healingEvent: true },
          { date: '25 Mar', brix: 4.1, ph: 7.1, salts_c: 19.5, healingEvent: false },
          { date: '30 Mar', brix: 3.4, ph: 6.6, salts_c: 15.5, healingEvent: true },
        ]

  return (
    <div className="space-y-8">
      {/* Horse Selector */}
      {horses.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {horses.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHorseId(h.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                selectedHorseId === h.id
                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B3022]'
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatBadge label="30-Day Brix (Latest)" value={latestBrix} />
        <StatBadge label="Urine pH (Latest)" value={latestPh} />
        <StatBadge label="Triple Healing Events" value={`${healingCount} days`} gold />
        <StatBadge label="Stability Score" value={chartData.length > 0 ? `${Math.round((healingCount / chartData.length) * 100)}%` : '—'} gold />
      </div>

      {/* Trend Graph */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {selectedHorse?.name ?? 'All Horses'} — Biometric Trend
            </h3>
            <p className="text-xs text-slate-400 mt-1">Shaded zones = "Healing Range" targets per RBTI protocol</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-[#1B3022]"><span className="w-3 h-0.5 bg-[#1B3022] rounded inline-block"></span>Brix</span>
            <span className="flex items-center gap-1.5 font-medium text-[#C5A059]"><span className="w-3 h-0.5 bg-[#C5A059] rounded inline-block"></span>pH Urine</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-400"><span className="w-3 h-0.5 bg-slate-400 rounded inline-block"></span>Salts C</span>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis hide domain={[0, 25]} />
              <Tooltip content={<CustomTooltip />} />

              {/* Shaded Healing Zones */}
              <ReferenceArea y1={3} y2={4} fill="#1B3022" fillOpacity={0.06} label={{ value: 'Brix Zone', position: 'insideLeft', fill: '#1B3022', fontSize: 9, opacity: 0.4, offset: 4 }} />
              <ReferenceArea y1={6.4} y2={7.0} fill="#C5A059" fillOpacity={0.08} label={{ value: 'pH Zone', position: 'insideRight', fill: '#C5A059', fontSize: 9, opacity: 0.4, offset: 4 }} />

              <Line type="monotone" dataKey="brix" name="Brix" stroke="#1B3022" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#1B3022' }} activeDot={{ r: 8, fill: '#1B3022' }} />
              <Line type="monotone" dataKey="ph" name="pH Urine" stroke="#C5A059" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#C5A059' }} activeDot={{ r: 8, fill: '#C5A059' }} />
              <Line type="monotone" dataKey="salts_c" name="Salts C" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
