import { API_BASE_URL } from './api.js'

async function adminRequest(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message
      ? data.message
      : typeof data === 'string' && data
        ? data
        : `Error ${response.status}`
    throw new Error(message)
  }

  return data
}

export const getAdminProducts = (token) => adminRequest('/api/admin/products', token)
export const getAdminCategories = (token) => adminRequest('/api/admin/categories', token)

export const createAdminProduct = (token, payload) => adminRequest('/api/admin/products', token, {
  method: 'POST',
  body: JSON.stringify(payload),
})

export const updateAdminProduct = (token, id, payload) => adminRequest(`/api/admin/products/${id}`, token, {
  method: 'PUT',
  body: JSON.stringify(payload),
})

export const deleteAdminProduct = (token, id) => adminRequest(`/api/admin/products/${id}`, token, {
  method: 'DELETE',
})
