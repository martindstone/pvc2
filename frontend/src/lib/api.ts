// Lightweight API client that uses VITE_API_URL when provided, otherwise falls back to '/api'
// In development, Vite proxies '/api' to the backend configured in VITE_API_URL

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const envBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
// In development, always use '/api' so requests go through the Vite proxy.
// In production, use VITE_API_URL if set; otherwise keep '/api'.
const base = import.meta.env.DEV ? '/api' : envBase || '/api'

function join(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { parseJson?: boolean } = {}
): Promise<T> {
  const url = join(base, path)
  const { headers, parseJson = true, ...rest } = options

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
  }

  if (!parseJson) {
    return res as unknown as T
  }

  // Handle empty responses
  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}

export const api = {
  get: <T = unknown>(path: string, init: RequestInit = {}) =>
    apiFetch<T>(path, { ...init, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, init: RequestInit = {}) =>
    apiFetch<T>(path, { ...init, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = unknown>(path: string, body?: unknown, init: RequestInit = {}) =>
    apiFetch<T>(path, { ...init, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = unknown>(path: string, body?: unknown, init: RequestInit = {}) =>
    apiFetch<T>(path, { ...init, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = unknown>(path: string, init: RequestInit = {}) =>
    apiFetch<T>(path, { ...init, method: 'DELETE' }),
}
