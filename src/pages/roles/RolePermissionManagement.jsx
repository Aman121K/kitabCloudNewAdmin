import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Chip,
  Alert
} from '@mui/material'
import { Save, Security, Person, Business, MenuBook } from '@mui/icons-material'
import axios from 'axios'
import { toast } from 'react-toastify'

const RolePermissionManagement = () => {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const permissionGroups = [
    {
      name: 'User Management',
      icon: <Person />,
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
    },
    {
      name: 'Content Management',
      icon: <MenuBook />,
      permissions: ['books.view', 'books.create', 'books.edit', 'books.delete', 'categories.manage', 'authors.manage']
    },
    {
      name: 'Publisher Management',
      icon: <Business />,
      permissions: ['publishers.view', 'publishers.create', 'publishers.edit', 'publishers.delete']
    },
    {
      name: 'System Administration',
      icon: <Security />,
      permissions: ['roles.manage', 'settings.manage', 'reports.view', 'analytics.view']
    }
  ]

  useEffect(() => {
    fetchRolesAndPermissions()
  }, [])

  const fetchRolesAndPermissions = async () => {
    setLoading(true)
    try {
      const [rolesResponse, permissionsResponse, rolePermissionsResponse] = await Promise.all([
        axios.get('/api/roles'),
        axios.get('/api/permissions'),
        axios.get('/api/role-permissions')
      ])

      setRoles(rolesResponse.data)
      setPermissions(permissionsResponse.data)
      setRolePermissions(rolePermissionsResponse.data)
    } catch (error) {
      console.error('Error fetching roles and permissions:', error)
      toast.error('Failed to fetch roles and permissions')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = (roleId, permission, checked) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permission]: checked
      }
    }))
  }

  const handleSelectAll = (roleId, permissionList, checked) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        ...permissionList.reduce((acc, permission) => ({
          ...acc,
          [permission]: checked
        }), {})
      }
    }))
  }

  const savePermissions = async () => {
    setSaving(true)
    try {
      await axios.post('/api/role-permissions', rolePermissions)
      toast.success('Permissions updated successfully')
    } catch (error) {
      console.error('Error saving permissions:', error)
      toast.error('Failed to save permissions')
    } finally {
      setSaving(false)
    }
  }

  const getRoleIcon = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return <Security color="error" />
      case 'author':
        return <Person color="primary" />
      case 'publisher':
        return <Business color="secondary" />
      default:
        return <Person color="default" />
    }
  }

  const getRoleColor = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'error'
      case 'author':
        return 'primary'
      case 'publisher':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        Loading...
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Role & Permission Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user roles and assign permissions for different functionalities
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Configure permissions for each role. Changes will affect all users assigned to these roles.
      </Alert>

      {/* Roles Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Roles
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {roles.map(role => (
            <Chip
              key={role.id}
              icon={getRoleIcon(role.name)}
              label={`${role.name} (${role.users_count || 0} users)`}
              color={getRoleColor(role.name)}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      {/* Permission Matrix */}
      {permissionGroups.map(group => (
        <Paper key={group.name} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {group.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {group.name}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {roles.map(role => (
              <Grid item xs={12} md={6} lg={3} key={role.id}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={getRoleIcon(role.name)}
                    title={role.name}
                    subheader={`${role.users_count || 0} users`}
                    action={
                      <Button
                        size="small"
                        onClick={() => {
                          const allChecked = group.permissions.every(
                            permission => rolePermissions[role.id]?.[permission]
                          )
                          handleSelectAll(role.id, group.permissions, !allChecked)
                        }}
                      >
                        {group.permissions.every(permission => rolePermissions[role.id]?.[permission])
                          ? 'Deselect All'
                          : 'Select All'
                        }
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent>
                    {group.permissions.map(permission => (
                      <FormControlLabel
                        key={permission}
                        control={
                          <Checkbox
                            checked={rolePermissions[role.id]?.[permission] || false}
                            onChange={(e) => handlePermissionChange(role.id, permission, e.target.checked)}
                          />
                        }
                        label={permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        sx={{ display: 'block', mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={savePermissions}
          disabled={saving}
          sx={{ px: 4, py: 1.5 }}
        >
          {saving ? 'Saving...' : 'Save Permissions'}
        </Button>
      </Box>

      {/* Permission Reference */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Permission Reference
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
              View Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow users to view and read data
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
              Create Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow users to create new records
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1 }}>
              Edit Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow users to modify existing records
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="error.main" sx={{ mb: 1 }}>
              Delete Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Allow users to permanently remove records
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default RolePermissionManagement
