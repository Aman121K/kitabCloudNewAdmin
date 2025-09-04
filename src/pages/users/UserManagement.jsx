import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const UserManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 150,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => (
        new Date(params.value).toLocaleDateString()
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/users/add')
  }

  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`)
  }

  const handleDelete = async (user) => {
    try {
      await axios.delete(`/api/users/${user.id}`)
      await fetchUsers() // Refresh the list
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting user:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (userId, newStatus) => {
    try {
      await axios.post(`/api/users/${userId}/status`, { status: newStatus })
      await fetchUsers() // Refresh the list
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating user status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={users}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="User"
        />
      </Paper>
    </Box>
  )
}

export default UserManagement
