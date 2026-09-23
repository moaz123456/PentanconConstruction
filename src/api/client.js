import { clearSession, getToken } from '../utils/auth';

// Base URL of the API. Empty in development (Vite proxies /api and /uploads), set in .env.production.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Turns an image path returned by the API ("/uploads/projects/x.jpg") into a full URL. */
export const assetUrl = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

async function request(path, { method = 'GET', params = {}, body, auth = false } = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const url = `${API_BASE}${path}${query.toString() ? `?${query}` : ''}`;

  const headers = { Accept: 'application/json' };
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined
    });
  } catch {
    throw new ApiError('The server could not be reached.', 0);
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearSession();
      window.dispatchEvent(new Event('pentacon:unauthorized'));
    }
    let message = `Request failed (${response.status}).`;
    try {
      const problem = await response.json();
      if (problem?.title) message = problem.title;
    } catch {
      /* body was not JSON - keep the generic message */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return response.json();
}

function get(path, params = {}) {
  return request(path, { params });
}

export const api = {
  categories: () => get('/api/project-categories'),
  projects: ({ categoryId, clientId, status, search, page = 1, pageSize = 12 } = {}) =>
    get('/api/projects', { categoryId, clientId, status, search, page, pageSize }),
  project: (id) => get(`/api/projects/${id}`),
  clients: () => get('/api/clients'),
  testimonials: () => get('/api/testimonials'),

  auth: {
    login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } })
  },

  // Mutations used by the admin dashboard. `form` values may be FormData (multipart) or plain objects (JSON).
  admin: {
    createCategory: (form) => request('/api/project-categories', { method: 'POST', body: form, auth: true }),
    updateCategory: (id, form) => request(`/api/project-categories/${id}`, { method: 'PUT', body: form, auth: true }),
    deleteCategory: (id) => request(`/api/project-categories/${id}`, { method: 'DELETE', auth: true }),

    createProject: (project) => request('/api/projects', { method: 'POST', body: project, auth: true }),
    updateProject: (id, project) => request(`/api/projects/${id}`, { method: 'PUT', body: project, auth: true }),
    deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE', auth: true }),

    uploadProjectImages: (projectId, files) => {
      const form = new FormData();
      files.forEach((file) => form.append('Files', file));
      return request(`/api/projects/${projectId}/images`, { method: 'POST', body: form, auth: true });
    },
    updateProjectImage: (projectId, imageId, altText) =>
      request(`/api/projects/${projectId}/images/${imageId}`, { method: 'PUT', body: { altText }, auth: true }),
    deleteProjectImage: (projectId, imageId) =>
      request(`/api/projects/${projectId}/images/${imageId}`, { method: 'DELETE', auth: true }),
    setProjectImageCover: (projectId, imageId) =>
      request(`/api/projects/${projectId}/images/${imageId}/cover`, { method: 'PUT', auth: true }),
    reorderProjectImages: (projectId, imageIds) =>
      request(`/api/projects/${projectId}/images/reorder`, { method: 'PUT', body: { imageIds }, auth: true }),

    createClient: (form) => request('/api/clients', { method: 'POST', body: form, auth: true }),
    updateClient: (id, form) => request(`/api/clients/${id}`, { method: 'PUT', body: form, auth: true }),
    deleteClient: (id) => request(`/api/clients/${id}`, { method: 'DELETE', auth: true }),

    createTestimonial: (form) => request('/api/testimonials', { method: 'POST', body: form, auth: true }),
    updateTestimonial: (id, form) => request(`/api/testimonials/${id}`, { method: 'PUT', body: form, auth: true }),
    deleteTestimonial: (id) => request(`/api/testimonials/${id}`, { method: 'DELETE', auth: true })
  }
};
