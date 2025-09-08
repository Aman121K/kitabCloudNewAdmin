import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const AdvertisementManagement = () => {
  const navigate = useNavigate()
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Advertisement Title',
      width: 200,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const typeColors = {
          'banner': 'primary',
          'popup': 'secondary',
          'sidebar': 'info',
          'inline': 'success'
        }
        return (
          <Chip 
            label={params.value || 'N/A'} 
            color={typeColors[params.value] || 'default'} 
            size="small" 
          />
        )
      }
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 120,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 120,
      renderCell: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString()
        }
        return 'N/A'
      }
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 120,
      renderCell: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString()
        }
        return 'N/A'
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ]

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.ADVERTISEMENTS || '/api/advertisements')
      setAdvertisements(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching advertisements:', error)
      toast.error('Failed to fetch advertisements')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/advertisements/add')
  }

  const handleEdit = (advertisement) => {
    navigate(`/advertisements/edit/${advertisement.id}`)
  }

  const handleDelete = async (advertisement) => {
    try {
      await api.delete(`/api/advertisements/${advertisement.id}`)
      await fetchAdvertisements()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (advertisementId, newStatus) => {
    try {
      await api.post(`/api/advertisements/${advertisementId}/status`, { status: newStatus })
      await fetchAdvertisements()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating advertisement status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Advertisement Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage advertisements in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Advertisement
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={advertisements}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Advertisement"
        />
      </Paper>
    </Box>
  )
}

export default AdvertisementManagement
