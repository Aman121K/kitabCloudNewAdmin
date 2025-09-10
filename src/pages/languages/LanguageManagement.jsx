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

const LanguageManagement = () => {
  const navigate = useNavigate()
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Language Name',
      width: 200,
    },
    {
      field: 'code',
      headerName: 'Language Code',
      width: 120,
    },
    {
      field: 'native_name',
      headerName: 'Native Name',
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
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.LANGUAGES)
      setLanguages(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching languages:', error)
      toast.error('Failed to fetch languages')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/languages/add')
  }

  const handleEdit = (language) => {
    navigate(`/languages/edit/${language.id}`)
  }

  const handleDelete = async (language) => {
    try {
      await api.delete(`/languages/${language.id}`)
      await fetchLanguages()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting language:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (languageId, newStatus) => {
    try {
      await api.post(`/languages/${languageId}/status`, { status: newStatus })
      await fetchLanguages()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating language status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Language Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all languages in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Language
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={languages}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Language"
        />
      </Paper>
    </Box>
  )
}

export default LanguageManagement