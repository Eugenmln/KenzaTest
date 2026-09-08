export default function SiteHeader({ cartCount, user, onGoHome, onOpenCollection, onOpenCart, onOpenMenu, onOpenAuth, onOpenAccount }) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={onGoHome} aria-label="Ir al inicio">KOVA</button>

      <div className="header-actions">
        <a
          className="header-icon header-instagram"
          href={import.meta.env.VITE_INSTAGRAM_URL || '#'}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          IG
        </a>
        <button className="header-icon" onClick={() => onOpenCollection('Todos')} aria-label="Ver colección">⌕</button>
        <button className="header-icon account-icon" onClick={user ? onOpenAccount : onOpenAuth} aria-label={user ? 'Abrir mi cuenta' : 'Iniciar sesión'}>
          {user ? '●' : '○'}
        </button>
        <button className="header-icon cart-icon" onClick={onOpenCart} aria-label="Abrir carrito">
          ♡<span>{cartCount}</span>
        </button>
        <button className="burger-button" onClick={onOpenMenu} aria-label="Abrir menú">
          <span /><span />
        </button>
      </div>
    </header>
  )
}
