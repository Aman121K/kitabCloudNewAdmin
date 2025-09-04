import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse
} from '@mui/material'
import {
  Dashboard,
  People,
  Category,
  PersonAdd,
  Book,
  VideoLibrary,
  Tag,
  Language,
  Notifications,
  Settings,
  ExpandLess,
  ExpandMore,
  AccountBox,
  Business,
  MenuBook
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openSections, setOpenSections] = useState({})

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path))
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard'
    },
    {
      title: 'User Management',
      icon: <People />,
      children: [
        { title: 'All Users', path: '/users' },
        { title: 'Add User', path: '/users/add' }
      ]
    },
    {
      title: 'Content Management',
      icon: <MenuBook />,
      children: [
        { title: 'Categories', path: '/categories' },
        { title: 'Sub Categories', path: '/subcategories' },
        { title: 'Books', path: '/books' },
        { title: 'Videos', path: '/videos' },
        { title: 'Tags', path: '/tags' }
      ]
    },
    {
      title: 'Author Management',
      icon: <PersonAdd />,
      children: [
        { title: 'All Authors', path: '/authors' },
        { title: 'Add Author', path: '/authors/add' }
      ]
    },
    {
      title: 'Reader Management',
      icon: <AccountBox />,
      children: [
        { title: 'All Readers', path: '/readers' },
        { title: 'Add Reader', path: '/readers/add' }
      ]
    },
    {
      title: 'Publisher Management',
      icon: <Business />,
      children: [
        { title: 'All Publishers', path: '/publishers' },
        { title: 'Add Publisher', path: '/publishers/add' }
      ]
    },
    {
      title: 'System',
      icon: <Settings />,
      children: [
        { title: 'Languages', path: '/languages' },
        { title: 'Notifications', path: '/notifications' },
        { title: 'Podcasts', path: '/podcasts' },
        { title: 'Roles & Permissions', path: '/roles' }
      ]
    }
  ]

  const renderMenuItem = (item, index) => {
    if (item.children) {
      const sectionKey = item.title.toLowerCase().replace(/\s+/g, '-')
      const isOpen = openSections[sectionKey]
      const childPaths = item.children.map(child => child.path)
      const isParentHighlighted = isParentActive(childPaths)

      return (
        <React.Fragment key={index}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => toggleSection(sectionKey)}
              sx={{
                color: isParentHighlighted ? '#3b82f6' : 'inherit',
                bgcolor: isParentHighlighted ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: isParentHighlighted ? '#3b82f6' : 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child, childIndex) => (
                <ListItem key={childIndex} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(child.path)}
                    sx={{
                      pl: 4,
                      color: isActive(child.path) ? '#3b82f6' : 'inherit',
                      bgcolor: isActive(child.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={child.title}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      )
    } else {
      return (
        <ListItem key={index} disablePadding>
          <ListItemButton
            onClick={() => navigate(item.path)}
            sx={{
              color: isActive(item.path) ? '#3b82f6' : 'inherit',
              bgcolor: isActive(item.path) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? '#3b82f6' : 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      )
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
          KitabCloud
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Admin Panel
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar



