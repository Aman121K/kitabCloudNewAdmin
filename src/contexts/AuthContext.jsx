import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient, { API_ENDPOINTS } from '../config/api'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set authorization header if token exists
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedToken && savedUser) {
        try {
          // Verify token is still valid
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
          const response = await apiClient.post(API_ENDPOINTS.GET_USER, { token: savedToken })
          
          if (response.data.user) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (error) {
          // Token is invalid or expired, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete apiClient.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      console.log('Attempting login with Node API:', { email, password })
      
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password
      })

      console.log('Login response:', response.data)

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data
        
        // Save to localStorage
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Update state
        setToken(newToken)
        setUser(userData)
        
        // Set apiClient header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        return { success: true }
      } else {
        console.error('Login failed:', response.data)
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Network error occurred' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear state
    setToken(null)
    setUser(null)
    
    // Remove apiClient header
    delete apiClient.defaults.headers.common['Authorization']
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext