import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardHeader,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ComingSoonBookManagement = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/admin/coming-soon-books')
      setBooks(response.data.data || [])
    } catch (error) {
      console.error('Error fetching coming soon books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`/admin/coming-soon-books/${id}/status`, {
        status: currentStatus === 1 ? 0 : 1
      })
      fetchBooks()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/admin/coming-soon-books/${id}`)
        fetchBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
      }
    }
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Card>
        <CardHeader
          title="Coming Soon Book Management"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/coming-soon/add')}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Add Coming Soon Book
            </Button>
          }
        />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Cover Image</TableCell>
                <TableCell>Release Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No coming soon books found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book, index) => (
                  <TableRow key={book.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author_name}</TableCell>
                    <TableCell>
                      {book.cover_image && (
                        <img
                          src={book.cover_image}
                          alt="Cover"
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{book.release_date}</TableCell>
                    <TableCell>
                      <Chip
                        label={book.status === 1 ? 'Active' : 'Inactive'}
                        color={book.status === 1 ? 'success' : 'default'}
                        onClick={() => handleStatusToggle(book.id, book.status)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/coming-soon/edit/${book.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(book.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default ComingSoonBookManagement