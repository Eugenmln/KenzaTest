import { useEffect, useMemo, useRef, useState } from 'react'
import AccountDrawer from './components/AccountDrawer.jsx'
import AuthModal from './components/AuthModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import MenuDrawer from './components/MenuDrawer.jsx'
import ProductModal from './components/ProductModal.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { demoProducts } from './data/demoProducts.js'
import { client, sanityConfigured } from './lib/sanity.js'
import Collection from './pages/Collection.jsx'
import Home from './pages/Home.jsx'
import { loadRemoteCart, replaceRemoteCart } from './services/customerData.js'

const CART_STORAGE_KEY = 'kova-cart'

const productQuery = `*[_type == "product" && visible != false] | order(featured desc, _createdAt desc){
  _id, name, slug, category, price, shortDescription, description, colors, sizes, featured, isNew, available,
  "images": images[]{"asset": asset->{url}}
}`

const pageFromPath = () => window.location.pathname.startsWith('/coleccion') ? 'collection' : 'home'

export default function App() {
  const { user } = useAuth()
  const [products, setProducts] = useState(demoProducts)
  const [page, setPage] = useState(pageFromPath)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const remoteCartReady = useRef(false)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    remoteCartReady.current = false
    if (!user) return

    loadRemoteCart(user.id)
      .then((remoteItems) => {
        if (remoteItems.length) setCart(remoteItems)
        remoteCartReady.current = true
      })
      .catch(() => {
        remoteCartReady.current = true
      })
  }, [user])

  useEffect(() => {
    if (!user || !remoteCartReady.current) return
    const timeout = window.setTimeout(() => {
      replaceRemoteCart(user.id, cart).catch(() => {})
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [cart, user])

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!sanityConfigured) return

    client.fetch(productQuery)
      .then((data) => {
        if (data?.length) setProducts(data)
      })
      .catch(() => setProducts(demoProducts))
  }, [])

  const categories = useMemo(
    () => ['Todos', ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  )

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
      const existing = current.find((item) => item.key === key)

      if (existing) {
        return current.map((item) => (
          item.key === key ? { ...item, qty: item.qty + options.qty } : item
        ))
      }

      return [...current, {
        key,
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        ...options,
      }]
    })

    setCartOpen(true)
  }

  const openHome = () => navigate('home')
  const openCollection = (category = 'Todos') => navigate('collection', category)

  return (
    <div className="site-shell">
      <SiteHeader
        cartCount={cartCount}
        user={user}
        onGoHome={openHome}
        onOpenCollection={openCollection}
        onOpenCart={() => setCartOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {page === 'home' ? (
        <Home
          products={products}
          onOpenProduct={setSelectedProduct}
          onOpenCollection={openCollection}
        />
      ) : (
        <Collection
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onChangeCategory={setActiveCategory}
          onOpenProduct={setSelectedProduct}
        />
      )}

      <SiteFooter onGoHome={openHome} onOpenMenu={() => setMenuOpen(true)} />

      <MenuDrawer
        open={menuOpen}
        categories={categories}
        user={user}
        onClose={() => setMenuOpen(false)}
        onOpenCategory={openCollection}
        onGoHome={openHome}
        onOpenAuth={() => { setMenuOpen(false); setAuthOpen(true) }}
        onOpenAccount={() => { setMenuOpen(false); setAccountOpen(true) }}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        user={user}
        onLogin={() => { setCartOpen(false); setAuthOpen(true) }}
        onClose={() => setCartOpen(false)}
        onRemove={(key) => setCart((items) => items.filter((item) => item.key !== key))}
        onClear={() => setCart([])}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <AccountDrawer open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  )
}
