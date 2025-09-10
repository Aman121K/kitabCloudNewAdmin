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
  Alert
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditPublisher = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    established_date: '',
    description: '',
    website: '',
    status: 1
  })

  useEffect(() => {
    fetchPublisher()
  }, [id])

  const fetchPublisher = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/publishers/${id}`)
      const publisher = response.data.data
      setFormData({
        name: publisher.name || '',
        email: publisher.email || '',
        phone: publisher.phone || '',
        address: publisher.address || '',
        established_date: publisher.established_date || '',
        description: publisher.description || '',
        website: publisher.website || '',
        status: publisher.status || 1
      })
    } catch (error) {
      console.error('Error fetching publisher:', error)
      setError('Failed to fetch publisher details')
    } finally {
      setLoading(false)
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
      await axios.put(`/admin/publishers/${id}`, formData)
      setSuccess('Publisher updated successfully!')
      setTimeout(() => {
        navigate('/publishers')
      }, 1500)
    } catch (error) {
      console.error('Error updating publisher:', error)
      setError('Failed to update publisher')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader title="Edit Publisher" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Publisher Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Established Date"
                  name="established_date"
                  type="date"
                  value={formData.established_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
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
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                />
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
                    {loading ? 'Updating...' : 'Update Publisher'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/publishers')}
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

export default EditPublisher
