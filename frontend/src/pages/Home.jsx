import ProductCard from '../components/ProductCard.jsx'

const HOME_CATEGORIES = [
  { name: 'Remeras', code: 'RE' },
  { name: 'Buzos', code: 'BU' },
  { name: 'Jeans', code: 'JE' },
  { name: 'Accesorios', code: 'AC' },
]

export default function Home({ products, onOpenProduct, onOpenCollection, isAdmin = false, onEditProduct, onDeleteProduct }) {
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">NUEVA COLECCIÓN</p>
          <h1>Prendas simples.<br />Buen corte.<br />Todos los días.</h1>
          <p>Una selección urbana y fácil de combinar.<br />Elegí lo que te gusta y terminá tu compra por WhatsApp.</p>
          <button className="home-cta" onClick={() => onOpenCollection('Todos')}>Ver colección <span>→</span></button>
        </div>
        <div className="home-hero__visual" aria-label="Colección KOVA">
          <div className="home-rack" aria-hidden="true">
            <span className="home-garment home-garment--tee" />
            <span className="home-garment home-garment--hoodie" />
            <span className="home-garment home-garment--dark" />
            <span className="home-garment home-garment--denim" />
          </div>
          <div className="home-hero__brand">
            <strong>KOVA</strong>
            <small>VESTIR<br />LO REAL</small>
          </div>
        </div>
      </section>

      <nav className="home-categories" aria-label="Categorías principales">
        {HOME_CATEGORIES.map((category) => (
          <button key={category.name} onClick={() => onOpenCollection(category.name)}>
            <span className={`category-thumb category-thumb--${category.code.toLowerCase()}`} aria-hidden="true">{category.code}</span>
            <strong>{category.name}</strong>
            <span className="category-arrow">→</span>
          </button>
        ))}
      </nav>

      <section className="featured-section featured-section--clean">
        <div className="featured-heading">
          <div>
            <p className="eyebrow">DESTACADOS</p>
            <h2>Lo nuevo</h2>
          </div>
          <button className="text-link" onClick={() => onOpenCollection('Todos')}>Ver todo&nbsp; →</button>
        </div>

        {homeProducts.length ? (
          <div className="product-grid product-grid--featured">
            {homeProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpen={onOpenProduct}
                isAdmin={isAdmin}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <p className="catalog-empty">Todavía no hay productos destacados.</p>
        )}
      </section>
    </main>
  )
}
