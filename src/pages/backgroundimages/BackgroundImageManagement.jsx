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

const BackgroundImageManagement = () => {
  const navigate = useNavigate()
  const [backgroundImages, setBackgroundImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBackgroundImages()
  }, [])

  const fetchBackgroundImages = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/admin/background-images')
      setBackgroundImages(response.data.data || [])
    } catch (error) {
      console.error('Error fetching background images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`/admin/background-images/${id}/status`, {
        status: currentStatus === 1 ? 0 : 1
      })
      fetchBackgroundImages()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this background image?')) {
      try {
        await axios.delete(`/admin/background-images/${id}`)
        fetchBackgroundImages()
      } catch (error) {
        console.error('Error deleting background image:', error)
      }
    }
  }

  const filteredBackgroundImages = backgroundImages.filter(bg =>
    bg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Card>
        <CardHeader
          title="Background Image Management"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/background-images/add')}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Add Background Image
            </Button>
          }
        />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search background images..."
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
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredBackgroundImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography>No background images found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBackgroundImages.map((bg, index) => (
                  <TableRow key={bg.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{bg.title}</TableCell>
                    <TableCell>{bg.description}</TableCell>
                    <TableCell>
                      {bg.image && (
                        <img
                          src={bg.image}
                          alt="Background"
                          style={{ width: 100, height: 60, objectFit: 'cover' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bg.status === 1 ? 'Active' : 'Inactive'}
                        color={bg.status === 1 ? 'success' : 'default'}
                        onClick={() => handleStatusToggle(bg.id, bg.status)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/background-images/edit/${bg.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(bg.id)}
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

export default BackgroundImageManagement
