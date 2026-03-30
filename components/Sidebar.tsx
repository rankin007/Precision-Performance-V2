'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  ShoppingCart, 
  UserCircle,
  TrendingUp
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/portal/trainer/dashboard', icon: LayoutDashboard },
  { name: 'Stable', href: '/portal/trainer/stable', icon: Database },
  { name: 'Reports', href: '/portal/trainer/reports', icon: BarChart3 },
  { name: '30-Day Trend', href: '/portal/owner/trend', icon: TrendingUp },
  { name: 'Shop', href: '/portal/shop', icon: ShoppingCart },
  { name: 'Profile', href: '/portal/profile', icon: UserCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-[#1B3022] text-white flex flex-col border-r border-[#2D2E2E]">
      <div className="p-8 border-b border-[#2D2E2E]">
        <h1 className="text-xl font-light tracking-tighter leading-none">
          PRECISION<br/>
          <span className="font-bold opacity-80">PERFORMANCE</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest mt-2 opacity-40">Elite Equine Analysis</p>
      </div>

      <nav className="flex-1 mt-8 space-y-2 px-4 text-sm font-medium tracking-wide">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#2D2E2E] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-[#2D2E2E]/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#C5A059]' : 'opacity-60'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-[#2D2E2E] bg-[#142319]">
        <p className="text-[10px] uppercase font-bold text-[#C5A059] mb-1">Live Telemetry</p>
        <p className="text-[9px] text-slate-500">v2.1 Stable Ops Handshake Active</p>
      </div>
    </div>
  )
}
