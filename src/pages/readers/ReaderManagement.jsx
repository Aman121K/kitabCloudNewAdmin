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

const ReaderManagement = () => {
  const navigate = useNavigate()
  const [readers, setReaders] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Reader Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'phone',
      headerName: 'Phone',
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
    }
  ]

  useEffect(() => {
    fetchReaders()
  }, [])

  const fetchReaders = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.READERS)
      setReaders(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching readers:', error)
      toast.error('Failed to fetch readers')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/readers/add')
  }

  const handleEdit = (reader) => {
    navigate(`/readers/edit/${reader.id}`)
  }

  const handleDelete = async (reader) => {
    try {
      await api.delete(`/readers/${reader.id}`)
      await fetchReaders()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting reader:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (readerId, newStatus) => {
    try {
      await api.post(`/readers/${readerId}/status`, { status: newStatus })
      await fetchReaders()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating reader status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Reader Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all readers in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Reader
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={readers}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Reader"
        />
      </Paper>
    </Box>
  )
}

export default ReaderManagement