import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const PodcastManagement = () => {
  const navigate = useNavigate()
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Podcast Name',
      width: 200,
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 150,
      renderCell: (params) => params.row.author.name || 'N/A'
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
    fetchPodcasts()
  }, [])

  const fetchPodcasts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/podcasts')
      setPodcasts(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching podcasts:', error)
      toast.error('Failed to fetch podcasts')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/podcasts/add')
  }

  const handleEdit = (podcast) => {
    navigate(`/podcasts/edit/${podcast.id}`)
  }

  const handleDelete = async (podcast) => {
    try {
      await axios.delete(`/api/podcasts/${podcast.id}`)
      await fetchPodcasts()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting podcast:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (podcastId, newStatus) => {
    try {
      await axios.post(`/api/podcasts/${podcastId}/status`, { status: newStatus })
      await fetchPodcasts()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating podcast status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Podcast Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all podcasts in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Podcast
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={podcasts}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Podcast"
        />
      </Paper>
    </Box>
  )
}

export default PodcastManagement