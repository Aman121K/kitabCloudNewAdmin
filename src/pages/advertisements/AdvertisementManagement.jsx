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

const AdvertisementManagement = () => {
  const navigate = useNavigate()
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/advertisements')
      setAdvertisements(response.data.data || [])
    } catch (error) {
      console.error('Error fetching advertisements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/admin/advertisements/${id}/status`, {
        status: currentStatus === 1 ? 0 : 1
      })
      fetchAdvertisements()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await axios.delete(`/api/admin/advertisements/${id}`)
        fetchAdvertisements()
      } catch (error) {
        console.error('Error deleting advertisement:', error)
      }
    }
  }

  const filteredAdvertisements = advertisements.filter(ad =>
    ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Card>
        <CardHeader
          title="Advertisement Management"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/advertisements/add')}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Add Advertisement
            </Button>
          }
        />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search advertisements..."
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
                <TableCell>Link</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredAdvertisements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>No advertisements found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdvertisements.map((ad, index) => (
                  <TableRow key={ad.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{ad.title}</TableCell>
                    <TableCell>{ad.description}</TableCell>
                    <TableCell>
                      {ad.image && (
                        <img
                          src={ad.image}
                          alt="Advertisement"
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{ad.link}</TableCell>
                    <TableCell>{ad.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={ad.status === 1 ? 'Active' : 'Inactive'}
                        color={ad.status === 1 ? 'success' : 'default'}
                        onClick={() => handleStatusToggle(ad.id, ad.status)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/advertisements/edit/${ad.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(ad.id)}
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

export default AdvertisementManagement