import axios from 'axios'

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://api-new.kitabcloud.se/api',
  // BASE_URL: 'http://localhost:3002/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Export the configured axios instance
export default apiClient

// Export individual HTTP methods for convenience
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  patch: (url, data, config) => apiClient.patch(url, data, config)
}

// Export API endpoints for consistency
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  GET_USER: '/get_user',
  
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  
  // Users
  USERS: '/admin/users',
  COUNTRIES: '/admin/countries',
  
  // Categories
  CATEGORIES: '/admin/categories',
  
  // Subcategories
  SUBCATEGORIES: '/admin/sub-categories',
  
  // Authors
  AUTHORS: '/admin/authors',
  
  // Readers
  READERS: '/admin/readers',
  
  // Publishers
  PUBLISHERS: '/admin/publishers',
  
  // Languages
  LANGUAGES: '/admin/languages',
  
  // Books
  BOOKS: '/admin/books',
  
  // Coming Soon Books
  COMING_SOON_BOOKS: '/admin/coming-soon-books',
  
  // Videos
  VIDEOS: '/admin/videos',
  
  // Tags
  TAGS: '/admin/tags',
  
  // Advertisements
  ADVERTISEMENTS: '/admin/advertisements',
  
  // Notifications
  NOTIFICATIONS: '/admin/notifications',
  
  // Podcasts
  PODCASTS: '/admin/podcasts',
  
  // Roles & Permissions
  ROLES: '/admin/roles',
  PERMISSIONS: '/admin/permissions',
  ROLE_PERMISSIONS: '/admin/role-permissions',
  
  // Feedback
  FEEDBACK: '/admin/feedback'
}

// Helper function to build status update endpoint
export const buildStatusEndpoint = (baseEndpoint, id) => `${baseEndpoint}/${id}/status`

// Helper function to build edit endpoint
export const buildEditEndpoint = (baseEndpoint, id) => `${baseEndpoint}/${id}`

// Helper function to build paginated endpoint
export const buildPaginatedEndpoint = (baseEndpoint, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  return `${baseEndpoint}?${params.toString()}`
}

// Helper function to build search endpoint with pagination
export const buildSearchEndpoint = (baseEndpoint, searchTerm = '', page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  
  if (searchTerm) {
    params.append('search', searchTerm)
  }
  
  return `${baseEndpoint}?${params.toString()}`
}
