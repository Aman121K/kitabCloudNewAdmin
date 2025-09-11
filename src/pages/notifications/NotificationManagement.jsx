import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const NotificationManagement = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    {
      field: 'target_audience',
      headerName: 'Target',
      width: 150,
    },
    {
      field: 'scheduled_at',
      headerName: 'Scheduled',
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
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.NOTIFICATIONS)
      setNotifications(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/notifications/add')
  }

  const handleEdit = (notification) => {
    navigate(`/notifications/edit/${notification.id}`)
  }

  const handleDelete = async (notification) => {
    try {
      await api.delete(`/notifications/${notification.id}`)
      await fetchNotifications()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting notification:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (notificationId, newStatus) => {
    try {
      await api.post(`/admin/notifications/${notificationId}/status`, { status: newStatus })
      await fetchNotifications()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating notification status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Notification Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all notifications in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Notification
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={notifications}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Notification"
        />
      </Paper>
    </Box>
  )
}

export default NotificationManagement