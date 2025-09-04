import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    // Quick demo setup - auto login
    const demoUser = {
      id: 1,
      full_name: 'Admin User',
      email: 'admin@kitabcloud.com',
      role: 1
    }
    
    setUser(demoUser)
    setToken('demo-token-123')
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('token', 'demo-token-123')
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // For demo - accept any credentials
      if (email === 'admin@kitabcloud.com' && password === 'admin123') {
        const demoUser = {
          id: 1,
          full_name: 'Admin User',
          email: 'admin@kitabcloud.com',
          role: 1
        }
        
        localStorage.setItem('token', 'demo-token-123')
        localStorage.setItem('user', JSON.stringify(demoUser))
        setToken('demo-token-123')
        setUser(demoUser)
        
        return { success: true }
      }
      
      return { 
        success: false, 
        message: 'Invalid credentials' 
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
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



