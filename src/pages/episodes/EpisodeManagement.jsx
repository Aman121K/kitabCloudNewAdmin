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

const EpisodeManagement = () => {
  const navigate = useNavigate()
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEpisodes()
  }, [])

  const fetchEpisodes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/admin/episodes')
      setEpisodes(response.data.data || [])
    } catch (error) {
      console.error('Error fetching episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await axios.patch(`/admin/episodes/${id}/status`, {
        status: currentStatus === 1 ? 0 : 1
      })
      fetchEpisodes()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      try {
        await axios.delete(`/admin/episodes/${id}`)
        fetchEpisodes()
      } catch (error) {
        console.error('Error deleting episode:', error)
      }
    }
  }

  const filteredEpisodes = episodes.filter(episode =>
    episode.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.podcast_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <Card>
        <CardHeader
          title="Episode Management"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/episodes/add')}
              sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
            >
              Add Episode
            </Button>
          }
        />
      </Card>

      <Card sx={{ mt: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search episodes..."
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
                <TableCell>Podcast</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Audio File</TableCell>
                <TableCell>Release Date</TableCell>
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
              ) : filteredEpisodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>No episodes found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEpisodes.map((episode, index) => (
                  <TableRow key={episode.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{episode.title}</TableCell>
                    <TableCell>{episode.podcast_name}</TableCell>
                    <TableCell>{episode.duration}</TableCell>
                    <TableCell>
                      {episode.audio_file && (
                        <audio controls style={{ width: 200 }}>
                          <source src={episode.audio_file} type="audio/mpeg" />
                        </audio>
                      )}
                    </TableCell>
                    <TableCell>{episode.release_date}</TableCell>
                    <TableCell>
                      <Chip
                        label={episode.status === 1 ? 'Active' : 'Inactive'}
                        color={episode.status === 1 ? 'success' : 'default'}
                        onClick={() => handleStatusToggle(episode.id, episode.status)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/episodes/edit/${episode.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(episode.id)}
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

export default EpisodeManagement
