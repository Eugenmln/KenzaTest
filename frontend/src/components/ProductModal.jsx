import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { loadFavoriteIds, setFavorite } from '../services/customerData.js'
import ProductVisual from './ProductVisual.jsx'

export default function ProductModal({ product, onClose, onAdd }) {
  const { user } = useAuth()
  const [size, setSize] = useState(product?.sizes?.[0] || '')
  const [color, setColor] = useState(product?.colors?.[0] || '')
  const [qty, setQty] = useState(1)
  const [favorite, setFavoriteState] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const canAdd = product?.available !== false && size && color

  const priceLabel = useMemo(() => `$${Number(product?.price || 0).toLocaleString('es-AR')}`, [product])

  useEffect(() => {
    setSize(product?.sizes?.[0] || '')
    setColor(product?.colors?.[0] || '')
    setQty(1)
  }, [product])

  useEffect(() => {
    if (!user || !product) {
      setFavoriteState(false)
      return
    }

    loadFavoriteIds(user.id)
      .then((ids) => setFavoriteState(ids.includes(product._id)))
      .catch(() => setFavoriteState(false))
  }, [user, product])

  if (!product) return null

  async function handleFavorite() {
    if (!user || favoriteLoading) return
    const next = !favorite
    setFavoriteLoading(true)
    try {
      await setFavorite(user.id, product._id, next)
      setFavoriteState(next)
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="product-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="product-modal__media">
          <ProductVisual product={product} />
        </div>
        <div className="product-modal__content">
          <p className="eyebrow">{product.category}</p>
          <div className="product-modal__title-row">
            <h2>{product.name}</h2>
            {user && (
              <button className={favorite ? 'favorite-button favorite-button--active' : 'favorite-button'} onClick={handleFavorite} disabled={favoriteLoading} aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                {favorite ? '♥' : '♡'}
              </button>
            )}
          </div>
          <div className="modal-price">{priceLabel}</div>
          <p className="modal-description">{product.description || product.shortDescription}</p>

          <div className="selector-group">
            <label>Color</label>
            <div className="chips">
              {(product.colors || []).map((item) => (
                <button key={item} className={color === item ? 'chip chip--active' : 'chip'} onClick={() => setColor(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <label>Talle</label>
            <div className="chips">
              {(product.sizes || []).map((item) => (
                <button key={item} className={size === item ? 'chip chip--active' : 'chip'} onClick={() => setSize(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="quantity-row">
            <label>Cantidad</label>
            <div className="quantity-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <button className="primary-button" disabled={!canAdd} onClick={() => { onAdd(product, { size, color, qty }); onClose() }}>
            Agregar al carrito
          </button>
          <p className="modal-note">El pedido se registra en tu cuenta si iniciás sesión y la compra se coordina por WhatsApp.</p>
        </div>
      </section>
    </div>
  )
}
