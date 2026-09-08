import ProductCard from '../components/ProductCard.jsx'

export default function Home({ products, onOpenProduct, onOpenCollection }) {
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)

  return (
    <main>
      <section className="hero hero--editorial">
        <div className="hero__copy">
          <p className="eyebrow">NUEVA COLECCIÓN</p>
          <h1>Ropa que<br />te acompaña.</h1>
          <p className="hero__lead">
            Urbana, simple y fácil de usar. Prendas pensadas para combinar sin esfuerzo.
          </p>
          <button className="hero-link" onClick={() => onOpenCollection('Todos')}>
            VER COLECCIÓN <span>↗</span>
          </button>
        </div>

        <div className="hero__campaign" aria-label="Campaña KOVA">
          <div className="campaign-frame">
            <div className="campaign-silhouette" aria-hidden="true">
              <span className="campaign-head" />
              <span className="campaign-body" />
            </div>
            <div className="campaign-caption">
              <span>KOVA / 26</span>
              <span>NEW DROP</span>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-heading">
          <p className="eyebrow">SELECCIÓN</p>
          <h2>Destacados</h2>
          <button className="text-link" onClick={() => onOpenCollection('Todos')}>Ver todo ↗</button>
        </div>

        <div className="product-grid product-grid--featured">
          {homeProducts.map((product) => (
            <ProductCard key={product._id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-band__photo" aria-hidden="true">
          <div className="fabric-lines" />
          <span>KOVA</span>
        </div>
        <div className="editorial-band__copy">
          <p className="eyebrow">COLECCIÓN</p>
          <h2>Prendas para<br />todos los días.</h2>
          <p>Remeras, camisas, jeans, buzos y más. Elegí talle y color, guardá tu carrito y continuá la compra por WhatsApp.</p>
          <button className="light-link" onClick={() => onOpenCollection('Todos')}>EXPLORAR COLECCIÓN ↗</button>
        </div>
      </section>
    </main>
  )
}
