import ProductCard from '../components/ProductCard.jsx'

export default function Collection({
  products,
  categories,
  activeCategory,
  onChangeCategory,
  onOpenProduct,
  isAdmin = false,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  searchQuery = '',
  onClearSearch,
  catalogError = '',
}) {
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter((product) => product.category === activeCategory)

  return (
    <main className="collection-page">
      <div className="collection-hero">
        <p className="eyebrow">KOVA</p>
        <h1>Colección</h1>
        <p>{searchQuery ? `Resultados para “${searchQuery}”` : 'Elegí una categoría o mirá todo lo disponible.'}</p>
      </div>

      <section className="catalog-section">
        <div className="collection-toolbar">
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

          <div className="collection-toolbar__actions">
            {searchQuery && <button className="text-link" onClick={onClearSearch}>Limpiar búsqueda</button>}
            {isAdmin && <button className="admin-new-button" onClick={onCreateProduct}>+ Nuevo producto</button>}
          </div>
        </div>

        {catalogError ? (
          <p className="catalog-status catalog-status--error">No se pudo cargar el catálogo: {catalogError}</p>
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
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
          <p className="catalog-status">No hay productos en esta sección todavía.</p>
        )}
      </section>
    </main>
  )
}
