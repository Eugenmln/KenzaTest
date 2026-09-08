export default function ProductVisual({ product, compact = false }) {
  const image = product?.images?.[0]

  if (image?.asset?.url) {
    return <img className="product-image" src={image.asset.url} alt={product.name} />
  }

  return (
    <div className={`product-visual product-visual--${product.demoTone || 'graphite'} ${compact ? 'product-visual--compact' : ''}`}>
      <div className="product-visual__garment" aria-hidden="true" />
      <div className="product-visual__code">{String(product.name).slice(0, 2).toUpperCase()}</div>
    </div>
  )
}
