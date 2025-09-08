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

const ComingSoonBookManagement = () => {
  const navigate = useNavigate()
  const [comingSoonBooks, setComingSoonBooks] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Book Title',
      width: 200,
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 150,
      renderCell: (params) => params.row.author?.name || 'N/A'
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => params.row.category?.category_name || 'N/A'
    },
    {
      field: 'language',
      headerName: 'Language',
      width: 120,
      renderCell: (params) => params.row.language?.name || 'N/A'
    },
    {
      field: 'expected_release_date',
      headerName: 'Expected Release',
      width: 150,
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
    fetchComingSoonBooks()
  }, [])

  const fetchComingSoonBooks = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.COMING_SOON_BOOKS || '/api/coming-soon-books')
      setComingSoonBooks(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching coming soon books:', error)
      toast.error('Failed to fetch coming soon books')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/coming-soon/add')
  }

  const handleEdit = (book) => {
    navigate(`/coming-soon/edit/${book.id}`)
  }

  const handleDelete = async (book) => {
    try {
      await api.delete(`/api/coming-soon-books/${book.id}`)
      await fetchComingSoonBooks()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting coming soon book:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (bookId, newStatus) => {
    try {
      await api.post(`/api/coming-soon-books/${bookId}/status`, { status: newStatus })
      await fetchComingSoonBooks()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating coming soon book status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Coming Soon Book Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage upcoming books in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Coming Soon Book
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={comingSoonBooks}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Coming Soon Book"
        />
      </Paper>
    </Box>
  )
}

export default ComingSoonBookManagement
