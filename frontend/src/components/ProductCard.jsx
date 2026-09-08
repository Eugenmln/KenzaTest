import ProductVisual from './ProductVisual.jsx'

export default function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card" onClick={() => onOpen(product)}>
      <div className="product-card__media">
        <ProductVisual product={product} />
        <div className="product-card__badges">
          {product.isNew && <span>NEW</span>}
          {!product.available && <span>AGOTADO</span>}
        </div>
      </div>
      <div className="product-card__body">
        <div>
          <p className="product-card__category">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <strong>${Number(product.price || 0).toLocaleString('es-AR')}</strong>
      </div>
      <p className="product-card__desc">{product.shortDescription}</p>
    </article>
  )
}
