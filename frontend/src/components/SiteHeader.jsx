import { useState } from 'react'

export default function SiteHeader({ page, cartCount, user, onGoHome, onSearch, onOpenCart, onOpenMenu, onOpenAuth, onOpenAccount }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  function submitSearch(event) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    onSearch(value)
    setSearchOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-left">
        <button className="wordmark" onClick={onGoHome} aria-label="Ir al inicio">KOVA</button>
        {page === 'collection' && <button className="header-home-link" onClick={onGoHome}>Inicio</button>}
      </div>

      <div className="header-actions">
        {searchOpen && (
          <form className="header-search" onSubmit={submitSearch}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar prendas"
              aria-label="Buscar prendas"
            />
          </form>
        )}
        <button className="header-icon" onClick={() => setSearchOpen((open) => !open)} aria-label="Buscar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
        </button>
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
