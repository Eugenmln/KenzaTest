import { useEffect, useState } from 'react'

const HOME_CATEGORIES = [
  { name: 'Remeras', image: '/images/category-remeras.svg' },
  { name: 'Buzos', image: '/images/category-buzos.svg' },
  { name: 'Jeans', image: '/images/category-jeans.svg' },
  { name: 'Accesorios', image: '/images/category-accesorios.svg' },
]

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

function formatPrice(value) {
  return `$${Number(value || 0).toLocaleString('es-AR')}`
}

function getProductImage(product) {
  return product?.imageUrls?.[0] || product?.images?.[0]?.asset?.url || ''
}

export default function Home({
  products = [],
  onOpenProduct,
  onOpenCollection,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct,
}) {
  const width = useWindowWidth()
  const isMobile = width < 700
  const isTablet = width >= 700 && width < 1050
  const gutter = isMobile ? 18 : isTablet ? 32 : 58

  const featured = products.filter((product) => product.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)

  const styles = {
    page: {
      width: '100%',
      margin: 0,
      background: '#fbf9f5',
      color: '#111',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    hero: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '40% 60%',
      minHeight: isMobile ? 'auto' : 370,
      overflow: 'hidden',
      borderBottom: '1px solid #e6e0d9',
    },
    heroCopy: {
      minWidth: 0,
      padding: isMobile ? '48px 20px' : `42px 40px 42px ${gutter}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: '#fbf9f5',
    },
    eyebrow: {
      margin: '0 0 14px',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
    },
    heroTitle: {
      margin: 0,
      maxWidth: 530,
      fontSize: isMobile ? 44 : isTablet ? 50 : 58,
      lineHeight: 0.98,
      letterSpacing: '-0.055em',
      fontWeight: 700,
    },
    heroDescription: {
      margin: '18px 0 22px',
      maxWidth: 470,
      color: '#706a64',
      fontSize: 14,
      lineHeight: 1.55,
    },
    heroButton: {
      border: 0,
      borderRadius: 999,
      background: '#111',
      color: '#fff',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
    },
    heroImage: {
      width: '100%',
      height: isMobile ? 300 : 370,
      display: 'block',
      objectFit: 'cover',
      objectPosition: 'center',
      background: '#ddd0c2',
    },
    categories: {
      width: '100%',
      padding: isMobile ? '12px 18px 0' : `14px ${gutter}px 0`,
      display: 'grid',
      gridTemplateColumns: isMobile
        ? '1fr'
        : isTablet
          ? 'repeat(2, minmax(0, 1fr))'
          : 'repeat(4, minmax(0, 1fr))',
      gap: 14,
    },
    categoryButton: {
      width: '100%',
      minWidth: 0,
      height: 78,
      padding: 0,
      border: 0,
      background: '#efebe5',
      display: 'grid',
      gridTemplateColumns: '108px 1fr auto',
      alignItems: 'center',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'left',
    },
    categoryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    categoryName: {
      paddingLeft: 18,
      fontSize: 13,
      fontWeight: 700,
    },
    categoryArrow: {
      paddingRight: 18,
      fontSize: 18,
    },
    productsSection: {
      padding: isMobile ? '38px 18px 48px' : `34px ${gutter}px 52px`,
    },
    productsHeading: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 22,
    },
    productsTitle: {
      margin: 0,
      fontSize: isMobile ? 32 : 38,
      lineHeight: 1,
      letterSpacing: '-0.045em',
      fontWeight: 700,
    },
    viewAllButton: {
      border: 0,
      borderBottom: '1px solid #111',
      background: 'transparent',
      padding: '0 0 4px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? 'repeat(2, minmax(0, 1fr))'
        : isTablet
          ? 'repeat(3, minmax(0, 1fr))'
          : 'repeat(4, minmax(0, 1fr))',
      gap: isMobile ? '26px 12px' : '34px 20px',
    },
    card: {
      minWidth: 0,
      cursor: 'pointer',
    },
    cardMedia: {
      position: 'relative',
      width: '100%',
      aspectRatio: isMobile ? '1 / 1.12' : '1.45 / 1',
      overflow: 'hidden',
      background: '#eee8e1',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    fallbackProduct: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(145deg, #302d2a, #171513)',
      color: 'rgba(255,255,255,.22)',
      fontSize: 32,
      fontWeight: 700,
    },
    badges: {
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      gap: 6,
      zIndex: 2,
    },
    badgeNew: {
      padding: '5px 9px',
      borderRadius: 999,
      background: '#b55b38',
      color: '#fff',
      fontSize: 8,
      fontWeight: 700,
    },
    adminActions: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 10,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 7,
      zIndex: 3,
    },
    adminEdit: {
      border: 0,
      background: 'rgba(255,255,255,.95)',
      padding: 8,
      cursor: 'pointer',
      fontSize: 11,
      fontWeight: 700,
    },
    adminDelete: {
      border: 0,
      background: '#111',
      color: '#fff',
      padding: 8,
      cursor: 'pointer',
      fontSize: 11,
      fontWeight: 700,
    },
    cardInfo: {
      marginTop: 10,
    },
    cardName: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.25,
      fontWeight: 700,
    },
    cardPrice: {
      display: 'block',
      marginTop: 4,
      fontSize: 13,
    },
    empty: {
      margin: 0,
      color: '#706a64',
      fontSize: 14,
    },
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroCopy}>
          <p style={styles.eyebrow}>NUEVA COLECCIÓN</p>

          <h1 style={styles.heroTitle}>
            Prendas simples.
            <br />
            Buen corte.
            <br />
            Todos los días.
          </h1>

          <p style={styles.heroDescription}>
            Una selección urbana y fácil de combinar.
            <br />
            Elegí lo que te gusta y terminá tu compra por WhatsApp.
          </p>

          <button
            type="button"
            style={styles.heroButton}
            onClick={() => onOpenCollection('Todos')}
          >
            Ver colección <span>→</span>
          </button>
        </div>

        <img
          src="/images/kova-hero.svg"
          alt="Colección KOVA"
          style={styles.heroImage}
        />
      </section>

      <nav style={styles.categories} aria-label="Categorías principales">
        {HOME_CATEGORIES.map((category) => (
          <button
            key={category.name}
            type="button"
            style={styles.categoryButton}
            onClick={() => onOpenCollection(category.name)}
          >
            <img src={category.image} alt="" style={styles.categoryImage} />
            <span style={styles.categoryName}>{category.name}</span>
            <span style={styles.categoryArrow}>→</span>
          </button>
        ))}
      </nav>

      <section style={styles.productsSection}>
        <div style={styles.productsHeading}>
          <div>
            <p style={styles.eyebrow}>DESTACADOS</p>
            <h2 style={styles.productsTitle}>Lo nuevo</h2>
          </div>

          <button
            type="button"
            style={styles.viewAllButton}
            onClick={() => onOpenCollection('Todos')}
          >
            Ver todo&nbsp; →
          </button>
        </div>

        {homeProducts.length > 0 ? (
          <div style={styles.productGrid}>
            {homeProducts.map((product) => {
              const image = getProductImage(product)

              return (
                <article key={product._id} style={styles.card}>
                  <div
                    style={styles.cardMedia}
                    onClick={() => onOpenProduct(product)}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        style={styles.cardImage}
                      />
                    ) : (
                      <div style={styles.fallbackProduct}>KOVA</div>
                    )}

                    {product.isNew && (
                      <div style={styles.badges}>
                        <span style={styles.badgeNew}>NUEVO</span>
                      </div>
                    )}

                    {isAdmin && (
                      <div style={styles.adminActions}>
                        <button
                          type="button"
                          style={styles.adminEdit}
                          onClick={(event) => {
                            event.stopPropagation()
                            onEditProduct(product)
                          }}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          style={styles.adminDelete}
                          onClick={(event) => {
                            event.stopPropagation()
                            onDeleteProduct(product)
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    style={styles.cardInfo}
                    onClick={() => onOpenProduct(product)}
                  >
                    <h3 style={styles.cardName}>{product.name}</h3>
                    <span style={styles.cardPrice}>{formatPrice(product.price)}</span>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p style={styles.empty}>Todavía no hay productos destacados.</p>
        )}
      </section>
    </main>
  )
}
