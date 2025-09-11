import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const AuthorManagement = () => {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Author Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'biography',
      headerName: 'Biography',
      width: 300,
      renderCell: (params) => (
        params.value ? params.value.substring(0, 100) + (params.value.length > 100 ? '...' : '') : 'N/A'
      )
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
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.AUTHORS)
      setAuthors(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching authors:', error)
      toast.error('Failed to fetch authors')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/authors/add')
  }

  const handleEdit = (author) => {
    navigate(`/authors/edit/${author.id}`)
  }

  const handleDelete = async (author) => {
    try {
      await api.delete(`/admin/authors/${author.id}`)
      await fetchAuthors()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting author:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (authorId, newStatus) => {
    try {
      await api.post(`/admin/authors/${authorId}/status`, { status: newStatus })
      await fetchAuthors()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating author status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Author Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all authors in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Author
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={authors}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Author"
        />
      </Paper>
    </Box>
  )
}

export default AuthorManagement
