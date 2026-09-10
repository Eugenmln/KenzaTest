import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createAdminProduct, getAdminCategories, updateAdminProduct, uploadAdminImage } from '../services/adminCatalog.js'

const emptyForm = {
  name: '', price: '', categoryId: '', shortDescription: '', imageUrl: '',
  size: 'M', color: 'Negro', stock: 0, featured: false, isNew: true, visible: true,
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminProductModal({ open, product, onClose, onSaved }) {
  const { token } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !token) return
    setError('')
    setImageFile(null)
    getAdminCategories(token).then((data) => {
      const visible = (data || []).filter((item) => item.visible !== false)
      setCategories(visible)
      const variant = product?.variants?.[0]
      const imageUrl = product?.imageUrls?.[0] || ''
      setPreview(imageUrl)
      setForm(product ? {
        name: product.name || '',
        price: product.price ?? '',
        categoryId: product.categoryId || visible[0]?.id || '',
        shortDescription: product.shortDescription || '',
        imageUrl,
        size: variant?.size || 'M',
        color: variant?.color || 'Negro',
        stock: variant?.stock ?? 0,
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        visible: product.visible !== false,
      } : { ...emptyForm, categoryId: visible[0]?.id || '' })
    }).catch((err) => setError(err.message))
  }, [open, product, token])

  if (!open) return null

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  function chooseImage(file) {
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      let imageUrl = form.imageUrl
      if (imageFile) imageUrl = await uploadAdminImage(token, imageFile)

      const payload = {
        name: form.name.trim(),
        slug: product?.slug || slugify(form.name),
        price: Number(form.price),
        shortDescription: form.shortDescription.trim() || null,
        description: null,
        categoryId: form.categoryId,
        imageUrls: imageUrl ? [imageUrl] : [],
        variants: [{ size: form.size.trim(), color: form.color.trim(), stock: Number(form.stock), active: true }],
        featured: form.featured,
        isNew: form.isNew,
        visible: form.visible,
      }

      if (product) await updateAdminProduct(token, product.id, payload)
      else await createAdminProduct(token, payload)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-edit-backdrop" onMouseDown={onClose}>
      <form className="admin-edit-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="admin-edit-header">
          <div><p className="eyebrow">ADMIN</p><h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2></div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <p className="auth-feedback auth-feedback--error">{error}</p>}

        <div className="admin-compact-layout">
          <div className="admin-image-field">
            <div className="admin-image-preview">
              {preview ? <img src={preview} alt="Vista previa" /> : <span>Sin imagen</span>}
            </div>
            <label className="admin-file-button">
              {preview ? 'Cambiar imagen' : 'Subir imagen'}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => chooseImage(e.target.files?.[0])} />
            </label>
            <small>JPG, PNG o WebP · máx. 5 MB</small>
          </div>

          <div className="admin-edit-grid">
            <label className="admin-field-span-2">Nombre<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
            <label>Precio<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
            <label>Categoría<select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} required>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} required /></label>
            <label>Talle<input value={form.size} onChange={(e) => set('size', e.target.value)} required /></label>
            <label>Color<input value={form.color} onChange={(e) => set('color', e.target.value)} required /></label>
            <label className="admin-field-span-2">Descripción corta<input value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} /></label>
          </div>
        </div>

        <div className="admin-edit-footer">
          <div className="admin-edit-checks">
            <label><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Destacado</label>
            <label><input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} /> Nuevo</label>
            <label><input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} /> Visible</label>
          </div>
          <div className="admin-edit-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
