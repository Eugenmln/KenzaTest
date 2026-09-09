import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  getAdminProducts,
  updateAdminProduct,
} from '../services/adminCatalog.js'

const emptyForm = {
  id: null,
  name: '',
  slug: '',
  price: '',
  shortDescription: '',
  description: '',
  categoryId: '',
  imageUrl: '',
  size: 'M',
  color: 'Negro',
  stock: 0,
  featured: false,
  isNew: true,
  visible: true,
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminCatalog({ open, onClose }) {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editing = Boolean(form.id)
  const title = useMemo(() => editing ? 'Editar producto' : 'Nuevo producto', [editing])

  async function reload() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        getAdminProducts(token),
        getAdminCategories(token),
      ])
      setProducts(nextProducts || [])
      setCategories(nextCategories || [])
      if (!form.categoryId && nextCategories?.length) {
        setForm((current) => ({ ...current, categoryId: nextCategories[0].id }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, token])

  if (!open) return null

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function startCreate() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || '' })
    setError('')
  }

  function startEdit(product) {
    const firstVariant = product.variants?.[0]
    setForm({
      id: product.id,
      name: product.name || '',
      slug: product.slug || '',
      price: product.price ?? '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      categoryId: product.categoryId || '',
      imageUrl: product.imageUrls?.[0] || '',
      size: firstVariant?.size || 'M',
      color: firstVariant?.color || 'Negro',
      stock: firstVariant?.stock ?? 0,
      featured: Boolean(product.featured),
      isNew: Boolean(product.isNew),
      visible: product.available !== false,
    })
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      price: Number(form.price),
      shortDescription: form.shortDescription.trim() || null,
      description: form.description.trim() || null,
      categoryId: form.categoryId,
      imageUrls: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      variants: [{
        size: form.size.trim(),
        color: form.color.trim(),
        stock: Number(form.stock),
        active: true,
      }],
      featured: form.featured,
      isNew: form.isNew,
      visible: form.visible,
    }

    try {
      if (editing) await updateAdminProduct(token, form.id, payload)
      else await createAdminProduct(token, payload)
      await reload()
      startCreate()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar ${product.name}?`)) return
    setError('')
    try {
      await deleteAdminProduct(token, product.id)
      await reload()
      if (form.id === product.id) startCreate()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-backdrop">
      <section className="admin-panel">
        <header className="admin-panel__header">
          <div>
            <p className="eyebrow">ADMINISTRACIÓN</p>
            <h2>Catálogo KOVA</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        {error && <p className="auth-feedback auth-feedback--error">{error}</p>}

        <div className="admin-layout">
          <div className="admin-products">
            <div className="admin-section-title">
              <h3>Productos</h3>
              <button className="secondary-button" onClick={startCreate}>Nuevo</button>
            </div>

            {loading ? <p>Cargando catálogo…</p> : (
              <div className="admin-product-list">
                {products.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category} · ${Number(product.price).toLocaleString('es-AR')}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button onClick={() => startEdit(product)}>Editar</button>
                      <button onClick={() => handleDelete(product)}>Eliminar</button>
                    </div>
                  </article>
                ))}
                {!products.length && <p>No hay productos cargados.</p>}
              </div>
            )}
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{title}</h3>

            <label>Nombre
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            </label>
            <label>Slug
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="se genera desde el nombre" />
            </label>
            <label>Precio
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
            </label>
            <label>Categoría
              <select value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)} required>
                <option value="">Seleccionar</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>Descripción corta
              <input value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} />
            </label>
            <label>Descripción
              <textarea rows="4" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </label>
            <label>URL de imagen
              <input value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} />
            </label>

            <div className="admin-form-grid">
              <label>Talle
                <input value={form.size} onChange={(e) => updateField('size', e.target.value)} required />
              </label>
              <label>Color
                <input value={form.color} onChange={(e) => updateField('color', e.target.value)} required />
              </label>
              <label>Stock
                <input type="number" min="0" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} required />
              </label>
            </div>

            <div className="admin-checks">
              <label><input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} /> Destacado</label>
              <label><input type="checkbox" checked={form.isNew} onChange={(e) => updateField('isNew', e.target.checked)} /> Nuevo</label>
              <label><input type="checkbox" checked={form.visible} onChange={(e) => updateField('visible', e.target.checked)} /> Visible</label>
            </div>

            <button className="primary-button" type="submit" disabled={saving || !categories.length}>
              {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
