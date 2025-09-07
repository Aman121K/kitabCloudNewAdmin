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

const BookManagement = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
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
      field: 'book_type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const hasAudio = params.row.bookaudio && params.row.bookaudio !== ''
        const hasEbook = params.row.bookfile && params.row.bookfile !== ''
        
        if (hasAudio && hasEbook) {
          return <Chip label="Audio & E-book" color="primary" size="small" />
        } else if (hasAudio) {
          return <Chip label="Audio Book" color="success" size="small" />
        } else if (hasEbook) {
          return <Chip label="E-book" color="info" size="small" />
        }
        return <Chip label="No Files" color="default" size="small" />
      }
    },
    {
      field: 'ifunza_status',
      headerName: 'Ifunza Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.BOOKS)
      setBooks(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/books/add')
  }

  const handleEdit = (book) => {
    navigate(`/books/edit/${book.id}`)
  }

  const handleDelete = async (book) => {
    try {
      await api.delete(`/api/books/${book.id}`)
      await fetchBooks()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting book:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (bookId, newStatus) => {
    try {
      await api.post(`/api/books/${bookId}/status`, { status: newStatus })
      await fetchBooks()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating book status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Book Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all books in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Book
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={books}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Book"
        />
      </Paper>
    </Box>
  )
}

export default BookManagement
