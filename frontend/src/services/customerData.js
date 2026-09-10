import { supabase, supabaseConfigured } from '../lib/supabase.js'

export async function loadRemoteCart(userId) {
  if (!supabaseConfigured || !userId) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, product_name, price, size, color, quantity')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data || []).map((item) => ({
    key: `${item.product_id}-${item.size}-${item.color}`,
    productId: item.product_id,
    name: item.product_name,
    price: Number(item.price),
    size: item.size,
    color: item.color,
    qty: item.quantity,
  }))
}

export async function replaceRemoteCart(userId, items) {
  if (!supabaseConfigured || !userId) return

  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (deleteError) throw deleteError
  if (!items.length) return

  const rows = items.map((item) => ({
    user_id: userId,
    product_id: item.productId || item.key,
    product_name: item.name,
    price: item.price,
    size: item.size,
    color: item.color,
    quantity: item.qty,
  }))

  const { error } = await supabase.from('cart_items').insert(rows)
  if (error) throw error
}

export async function createOrder(userId, items, customer) {
  if (!supabaseConfigured || !userId || !items.length) return null

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending_whatsapp',
      total,
      customer_name: customer?.name || null,
      customer_phone: customer?.phone || null,
    })
    .select('id')
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId || null,
    product_name: item.name,
    unit_price: item.price,
    size: item.size,
    color: item.color,
    quantity: item.qty,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

export async function loadOrders(userId) {
  if (!supabaseConfigured || !userId) return []

  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total, created_at, order_items(product_name, quantity, size, color, unit_price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function loadFavoriteIds(userId) {
  if (!supabaseConfigured || !userId) return []

  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)

  if (error) throw error
  return (data || []).map((item) => item.product_id)
}

export async function setFavorite(userId, productId, favorite) {
  if (!supabaseConfigured || !userId || !productId) return

  if (favorite) {
    const { error } = await supabase
      .from('favorites')
      .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' })
    if (error) throw error
    return
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) throw error
}
