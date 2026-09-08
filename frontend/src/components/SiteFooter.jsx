export default function SiteFooter({ onGoHome, onOpenMenu }) {
  return (
    <footer className="site-footer">
      <button className="footer-wordmark" onClick={onGoHome}>KOVA</button>
      <div className="footer-links">
        <a
          href={import.meta.env.VITE_INSTAGRAM_URL || '#'}
          target="_blank"
          rel="noreferrer"
        >
          Instagram ↗
        </a>
        <button onClick={onOpenMenu}>Contacto</button>
      </div>
      <small>© 2026 KOVA</small>
    </footer>
  )
}
