/**
 * SafeNet Security Solutions Ltd — Centralized API Routing & Configuration
 * 
 * Supports seamless development proxying, Vercel frontend deployments,
 * and external Render Node.js/Express service endpoints without hardcoding.
 */

// Reads VITE_API_BASE_URL if configured (e.g., https://api.safenetsecurityltd.com or Render URL)
// Otherwise defaults to relative /api/* paths for local dev and reverse-proxy topologies.
const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

export const API_BASE_URL = configuredBaseUrl;

/**
 * Returns a fully-qualified or root-relative endpoint URL.
 * Preserves the contract of all existing API endpoints.
 * 
 * @example apiUrl('/api/chat') -> 'https://api.safenetsecurityltd.com/api/chat' or '/api/chat'
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return cleanPath;
  }
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Standard fetch options for authenticated endpoints across domains.
 * Ensures credentials (HttpOnly cookies) and anti-CSRF headers are included.
 */
export function createApiOptions(options: RequestInit = {}, csrfToken?: string | null): RequestInit {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (csrfToken && !headers.has('X-CSRF-Token')) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  return {
    ...options,
    credentials: options.credentials || 'include',
    headers
  };
}
