import { useEffect, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard.jsx'
import ProductModal from './components/ProductModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { client, sanityConfigured } from './lib/sanity.js'
import { demoProducts } from './data/demoProducts.js'

const productQuery = `*[_type == "product" && visible != false] | order(featured desc, _createdAt desc){
  _id, name, slug, category, price, shortDescription, description, colors, sizes, featured, isNew, available,
  "images": images[]{"asset": asset->{url}}
}`

function pageFromPath() {
  return window.location.pathname.startsWith('/coleccion') ? 'collection' : 'home'
}

export default function App() {
  const [products, setProducts] = useState(demoProducts)
  const [page, setPage] = useState(pageFromPath)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(true)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kenza-cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('kenza-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!sanityConfigured) return
    client.fetch(productQuery)
      .then((data) => { if (data?.length) setProducts(data) })
      .catch(() => setProducts(demoProducts))
  }, [])

  const categories = useMemo(
    () => ['Todos', ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  )

  const filtered = activeCategory === 'Todos'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  function navigate(nextPage, category = 'Todos') {
    const path = nextPage === 'collection' ? '/coleccion' : '/'
    window.history.pushState({}, '', path)
    setPage(nextPage)
    setActiveCategory(category)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addToCart(product, options) {
    const key = `${product._id}-${options.size}-${options.color}`
    setCart((current) => {
      const found = current.find((item) => item.key === key)
      if (found) {
        return current.map((item) => item.key === key ? { ...item, qty: item.qty + options.qty } : item)
      }
      return [...current, { key, name: product.name, price: Number(product.price), ...options }]
    })
    setCartOpen(true)
  }

  function openCategory(category) {
    navigate('collection', category)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="wordmark" onClick={() => navigate('home')} aria-label="Ir al inicio">KENZA</button>

        <div className="header-actions">
          <a className="header-icon header-instagram" href={import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
          <button className="header-icon" onClick={() => navigate('collection')} aria-label="Ver colección">⌕</button>
          <button className="header-icon cart-icon" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
            ♡<span>{cartCount}</span>
          </button>
          <button className="burger-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <span /><span />
          </button>
        </div>
      </header>

      {page === 'home' ? (
        <main>
          <section className="hero hero--editorial">
            <div className="hero__copy">
              <p className="eyebrow">NUEVA COLECCIÓN</p>
              <h1>Ropa que<br/>te acompaña.</h1>
              <p className="hero__lead">Urbana, simple y fácil de usar. Prendas elegidas para combinar sin pensarlo demasiado.</p>
              <button className="hero-link" onClick={() => navigate('collection')}>VER COLECCIÓN <span>↗</span></button>
            </div>
            <div className="hero__campaign" aria-label="Campaña Kenza">
              <div className="campaign-frame">
                <div className="campaign-silhouette" aria-hidden="true">
                  <span className="campaign-head" />
                  <span className="campaign-body" />
                </div>
                <div className="campaign-caption">
                  <span>KENZA / 26</span>
                  <span>NEW DROP</span>
                </div>
              </div>
            </div>
          </section>

          <section className="featured-section">
            <div className="featured-heading">
              <p className="eyebrow">SELECCIÓN</p>
              <h2>Destacados</h2>
              <button className="text-link" onClick={() => navigate('collection')}>Ver todo ↗</button>
            </div>
            <div className="product-grid product-grid--featured">
              {homeProducts.map((product) => <ProductCard key={product._id} product={product} onOpen={setSelected} />)}
            </div>
          </section>

          <section className="editorial-band">
            <div className="editorial-band__photo" aria-hidden="true">
              <div className="fabric-lines" />
              <span>KENZA</span>
            </div>
            <div className="editorial-band__copy">
              <p className="eyebrow">COLECCIÓN</p>
              <h2>Prendas para<br/>todos los días.</h2>
              <p>Remeras, camisas, jeans, buzos y más. Elegí tu talle y color; el pedido se termina por WhatsApp.</p>
              <button className="light-link" onClick={() => navigate('collection')}>EXPLORAR COLECCIÓN ↗</button>
            </div>
          </section>
        </main>
      ) : (
        <main className="collection-page">
          <div className="collection-hero">
            <p className="eyebrow">KENZA</p>
            <h1>Colección</h1>
            <p>Elegí una categoría o mirá todo lo disponible.</p>
          </div>

          <section className="catalog-section">
            <div className="category-tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? 'category-tab category-tab--active' : 'category-tab'}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'Todos' ? 'Ver todo' : category}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filtered.map((product) => <ProductCard key={product._id} product={product} onOpen={setSelected} />)}
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <button className="footer-wordmark" onClick={() => navigate('home')}>KENZA</button>
        <div className="footer-links">
          <a href={import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'} target="_blank" rel="noreferrer">Instagram ↗</a>
          <button onClick={() => setMenuOpen(true)}>Contacto</button>
        </div>
        <small>© 2026 KENZA</small>
      </footer>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={menuOpen ? 'menu-drawer menu-drawer--open' : 'menu-drawer'} aria-hidden={!menuOpen}>
        <div className="menu-drawer__top">
          <span className="menu-logo">KENZA</span>
          <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
        </div>

        <nav className="menu-nav">
          <button className="menu-main-link menu-collection" onClick={() => setCollectionOpen((open) => !open)}>
            <span>COLECCIÓN</span><span>{collectionOpen ? '−' : '+'}</span>
          </button>
          {collectionOpen && (
            <div className="menu-categories">
              {categories.map((category) => (
                <button key={category} onClick={() => openCategory(category)}>
                  {category === 'Todos' ? 'Ver todo' : category}
                </button>
              ))}
            </div>
          )}
          <button className="menu-main-link" onClick={() => navigate('home')}>DESTACADOS</button>
          <a className="menu-main-link" href={import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'} target="_blank" rel="noreferrer">INSTAGRAM</a>
          <a className="menu-main-link" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5493760000000'}`} target="_blank" rel="noreferrer">CONTACTO</a>
        </nav>

        <div className="menu-drawer__bottom">
          <span>Catálogo online</span>
          <span>Compra por WhatsApp</span>
        </div>
      </aside>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onRemove={(key) => setCart((items) => items.filter((item) => item.key !== key))} onClear={() => setCart([])} />
    </div>
  )
}
