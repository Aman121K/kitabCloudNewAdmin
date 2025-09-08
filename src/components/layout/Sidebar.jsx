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
  MenuBook,
  Apps,
  Campaign,
  Schedule
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
      title: 'Roles Management',
      icon: <Apps />,
      path: '/roles'
    },
    {
      title: 'User Management',
      icon: <Apps />,
      children: [
        { title: 'List User', path: '/users' }
      ]
    },
    {
      title: 'Category Management',
      icon: <Apps />,
      children: [
        { title: 'List Categories', path: '/categories' }
      ]
    },
    {
      title: 'Sub Category Management',
      icon: <Apps />,
      children: [
        { title: 'List Sub Categories', path: '/subcategories' }
      ]
    },
    {
      title: 'Author Management',
      icon: <Apps />,
      children: [
        { title: 'List Authors', path: '/authors' }
      ]
    },
    {
      title: 'Reader Management',
      icon: <Apps />,
      children: [
        { title: 'List Readers', path: '/readers' }
      ]
    },
    {
      title: 'Publisher Management',
      icon: <Apps />,
      children: [
        { title: 'List Publishers', path: '/publishers' }
      ]
    },
    {
      title: 'Language Management',
      icon: <Apps />,
      children: [
        { title: 'List Languages', path: '/languages' }
      ]
    },
    {
      title: 'Book Management',
      icon: <Apps />,
      children: [
        { title: 'List Books', path: '/books' }
      ]
    },
    {
      title: 'Coming Soon Book Management',
      icon: <Apps />,
      children: [
        { title: 'List Coming Soon Books', path: '/coming-soon' }
      ]
    },
    {
      title: 'Videos Management',
      icon: <Apps />,
      children: [
        { title: 'List Videos', path: '/videos' }
      ]
    },
    {
      title: 'Tag Management',
      icon: <Apps />,
      children: [
        { title: 'List Tags', path: '/tags' }
      ]
    },
    {
      title: 'Advertisement Management',
      icon: <Apps />,
      children: [
        { title: 'List Advertisements', path: '/advertisements' }
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



