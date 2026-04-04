'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  ShoppingCart, 
  UserCircle,
  TrendingUp,
  Activity
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
    <div className="w-64 h-screen bg-[#1B3022] text-white flex flex-col border-r border-[#2D2E2E] sticky top-0">
      <div className="p-8 border-b border-[#2D2E2E]/50">
        <h1 className="text-xl font-light tracking-tighter leading-none">
          PRECISION<br/>
          <span className="font-bold opacity-80 gold-gradient-text">PERFORMANCE</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] mt-3 text-white/40 font-bold">Elite Equine Analysis</p>
      </div>

      <nav className="flex-1 mt-8 space-y-1.5 px-4 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative block"
            >
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-[#2D2E2E] rounded-lg border border-[#C5A059]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-[#C5A059]' : 'group-hover:text-white/70'}`} />
                <span className="relative z-10">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-[#2D2E2E]/50 bg-[#142319]">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse shadow-[0_0_8px_#C5A059]" />
            <p className="text-[10px] uppercase font-bold text-[#C5A059] tracking-widest">Live Telemetry</p>
        </div>
        <div className="flex items-center justify-between text-[9px] text-white/30">
            <span>Stable Ops Active</span>
            <Activity className="w-3 h-3 opacity-50" />
        </div>
      </div>
    </div>
  )
}
