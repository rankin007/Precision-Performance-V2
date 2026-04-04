import { createClient } from '@/utils/supabase/server'
import { procureProduct } from './actions'
import { ShoppingBag, Box, Activity, ShieldCheck, Check } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createClient()
  
  // 1. Fetch Products & Categories (V3 Schema)
  const { data: products } = await supabase
    .from('products')
    .select('*, product_categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F8F9F8] p-8 md:p-12 space-y-12">
      
      {/* IMMERSIVE HEADER */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl font-light text-slate-900 tracking-tight">Clinical Dispensary</h1>
            <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.3em]">Hardware & Performance Services</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-200 group transition-colors hover:border-[#C5A059]/30">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover:text-[#C5A059] transition-colors">Order Status</p>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-[#1B3022]">Secure Checkout Active</span>
                </div>
            </div>
        </div>
      </header>

      {/* DISPENSARY GRID */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col justify-between transition-all hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Visual Aspect */}
            <div className="relative h-48 w-full bg-[#1B3022]/5 flex items-center justify-center">
                {product.product_categories?.name === 'Hardware' ? (
                  <Box className="w-16 h-16 text-[#C5A059]/30 opacity-60" />
                ) : (
                  <Activity className="w-16 h-16 text-[#C5A059]/30 opacity-60" />
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-[#1B3022]/60 border border-white/50">
                        {product.product_categories?.name || 'V3 Product'}
                    </span>
                </div>
            </div>

            {/* Content Aspect */}
            <div className="p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-bold text-[#1B3022] mb-2">{product.name}</h3>
                   <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">{product.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</span>
                    <p className="text-2xl font-light text-[#1B3022]">
                        <span className="text-sm font-bold mr-0.5">$</span>
                        {Number(product.base_price).toLocaleString()}
                        <span className="text-[10px] font-bold text-slate-300 ml-1.5 uppercase tracking-tighter">AUD</span>
                    </p>
                  </div>
                  
                  {/* Procurement Logic */}
                  <form action={async () => {
                    'use server'
                    await procureProduct(product.id)
                  }}>
                    <button 
                        type="submit"
                        className="bg-[#1B3022] hover:bg-[#C5A059] text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#1B3022]/10 active:scale-95"
                    >
                        Procure
                    </button>
                  </form>
                </div>

                {/* Stock Awareness */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {product.stock_level > 0 ? `Limited Allocation (${product.stock_level})` : 'Dispatched on Demand'}
                </div>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {(!products || products.length === 0) && (
          <div className="col-span-full py-24 text-center glass-panel rounded-[3rem]">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No clinical products currently in allocation.</p>
          </div>
        )}
      </section>

    </div>
  )
}
