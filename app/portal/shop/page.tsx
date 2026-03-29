import { createClient } from '@/utils/supabase/server'

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').eq('is_active', true)

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <header className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-light text-slate-900 tracking-tight">Clinical Dispensary</h1>
        <p className="text-sm font-semibold tracking-widest text-emerald-600 mt-3 uppercase border border-emerald-200 bg-emerald-50 px-3 py-1 rounded inline-block">
            Hardware & Bio-Supplements
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products?.map((product) => (
            <div key={product.id} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-6 border-t border-slate-100">
                    <span className="text-2xl font-light text-slate-900">${(product.price_cents / 100).toFixed(2)}</span>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors">
                        Procure
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}
