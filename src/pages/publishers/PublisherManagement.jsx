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

const PublisherManagement = () => {
  const navigate = useNavigate()
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Publisher Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 200,
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
    }
  ]

  useEffect(() => {
    fetchPublishers()
  }, [])

  const fetchPublishers = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.PUBLISHERS)
      setPublishers(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching publishers:', error)
      toast.error('Failed to fetch publishers')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/publishers/add')
  }

  const handleEdit = (publisher) => {
    navigate(`/publishers/edit/${publisher.id}`)
  }

  const handleDelete = async (publisher) => {
    try {
      await api.delete(`/admin/publishers/${publisher.id}`)
      await fetchPublishers()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting publisher:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (publisherId, newStatus) => {
    try {
      await api.post(`/admin/publishers/${publisherId}/status`, { status: newStatus })
      await fetchPublishers()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating publisher status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Publisher Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all publishers in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Publisher
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={publishers}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Publisher"
        />
      </Paper>
    </Box>
  )
}

export default PublisherManagement