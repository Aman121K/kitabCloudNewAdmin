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

const EditLanguage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 1
  })

  useEffect(() => {
    fetchLanguage()
  }, [id])

  const fetchLanguage = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/languages/${id}`)
      const language = response.data.data
      setFormData({
        name: language.name || '',
        code: language.code || '',
        status: language.status || 1
      })
    } catch (error) {
      console.error('Error fetching language:', error)
      setError('Failed to fetch language details')
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
      await axios.put(`/admin/languages/${id}`, formData)
      setSuccess('Language updated successfully!')
      setTimeout(() => {
        navigate('/languages')
      }, 1500)
    } catch (error) {
      console.error('Error updating language:', error)
      setError('Failed to update language')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader title="Edit Language" />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Language Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Language Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., en, es, fr"
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ bgcolor: '#705ec8', '&:hover': { bgcolor: '#5a4ba8' } }}
                  >
                    {loading ? 'Updating...' : 'Update Language'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/languages')}
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

export default EditLanguage
