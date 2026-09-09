import { useEffect, useState } from 'react'

const HOME_CATEGORIES = ['Remeras', 'Buzos', 'Jeans', 'Accesorios']

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
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [heroSrc, setHeroSrc] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch('/images/kova-model-hero-data.txt')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el hero')
        return response.text()
      })
      .then((base64) => {
        if (!cancelled) {
          setHeroSrc(`data:image/jpeg;base64,${base64.trim()}`)
        }
      })
      .catch(() => {
        if (!cancelled) setHeroSrc('')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isMobile = width < 720
  const isTablet = width >= 720 && width < 1100
  const gutter = isMobile ? 18 : isTablet ? 32 : 58

  const featured = products.filter((product) => product.featured).slice(0, 4)
  const homeProducts = featured.length ? featured : products.slice(0, 4)

  const styles = {
    page: {
      width: '100%',
      margin: 0,
      background: '#050505',
      color: '#f7f4ef',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    hero: {
      width: '100%',
      minHeight: isMobile ? 'auto' : 560,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '48% 52%',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,.12)',
      background: '#050505',
    },
    heroCopy: {
      minWidth: 0,
      padding: isMobile ? '58px 20px 52px' : `64px 44px 64px ${gutter}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: '#050505',
    },
    eyebrow: {
      margin: '0 0 22px',
      fontSize: isMobile ? 11 : 13,
      fontWeight: 700,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: '#f7f4ef',
    },
    heroTitle: {
      margin: 0,
      maxWidth: 760,
      fontSize: isMobile ? 54 : isTablet ? 72 : 86,
      lineHeight: 0.92,
      letterSpacing: '-0.055em',
      fontWeight: 800,
      textTransform: 'uppercase',
      color: '#ffffff',
    },
    heroDescription: {
      margin: '28px 0 30px',
      maxWidth: 560,
      fontSize: isMobile ? 16 : 20,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#d7d2cc',
    },
    heroButton: {
      border: '1px solid #b85d3b',
      borderRadius: 999,
      background: '#b85d3b',
      color: '#ffffff',
      padding: isMobile ? '14px 22px' : '16px 26px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: isMobile ? 14 : 16,
      fontWeight: 700,
      cursor: 'pointer',
    },
    heroVisual: {
      width: '100%',
      minWidth: 0,
      minHeight: isMobile ? 340 : 560,
      position: 'relative',
      overflow: 'hidden',
      background: '#111',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      inset: 0,
      display: 'block',
      objectFit: 'cover',
      objectPosition: isMobile ? '58% center' : 'center center',
      filter: 'contrast(1.03) saturate(.95)',
    },
    categories: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: 0,
      padding: isMobile ? '8px 18px 20px' : `18px ${gutter}px 26px`,
      background: '#050505',
    },
    categoryButtonBase: {
      minHeight: isMobile ? 74 : 104,
      padding: isMobile ? '0 6px' : '0 18px',
      border: 0,
      borderBottom: '1px solid rgba(255,255,255,.28)',
      background: 'transparent',
      color: '#f7f4ef',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 180ms ease',
      fontSize: isMobile ? 19 : 24,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
    },
    productsSection: {
      padding: isMobile ? '42px 18px 54px' : `48px ${gutter}px 70px`,
      background: '#050505',
    },
    productsHeading: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      marginBottom: isMobile ? 26 : 34,
    },
    productsTitle: {
      margin: 0,
      fontSize: isMobile ? 38 : 54,
      lineHeight: 1,
      letterSpacing: '-0.04em',
      fontWeight: 800,
      color: '#ffffff',
    },
    viewAllButton: {
      border: 0,
      borderBottom: '1px solid #b85d3b',
      background: 'transparent',
      color: '#b85d3b',
      padding: '0 0 5px',
      fontSize: isMobile ? 13 : 15,
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
      gap: isMobile ? '28px 12px' : '34px 20px',
    },
    card: {
      minWidth: 0,
      cursor: 'pointer',
      color: '#f7f4ef',
    },
    cardMedia: {
      position: 'relative',
      width: '100%',
      aspectRatio: isMobile ? '1 / 1.12' : '1.08 / 1',
      overflow: 'hidden',
      background: '#151515',
      border: '1px solid rgba(255,255,255,.08)',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 220ms ease',
    },
    fallbackProduct: {
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(145deg, #191919, #090909)',
      color: 'rgba(255,255,255,.18)',
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: '0.08em',
    },
    badges: {
      position: 'absolute',
      top: 12,
      left: 12,
      display: 'flex',
      gap: 6,
      zIndex: 2,
    },
    badgeNew: {
      padding: '6px 10px',
      borderRadius: 999,
      background: '#b85d3b',
      color: '#ffffff',
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: '0.06em',
    },
    adminActions: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      zIndex: 3,
    },
    adminEdit: {
      border: 0,
      background: '#f7f4ef',
      color: '#111',
      padding: 10,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 800,
    },
    adminDelete: {
      border: 0,
      background: '#b85d3b',
      color: '#fff',
      padding: 10,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 800,
    },
    cardInfo: {
      marginTop: 12,
    },
    cardName: {
      margin: 0,
      fontSize: isMobile ? 16 : 19,
      lineHeight: 1.25,
      fontWeight: 700,
      color: '#ffffff',
    },
    cardPrice: {
      display: 'block',
      marginTop: 6,
      fontSize: isMobile ? 14 : 17,
      color: '#d7d2cc',
    },
    empty: {
      margin: 0,
      color: '#aaa49d',
      fontSize: 16,
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
            Gran actitud.
          </h1>

          <p style={styles.heroDescription}>Estilo urbano, todos los días.</p>

          <button
            type="button"
            style={styles.heroButton}
            onClick={() => onOpenCollection('Todos')}
          >
            Ver colección
          </button>
        </div>

        <div style={styles.heroVisual}>
          {heroSrc && (
            <img
              src={heroSrc}
              alt="Modelo KOVA con look urbano"
              style={styles.heroImage}
            />
          )}
        </div>
      </section>

      <nav style={styles.categories} aria-label="Categorías principales">
        {HOME_CATEGORIES.map((category) => {
          const active = hoveredCategory === category
          return (
            <button
              key={category}
              type="button"
              style={{
                ...styles.categoryButtonBase,
                background: active ? '#121212' : 'transparent',
                color: active ? '#b85d3b' : '#f7f4ef',
                borderBottomColor: active ? '#b85d3b' : 'rgba(255,255,255,.28)',
              }}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onFocus={() => setHoveredCategory(category)}
              onBlur={() => setHoveredCategory(null)}
              onClick={() => onOpenCollection(category)}
            >
              {category}
            </button>
          )
        })}
      </nav>

      <section style={styles.productsSection}>
        <div style={styles.productsHeading}>
          <div>
            <p style={{ ...styles.eyebrow, marginBottom: 12 }}>DESTACADOS</p>
            <h2 style={styles.productsTitle}>Lo nuevo</h2>
          </div>

          <button
            type="button"
            style={styles.viewAllButton}
            onClick={() => onOpenCollection('Todos')}
          >
            Ver todo
          </button>
        </div>

        {homeProducts.length > 0 ? (
          <div style={styles.productGrid}>
            {homeProducts.map((product) => {
              const image = getProductImage(product)
              const active = hoveredProduct === product._id

              return (
                <article
                  key={product._id}
                  style={styles.card}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div
                    style={styles.cardMedia}
                    onClick={() => onOpenProduct(product)}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        style={{
                          ...styles.cardImage,
                          transform: active ? 'scale(1.035)' : 'scale(1)',
                        }}
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
