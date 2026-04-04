'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  LayoutGrid, 
  PlusCircle, 
  BarChart2, 
  Settings 
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/portal/trainer/dashboard' },
  { icon: LayoutGrid, label: 'Stable', href: '/portal/trainer/stable' },
  { icon: PlusCircle, label: 'Entry', href: '/entry' },
  { icon: BarChart2, label: 'Stats', href: '/portal/trainer/healing-report' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 pointer-events-none">
      <div className="max-w-md mx-auto h-20 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 pointer-events-auto overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center justify-center py-2 px-4 transition-all duration-300"
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-[#C5A059]/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-[#C5A059]' : 'text-slate-500'
                }`} 
              />
              
              <span className={`text-[10px] font-bold mt-1 uppercase tracking-widest transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-slate-600'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
