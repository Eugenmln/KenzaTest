import ProductCard from '../components/ProductCard.jsx'

const HOME_CATEGORIES = ['Remeras', 'Buzos', 'Jeans', 'Accesorios']

export default function Home({ products, onOpenProduct, onOpenCollection, isAdmin = false, onEditProduct, onDeleteProduct }) {
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">KOVA / NUEVA COLECCIÓN</p>
          <h1>Prendas simples.<br />Buen corte.<br />Todos los días.</h1>
          <p>Una selección urbana y fácil de combinar. Elegí lo que te gusta y terminá tu compra por WhatsApp.</p>
          <button className="home-cta" onClick={() => onOpenCollection('Todos')}>Ver colección</button>
        </div>
        <div className="home-hero__visual" aria-hidden="true">
          <div className="home-hero__shape home-hero__shape--one" />
          <div className="home-hero__shape home-hero__shape--two" />
          <span>KOVA</span>
        </div>
      </section>

      <nav className="home-categories" aria-label="Categorías principales">
        {HOME_CATEGORIES.map((category) => (
          <button key={category} onClick={() => onOpenCollection(category)}>{category}</button>
        ))}
      </nav>

      <section className="featured-section featured-section--clean">
        <div className="featured-heading">
          <div>
            <p className="eyebrow">DESTACADOS</p>
            <h2>Lo nuevo</h2>
          </div>
          <button className="text-link" onClick={() => onOpenCollection('Todos')}>Ver todo</button>
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

      <section className="home-note">
        <p>COLECCIÓN ACTUAL</p>
        <h2>Remeras, buzos, jeans y accesorios.</h2>
        <button onClick={() => onOpenCollection('Todos')}>Explorar todo ↗</button>
      </section>
    </main>
  )
}
