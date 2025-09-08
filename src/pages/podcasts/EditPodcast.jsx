import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditPodcast = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [readers, setReaders] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover_image: '',
    background_color: '',
    release_date: '',
    reader_id: '',
    category_id: '',
    status: 1
  })

  useEffect(() => {
    fetchPodcast()
    fetchReaders()
    fetchCategories()
  }, [id])

  const fetchPodcast = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/admin/podcasts/${id}`)
      const podcast = response.data.data
      setFormData({
        name: podcast.name || '',
        description: podcast.description || '',
        cover_image: podcast.cover_image || '',
        background_color: podcast.background_color || '',
        release_date: podcast.release_date || '',
        reader_id: podcast.reader_id || '',
        category_id: podcast.category_id || '',
        status: podcast.status || 1
      })
    } catch (error) {
      console.error('Error fetching podcast:', error)
      setError('Failed to fetch podcast details')
    } finally {
      setLoading(false)
    }
  }

  const fetchReaders = async () => {
    try {
      const response = await axios.get('/api/admin/readers')
      setReaders(response.data.data || [])
    } catch (error) {
      console.error('Error fetching readers:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.put(`/api/admin/podcasts/${id}`, formData)
      setSuccess('Podcast updated successfully!')
      setTimeout(() => {
        navigate('/podcasts')
      }, 1500)
    } catch (error) {
      console.error('Error updating podcast:', error)
      setError('Failed to update podcast')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader title="Edit Podcast" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Podcast Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  name="background_color"
                  type="color"
                  value={formData.background_color}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Release Date"
                  name="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Reader</InputLabel>
                  <Select
                    name="reader_id"
                    value={formData.reader_id}
                    onChange={handleChange}
                    label="Reader"
                  >
                    {readers.map((reader) => (
                      <MenuItem key={reader.id} value={reader.id}>
                        {reader.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  select
                  value={formData.status}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ bgcolor: '#705ec8', '&:hover': { bgcolor: '#5a4ba8' } }}
                  >
                    {loading ? 'Updating...' : 'Update Podcast'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/podcasts')}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EditPodcast
