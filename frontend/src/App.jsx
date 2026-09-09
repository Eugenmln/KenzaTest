import { useEffect, useRef, useState } from 'react'
import AccountDrawer from './components/AccountDrawer.jsx'
import AdminProductModal from './components/AdminProductModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import MenuDrawer from './components/MenuDrawer.jsx'
import ProductModal from './components/ProductModal.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Collection from './pages/Collection.jsx'
import Home from './pages/Home.jsx'
import { deleteAdminProduct } from './services/adminCatalog.js'
import { getCategories, getProducts } from './services/api.js'
import { loadRemoteCart, replaceRemoteCart } from './services/customerData.js'

const CART_STORAGE_KEY = 'kova-cart'
const pageFromPath = () => window.location.pathname.startsWith('/coleccion') ? 'collection' : 'home'

function mapApiProduct(product) {
  const variants = product.variants || []
  const colors = [...new Set(variants.filter((item) => item.active !== false).map((item) => item.color).filter(Boolean))]
  const sizes = [...new Set(variants.filter((item) => item.active !== false).map((item) => item.size).filter(Boolean))]

  return {
    ...product,
    _id: product.id,
    colors,
    sizes,
    images: (product.imageUrls || []).map((url) => ({ asset: { url } })),
  }
}

export default function App() {
  const { user, token } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['Todos', 'Remeras', 'Buzos', 'Jeans', 'Accesorios'])
  const [catalogError, setCatalogError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(pageFromPath)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adminProduct, setAdminProduct] = useState(undefined)
  const [adminEditorOpen, setAdminEditorOpen] = useState(false)
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

  async function reloadProducts(query = searchQuery) {
    setCatalogError('')
    try {
      const data = await getProducts({ q: query })
      setProducts((data || []).map(mapApiProduct))
    } catch (error) {
      setProducts([])
      setCatalogError(error.message || 'No se pudo cargar el catálogo.')
    }
  }

  useEffect(() => {
    reloadProducts('')
    getCategories()
      .then((data) => {
        const names = (data || []).filter((item) => item.visible !== false).map((item) => item.name)
        if (names.length) setCategories(['Todos', ...names])
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        return current.map((item) => item.key === key ? { ...item, qty: item.qty + options.qty } : item)
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

  function handleSearch(query) {
    setSearchQuery(query)
    setActiveCategory('Todos')
    navigate('collection', 'Todos')
    reloadProducts(query)
  }

  function clearSearch() {
    setSearchQuery('')
    reloadProducts('')
  }

  function openCreateProduct() {
    setAdminProduct(undefined)
    setAdminEditorOpen(true)
  }

  function openEditProduct(product) {
    setAdminProduct(product)
    setAdminEditorOpen(true)
  }

  async function handleDeleteProduct(product) {
    if (!token || !window.confirm(`¿Eliminar ${product.name}?`)) return
    try {
      await deleteAdminProduct(token, product.id)
      await reloadProducts()
    } catch (error) {
      window.alert(error.message)
    }
  }

  const openHome = () => navigate('home')
  const openCollection = (category = 'Todos') => {
    setSearchQuery('')
    reloadProducts('')
    navigate('collection', category)
  }

  return (
    <div className="site-shell">
      <SiteHeader
        page={page}
        cartCount={cartCount}
        user={user}
        onGoHome={openHome}
        onSearch={handleSearch}
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
          catalogError={catalogError}
          searchQuery={searchQuery}
          onClearSearch={clearSearch}
          isAdmin={user?.role === 'ADMIN'}
          onCreateProduct={openCreateProduct}
          onEditProduct={openEditProduct}
          onDeleteProduct={handleDeleteProduct}
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

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />

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
      <AdminProductModal
        open={adminEditorOpen && user?.role === 'ADMIN'}
        product={adminProduct}
        onClose={() => setAdminEditorOpen(false)}
        onSaved={() => reloadProducts()}
      />
    </div>
  )
}
