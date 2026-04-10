'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Precision Performance V3: Procurement Handshake
 * Creates a pending order in the database for human fulfillment.
 */
export async function procureProduct(productId: string) {
  const cookieStore = await cookies()

  const supabase = createClient(cookieStore)
  
  // 1. Verify User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required for procurement.')

  // 2. Resolve Product & Pricing from V3 Schema
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    console.error('Procurement Failure: Product Resolution Error', productError)
    throw new Error('Could not resolve clinical product details.')
  }

  // 3. Instantiate Order Header
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: user.id,
      status: 'pending',
      total_amount: product.base_price
    }])
    .select()
    .single()

  if (orderError) {
    console.error('Procurement Failure: Order Header Error', orderError)
    throw new Error('Failed to instantiate order header in V3 core.')
  }

  // 4. Instantiate Order Item
  const { error: itemError } = await supabase
    .from('order_items')
    .insert([{
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      unit_price: product.base_price
    }])

  if (itemError) {
    console.error('Procurement Failure: Order Item Error', itemError)
    throw new Error('Failed to link product to order record.')
  }

  // 5. Cache Invalidation
  revalidatePath('/portal/shop')
  
  return { 
    success: true, 
    orderId: order.id,
    message: `Procurement request for ${product.name} has been logged for fulfillment.`
  }
}
