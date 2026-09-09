import { useState } from 'react'

export default function SiteHeader({ page, cartCount, user, onGoHome, onSearch, onOpenCart, onOpenMenu, onOpenAuth, onOpenAccount, onOpenCollection }) {
  const [query, setQuery] = useState('')

  function submitSearch(event) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    onSearch(value)
  }

  return (
    <header className="site-header">
      <div className="header-left">
        <button className="wordmark" onClick={onGoHome} aria-label="Ir al inicio">KOVA</button>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <button className={page === 'collection' ? 'active' : ''} onClick={() => onOpenCollection?.('Todos')}>Colección</button>
          <button onClick={onOpenMenu}>Nosotros</button>
          <button onClick={onOpenMenu}>Contacto</button>
        </nav>
      </div>

      <div className="header-actions">
        <form className="header-search" onSubmit={submitSearch}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
        </form>
        <button className="header-icon account-icon" onClick={user ? onOpenAccount : onOpenAuth} aria-label={user ? 'Abrir mi cuenta' : 'Iniciar sesión'}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.3-6.3 7.5-6.3s6.7 2.1 7.5 6.3"/></svg>
        </button>
        <button className="header-icon cart-icon" onClick={onOpenCart} aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5h2l1.7 9.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H7"/><circle cx="10" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></svg>
          <span>{cartCount}</span>
        </button>
        <button className="burger-button" onClick={onOpenMenu} aria-label="Abrir menú"><span /><span /></button>
      </div>
    </header>
  )
}
