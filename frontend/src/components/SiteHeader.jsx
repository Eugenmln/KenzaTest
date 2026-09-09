import { useState } from 'react'

export default function SiteHeader({
  page,
  cartCount,
  user,
  onGoHome,
  onSearch,
  onOpenCart,
  onOpenMenu,
  onOpenAuth,
  onOpenAccount,
  onOpenCollection,
}) {
  const [query, setQuery] = useState('')
  const [hoveredNav, setHoveredNav] = useState(null)

  function submitSearch(event) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    onSearch(value)
  }

  const styles = {
    header: {
      width: '100%',
      height: 86,
      padding: '0 58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 28,
      background: '#050505',
      color: '#f7f4ef',
      borderBottom: '1px solid rgba(255,255,255,.12)',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 50,
    },
    left: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 52,
      minWidth: 0,
    },
    wordmark: {
      border: 0,
      background: 'transparent',
      color: '#ffffff',
      padding: 0,
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: '-0.05em',
      cursor: 'pointer',
    },
    nav: {
      height: '100%',
      display: 'flex',
      alignItems: 'stretch',
      gap: 34,
    },
    navButton: {
      position: 'relative',
      border: 0,
      background: 'transparent',
      color: '#f7f4ef',
      padding: '0 2px',
      fontSize: 16,
      fontWeight: 500,
      cursor: 'pointer',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginLeft: 'auto',
    },
    search: {
      width: 320,
      height: 42,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 16px',
      borderRadius: 999,
      background: '#151515',
      border: '1px solid rgba(255,255,255,.08)',
    },
    searchIcon: {
      width: 19,
      height: 19,
      fill: 'none',
      stroke: '#bfb9b2',
      strokeWidth: 1.8,
      flexShrink: 0,
    },
    searchInput: {
      width: '100%',
      border: 0,
      outline: 0,
      background: 'transparent',
      color: '#f7f4ef',
      fontSize: 14,
    },
    iconButton: {
      width: 42,
      height: 42,
      padding: 0,
      border: 0,
      borderRadius: '50%',
      background: 'transparent',
      color: '#f7f4ef',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      position: 'relative',
    },
    icon: {
      width: 22,
      height: 22,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    cartBadge: {
      position: 'absolute',
      top: 1,
      right: 0,
      minWidth: 19,
      height: 19,
      padding: '0 5px',
      borderRadius: 999,
      background: '#b85d3b',
      color: '#ffffff',
      display: 'grid',
      placeItems: 'center',
      fontSize: 10,
      fontWeight: 800,
      lineHeight: 1,
    },
    burger: {
      width: 42,
      height: 42,
      padding: 0,
      border: 0,
      background: 'transparent',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
    },
    burgerLines: {
      width: 25,
      display: 'grid',
      gap: 6,
    },
    burgerLine: {
      display: 'block',
      width: '100%',
      height: 2,
      background: '#f7f4ef',
    },
  }

  function navStyle(name, active = false) {
    const highlighted = hoveredNav === name || active
    return {
      ...styles.navButton,
      color: highlighted ? '#ffffff' : '#d1cbc5',
      borderBottom: highlighted ? '3px solid #b85d3b' : '3px solid transparent',
    }
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button style={styles.wordmark} onClick={onGoHome} aria-label="Ir al inicio">
          KOVA
        </button>

        <nav style={styles.nav} aria-label="Navegación principal">
          <button
            style={navStyle('collection', page === 'collection')}
            onMouseEnter={() => setHoveredNav('collection')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={() => onOpenCollection?.('Todos')}
          >
            Colección
          </button>
          <button
            style={navStyle('about')}
            onMouseEnter={() => setHoveredNav('about')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={onOpenMenu}
          >
            Nosotros
          </button>
          <button
            style={navStyle('contact')}
            onMouseEnter={() => setHoveredNav('contact')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={onOpenMenu}
          >
            Contacto
          </button>
        </nav>
      </div>

      <div style={styles.actions}>
        <form style={styles.search} onSubmit={submitSearch}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            style={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
        </form>

        <button
          style={styles.iconButton}
          onClick={user ? onOpenAccount : onOpenAuth}
          aria-label={user ? 'Abrir mi cuenta' : 'Iniciar sesión'}
        >
          <svg style={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21c.8-4.2 3.3-6.3 7.5-6.3s6.7 2.1 7.5 6.3" />
          </svg>
        </button>

        <button style={styles.iconButton} onClick={onOpenCart} aria-label="Abrir carrito">
          <svg style={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 5h2l1.7 9.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H7" />
            <circle cx="10" cy="19" r="1" />
            <circle cx="17" cy="19" r="1" />
          </svg>
          <span style={styles.cartBadge}>{cartCount}</span>
        </button>

        <button style={styles.burger} onClick={onOpenMenu} aria-label="Abrir menú">
          <span style={styles.burgerLines}>
            <span style={styles.burgerLine} />
            <span style={styles.burgerLine} />
          </span>
        </button>
      </div>
    </header>
  )
}
