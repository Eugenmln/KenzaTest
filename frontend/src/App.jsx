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

export default function App() {
  const [products, setProducts] = useState(demoProducts)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kenza-cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('kenza-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!sanityConfigured) return
    client.fetch(productQuery)
      .then((data) => { if (data?.length) setProducts(data) })
      .catch(() => setProducts(demoProducts))
  }, [])

  const categories = useMemo(() => ['Todos', ...new Set(products.map((p) => p.category).filter(Boolean))], [products])
  const filtered = activeCategory === 'Todos' ? products : products.filter((p) => p.category === activeCategory)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  function addToCart(product, options) {
    const key = `${product._id}-${options.size}-${options.color}`
    setCart((current) => {
      const found = current.find((item) => item.key === key)
      if (found) return current.map((item) => item.key === key ? { ...item, qty: item.qty + options.qty } : item)
      return [...current, { key, name: product.name, price: Number(product.price), ...options }]
    })
    setCartOpen(true)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top">KENZA</a>
        <nav className="desktop-nav">
          <a href="#catalogo">Colección</a>
          <a href="#marca">La marca</a>
          <a href="#local">Posadas</a>
        </nav>
        <div className="header-actions">
          <a href={import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'} target="_blank" rel="noreferrer">Instagram</a>
          <button className="cart-button" onClick={() => setCartOpen(true)}>Pedido <span>{cartCount}</span></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">POSADAS · MISIONES</p>
            <h1>Vestite simple.<br/><em>Que se note igual.</em></h1>
            <p className="hero__lead">Prendas para todos los días, con identidad propia. Elegí tus favoritos y cerrá el pedido directo por WhatsApp.</p>
            <div className="hero__actions">
              <a className="primary-button primary-button--light" href="#catalogo">Ver colección</a>
              <a className="ghost-button" href="#local">Visitar el local</a>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__poster">
              <span>247</span>
              <strong>KENZA</strong>
              <small>NEW / 26</small>
            </div>
            <div className="hero__shape hero__shape--one" />
            <div className="hero__shape hero__shape--two" />
          </div>
        </section>

        <section className="marquee" aria-label="Características">
          <span>NUEVA COLECCIÓN</span><i>•</i><span>POSADAS</span><i>•</i><span>COMPRA POR WHATSAPP</span><i>•</i><span>KENZA</span>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CATÁLOGO</p>
              <h2>Lo nuevo en Kenza</h2>
            </div>
            <p>Elegí producto, talle, color y cantidad. Nosotros armamos el mensaje para WhatsApp.</p>
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button key={category} className={activeCategory === category ? 'category-tab category-tab--active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>
            ))}
          </div>

          <div className="product-grid">
            {filtered.map((product) => <ProductCard key={product._id} product={product} onOpen={setSelected} />)}
          </div>
        </section>

        <section className="editorial" id="marca">
          <div className="editorial__panel editorial__panel--rust">
            <span className="editorial__number">01</span>
            <p className="eyebrow">IDENTIDAD</p>
            <h2>Cabeza fría.<br/>Estilo firme.</h2>
            <p>Una tienda local con una selección relajada, urbana y fácil de usar. Sin vueltas.</p>
          </div>
          <div className="editorial__panel editorial__panel--cream">
            <span className="editorial__number">02</span>
            <p className="eyebrow">CÓMO COMPRAR</p>
            <ol>
              <li><b>Elegí</b> tus prendas.</li>
              <li><b>Seleccioná</b> talle y color.</li>
              <li><b>Mandá</b> el pedido por WhatsApp.</li>
              <li><b>Coordiná</b> pago y entrega con Kenza.</li>
            </ol>
          </div>
        </section>

        <section className="local-section" id="local">
          <div>
            <p className="eyebrow">KENZA · POSADAS</p>
            <h2>Probátelo.<br/>Llevátelo.</h2>
          </div>
          <div className="local-section__info">
            <p>Catálogo online para elegir tranquilo. Atención personalizada y cierre de compra por WhatsApp.</p>
            <a className="underline-link" href={import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/kenza.posadas'} target="_blank" rel="noreferrer">@kenza.posadas ↗</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>KENZA</span>
        <small>Posadas, Misiones · Argentina</small>
        <small>© 2026</small>
      </footer>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onRemove={(key) => setCart((items) => items.filter((item) => item.key !== key))} onClear={() => setCart([])} />
    </div>
  )
}
