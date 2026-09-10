import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { loadFavoriteIds, loadOrders } from '../services/customerData.js'

const statusLabel = {
  pending_whatsapp: 'Pendiente por WhatsApp',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export default function AccountDrawer({ open, onClose }) {
  const { user, signOut } = useAuth()
  const [orders, setOrders] = useState([])
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (!open || !user) return

    setLoadingData(true)
    Promise.all([loadOrders(user.id), loadFavoriteIds(user.id)])
      .then(([nextOrders, favoriteIds]) => {
        setOrders(nextOrders)
        setFavoriteCount(favoriteIds.length)
      })
      .finally(() => setLoadingData(false))
  }, [open, user])

  async function handleSignOut() {
    await signOut()
    onClose()
  }

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={open ? 'account-drawer account-drawer--open' : 'account-drawer'} aria-hidden={!open}>
        <div className="account-drawer__header">
          <div>
            <p className="eyebrow">MI CUENTA</p>
            <h2>Perfil</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {user && (
          <div className="account-drawer__content">
            <div className="account-card">
              <span className="account-card__label">Nombre</span>
              <strong>{user.fullName || 'Cliente KOVA'}</strong>
            </div>
            <div className="account-card">
              <span className="account-card__label">Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-summary-grid">
              <div className="account-summary-card"><strong>{orders.length}</strong><span>Pedidos</span></div>
              <div className="account-summary-card"><strong>{favoriteCount}</strong><span>Favoritos</span></div>
            </div>

            <div className="account-section">
              <h3>Historial de pedidos</h3>
              {loadingData ? (
                <p>Cargando actividad…</p>
              ) : orders.length === 0 ? (
                <p>Todavía no tenés pedidos guardados.</p>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <article className="order-card" key={order.id}>
                      <div className="order-card__top">
                        <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
                        <span>{statusLabel[order.status] || order.status}</span>
                      </div>
                      <p>{new Date(order.created_at).toLocaleDateString('es-AR')} · ${Number(order.total).toLocaleString('es-AR')}</p>
                      <small>{order.order_items?.map((item) => `${item.product_name} x${item.quantity}`).join(' · ')}</small>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <button className="secondary-button" onClick={handleSignOut}>Cerrar sesión</button>
          </div>
        )}
      </aside>
    </>
  )
}
