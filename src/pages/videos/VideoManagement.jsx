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

const VideoManagement = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Video Title',
      width: 200,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 120,
    },
    {
      field: 'video_url',
      headerName: 'URL',
      width: 250,
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
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/videos')
      setVideos(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/videos/add')
  }

  const handleEdit = (video) => {
    navigate(`/videos/edit/${video.id}`)
  }

  const handleDelete = async (video) => {
    try {
      await axios.delete(`/api/videos/${video.id}`)
      await fetchVideos()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting video:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (videoId, newStatus) => {
    try {
      await axios.post(`/api/videos/${videoId}/status`, { status: newStatus })
      await fetchVideos()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating video status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Video Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all videos in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Video
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={videos}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Video"
        />
      </Paper>
    </Box>
  )
}

export default VideoManagement