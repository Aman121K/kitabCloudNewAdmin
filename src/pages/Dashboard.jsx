import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert
} from '@mui/material'
import {
  TrendingUp,
  People,
  MenuBook,
  VideoLibrary,
  Podcasts,
  AccountBalance,
  Android,
  Apple
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../config/api'
import { toast } from 'react-toastify'

const StatsCard = ({ title, value, icon, color = 'primary', trend, onClick, clickable = false }) => (
  <Card 
    sx={{ 
      height: '100%', 
      position: 'relative', 
      overflow: 'visible',
      cursor: clickable ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      '&:hover': clickable ? {
        transform: 'translateY(-2px)',
        boxShadow: 3
      } : {}
    }}
    onClick={clickable ? onClick : undefined}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main`, mb: 1 }}>
            {value?.toLocaleString() || '0'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: `${color}.light`,
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentBooks, setRecentBooks] = useState([])
  const [recentAuthors, setRecentAuthors] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD)
      const data = response.data.data // Updated to access nested data object

      setStats({
        totalRevenue: data.subscription || 0,
        totalBooks: data.book || 0,
        totalUsers: data.user || 0,
        totalAuthors: data.author || 0,
        totalReaders: data.reader || 0,
        totalPublishers: data.publisher || 0,
        totalVideos: data.video || 0,
        totalPodcasts: data.podcast || 0,
        audioBooks: data.audiobook || 0,
        eBooks: data.ebooks || 0,
        androidUsers: data.androiduser || 0,
        iosUsers: data.iosuser || 0
      })

      setRecentBooks(data.recentbooks || [])
      setRecentAuthors(data.recentauthor || [])
      setChartData(data.chartDataJson ? JSON.parse(data.chartDataJson) : [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Navigation handlers
  const handleNavigateToUsers = () => navigate('/users')
  const handleNavigateToBooks = () => navigate('/books')
  const handleNavigateToAuthors = () => navigate('/authors')
  const handleNavigateToReaders = () => navigate('/readers')
  const handleNavigateToPublishers = () => navigate('/publishers')
  const handleNavigateToVideos = () => navigate('/videos')
  const handleNavigateToPodcasts = () => navigate('/podcasts')

  // Sample chart data if API data is not available
  const sampleChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ]

  const userDeviceData = [
    { name: 'Android', value: stats.androidUsers || 0, color: '#4CAF50' },
    { name: 'iOS', value: stats.iosUsers || 0, color: '#2196F3' }
  ]

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your KitabCloud admin panel overview
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Revenue from Stripe"
            value={stats.totalRevenue}
            icon={<AccountBalance sx={{ fontSize: 24 }} />}
            color="success"
            trend="+12% from last month"
            clickable={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<MenuBook sx={{ fontSize: 24 }} />}
            color="primary"
            clickable={true}
            onClick={handleNavigateToBooks}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People sx={{ fontSize: 24 }} />}
            color="info"
            clickable={true}
            onClick={handleNavigateToUsers}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Authors"
            value={stats.totalAuthors}
            icon={<People sx={{ fontSize: 24 }} />}
            color="warning"
            clickable={true}
            onClick={handleNavigateToAuthors}
          />
        </Grid>
      </Grid>

      {/* Second Row Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Readers"
            value={stats.totalReaders}
            icon={<People sx={{ fontSize: 24 }} />}
            color="primary"
            clickable={true}
            onClick={handleNavigateToReaders}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Publishers"
            value={stats.totalPublishers}
            icon={<People sx={{ fontSize: 24 }} />}
            color="secondary"
            clickable={true}
            onClick={handleNavigateToPublishers}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Videos"
            value={stats.totalVideos}
            icon={<VideoLibrary sx={{ fontSize: 24 }} />}
            color="error"
            clickable={true}
            onClick={handleNavigateToVideos}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Podcasts"
            value={stats.totalPodcasts}
            icon={<Podcasts sx={{ fontSize: 24 }} />}
            color="info"
            clickable={true}
            onClick={handleNavigateToPodcasts}
          />
        </Grid>
      </Grid>

      {/* Book Types and Device Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Audio Books"
            value={stats.audioBooks}
            icon={<MenuBook sx={{ fontSize: 24 }} />}
            color="success"
            clickable={true}
            onClick={handleNavigateToBooks}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="E-Books"
            value={stats.eBooks}
            icon={<MenuBook sx={{ fontSize: 24 }} />}
            color="warning"
            clickable={true}
            onClick={handleNavigateToBooks}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Android Users"
            value={stats.androidUsers}
            icon={<Android sx={{ fontSize: 24 }} />}
            color="success"
            clickable={false}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="iOS Users"
            value={stats.iosUsers}
            icon={<Apple sx={{ fontSize: 24 }} />}
            color="info"
            clickable={false}
          />
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Expense Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Expense Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.length > 0 ? chartData : sampleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  dot={{ fill: '#1976d2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Device Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              User Device Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDeviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDeviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {userDeviceData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: item.color,
                      borderRadius: 1,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">
                    {item.name}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Books */}
        <Grid item xs={12} lg={6}>
          <Paper 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
            onClick={handleNavigateToBooks}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Books
            </Typography>
            {recentBooks.length > 0 ? (
              <Box>
                {recentBooks.slice(0, 5).map((book, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <MenuBook sx={{ mr: 2, color: 'primary.main' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {book.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {book.author_name || 'Unknown Author'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(book.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Alert severity="info">No recent books found</Alert>
            )}
          </Paper>
        </Grid>

        {/* Recent Authors */}
        <Grid item xs={12} lg={6}>
          <Paper 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
            onClick={handleNavigateToAuthors}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Authors
            </Typography>
            {recentAuthors.length > 0 ? (
              <Box>
                {recentAuthors.slice(0, 5).map((author, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <People sx={{ mr: 2, color: 'secondary.main' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Author
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(author.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Alert severity="info">No recent authors found</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard

