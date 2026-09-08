import { useState } from 'react'

export default function MenuDrawer({ open, categories, onClose, onOpenCategory, onGoHome }) {
  const [collectionOpen, setCollectionOpen] = useState(true)
  const instagram = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '5493760000000'

  return (
    <>
      {open && <div className="menu-overlay" onClick={onClose} />}

      <aside className={open ? 'menu-drawer menu-drawer--open' : 'menu-drawer'} aria-hidden={!open}>
        <div className="menu-drawer__top">
          <span className="menu-logo">KENZA</span>
          <button className="menu-close" onClick={onClose} aria-label="Cerrar menú">×</button>
        </div>

        <nav className="menu-nav">
          <button className="menu-main-link menu-collection" onClick={() => setCollectionOpen((current) => !current)}>
            <span>COLECCIÓN</span>
            <span>{collectionOpen ? '−' : '+'}</span>
          </button>

          {collectionOpen && (
            <div className="menu-categories">
              {categories.map((category) => (
                <button key={category} onClick={() => onOpenCategory(category)}>
                  {category === 'Todos' ? 'Ver todo' : category}
                </button>
              ))}
            </div>
          )}

          <button className="menu-main-link" onClick={onGoHome}>DESTACADOS</button>
          <a className="menu-main-link" href={instagram} target="_blank" rel="noreferrer">INSTAGRAM</a>
          <a className="menu-main-link" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">CONTACTO</a>
        </nav>

        <div className="menu-drawer__bottom">
          <span>Catálogo online</span>
          <span>Compra por WhatsApp</span>
        </div>
      </aside>
    </>
  )
}
