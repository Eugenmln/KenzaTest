const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(email, password, fullName) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  })
}

export function getProfile(token) {
  return request('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getProducts({ q = '', category = '' } = {}) {
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (category.trim()) params.set('category', category.trim())
  const query = params.toString()
  return request(`/api/products${query ? `?${query}` : ''}`)
}

export function getCategories() {
  return request('/api/categories')
}

export { API_BASE_URL }
