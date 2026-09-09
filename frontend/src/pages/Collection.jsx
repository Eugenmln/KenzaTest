import ProductCard from '../components/ProductCard.jsx'

export default function Collection({ products, categories, activeCategory, onChangeCategory, onOpenProduct, catalogError }) {
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((product) => product.category === activeCategory)

  return (
    <main className="collection-page">
      <div className="collection-hero">
        <p className="eyebrow">KOVA</p>
        <h1>Colección</h1>
        <p>Elegí una categoría o mirá todo lo disponible.</p>
      </div>

      <section className="catalog-section">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'category-tab category-tab--active' : 'category-tab'}
              onClick={() => onChangeCategory(category)}
            >
              {category === 'Todos' ? 'Ver todo' : category}
            </button>
          ))}
        </div>

        {catalogError ? (
          <p className="catalog-empty">No se pudo cargar el catálogo desde el backend: {catalogError}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="catalog-empty">No hay productos cargados todavía.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onOpen={onOpenProduct} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
