import { useAuth } from '../context/AuthContext.jsx'

export default function AccountDrawer({ open, onClose }) {
  const { user, signOut } = useAuth()

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
              <strong>{user.user_metadata?.full_name || 'Cliente KOVA'}</strong>
            </div>
            <div className="account-card">
              <span className="account-card__label">Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-section">
              <h3>Tu cuenta</h3>
              <p>Los favoritos, el carrito sincronizado y el historial de pedidos se vinculan a este usuario.</p>
            </div>

            <button className="secondary-button" onClick={handleSignOut}>Cerrar sesión</button>
          </div>
        )}
      </aside>
    </>
  )
}
