import { useMemo, useState } from 'react'
import ProductVisual from './ProductVisual.jsx'

export default function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState(product?.sizes?.[0] || '')
  const [color, setColor] = useState(product?.colors?.[0] || '')
  const [qty, setQty] = useState(1)
  const canAdd = product?.available !== false && size && color

  const priceLabel = useMemo(() => `$${Number(product?.price || 0).toLocaleString('es-AR')}`, [product])

  if (!product) return null

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="product-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="product-modal__media">
          <ProductVisual product={product} />
        </div>
        <div className="product-modal__content">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
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
            Agregar al pedido
          </button>
          <p className="modal-note">La compra se confirma por WhatsApp. No se realiza ningún pago dentro de esta web.</p>
        </div>
      </section>
    </div>
  )
}
