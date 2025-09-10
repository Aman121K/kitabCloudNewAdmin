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

const EditVideo = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [formData, setFormData] = useState({
    book_name: '',
    url: '',
    type: '',
    category_id: '',
    sub_category_id: '',
    status: 1
  })

  useEffect(() => {
    fetchVideo()
    fetchCategories()
  }, [id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/videos/${id}`)
      const video = response.data.data
      setFormData({
        book_name: video.book_name || '',
        url: video.url || '',
        type: video.type || '',
        category_id: video.category_id || '',
        sub_category_id: video.sub_category_id || '',
        status: video.status || 1
      })
      
      // Fetch subcategories for the selected category
      if (video.category_id) {
        fetchSubCategories(video.category_id)
      }
    } catch (error) {
      console.error('Error fetching video:', error)
      setError('Failed to fetch video details')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/admin/categories')
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`/admin/subcategories?category_id=${categoryId}`)
      setSubCategories(response.data.data || [])
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // If category changes, fetch subcategories
    if (name === 'category_id') {
      setFormData(prev => ({ ...prev, sub_category_id: '' }))
      fetchSubCategories(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.put(`/admin/videos/${id}`, formData)
      setSuccess('Video updated successfully!')
      setTimeout(() => {
        navigate('/videos')
      }, 1500)
    } catch (error) {
      console.error('Error updating video:', error)
      setError('Failed to update video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader title="Edit Video" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Book Name"
                  name="book_name"
                  value={formData.book_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Video URL"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="youtube">YouTube</MenuItem>
                    <MenuItem value="vimeo">Vimeo</MenuItem>
                    <MenuItem value="direct">Direct Link</MenuItem>
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
                <FormControl fullWidth>
                  <InputLabel>Sub Category</InputLabel>
                  <Select
                    name="sub_category_id"
                    value={formData.sub_category_id}
                    onChange={handleChange}
                    label="Sub Category"
                    disabled={!formData.category_id}
                  >
                    {subCategories.map((subCategory) => (
                      <MenuItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ bgcolor: '#705ec8', '&:hover': { bgcolor: '#5a4ba8' } }}
                  >
                    {loading ? 'Updating...' : 'Update Video'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/videos')}
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

export default EditVideo
