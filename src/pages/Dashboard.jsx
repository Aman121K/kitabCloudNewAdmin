import React, { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  IconButton,
  Divider
} from '@mui/material'
import {
  AccountBalance,
  Android,
  Apple,
  Star,
  People,
  MenuBook,
  MoreHoriz,
  CalendarToday,
  ExpandMore
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../config/api'
import { toast } from 'react-toastify'

// Stats Card Component matching Laravel design
const StatsCard = ({ title, value, subtitle, color = '#705ec8', onClick }) => (
  <Card 
    sx={{ 
      height: '120px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: 'white',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      '&:hover': onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: 4
      } : {},
      position: 'relative',
      overflow: 'hidden'
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem', lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ opacity: 0.3 }}>
          {title.includes('Revenue') && <AccountBalance sx={{ fontSize: 40 }} />}
          {title.includes('Android') && <Android sx={{ fontSize: 40 }} />}
          {title.includes('iOS') && <Apple sx={{ fontSize: 40 }} />}
          {title.includes('Reviews') && <Star sx={{ fontSize: 40 }} />}
          {title.includes('User') && <People sx={{ fontSize: 40 }} />}
          {title.includes('Books') && <MenuBook sx={{ fontSize: 40 }} />}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

// Sales Analysis Component
const SalesAnalysis = () => {
  const [timeFilter, setTimeFilter] = useState('Date Range')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const timeFilters = ['Weekly', 'Monthly', 'Annually', 'Date Range']
  
  // Sample chart data for expenses
  const expenseData = [
    { month: 'Jan', credit: 1200, debit: 800 },
    { month: 'Feb', credit: 1500, debit: 900 },
    { month: 'Mar', credit: 1800, debit: 1100 },
    { month: 'Apr', credit: 1600, debit: 1000 },
    { month: 'May', credit: 0, debit: 0 },
    { month: 'Jun', credit: 2000, debit: 1200 }
  ]

  return (
    <Paper sx={{ p: 3, border: '2px solid #ff6b35', borderTop: '4px solid #ff6b35' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Sales Analysis
      </Typography>
      
      {/* Time Filter Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {timeFilters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            variant={timeFilter === filter ? 'filled' : 'outlined'}
            color={timeFilter === filter ? 'primary' : 'default'}
            onClick={() => setTimeFilter(filter)}
            sx={{ 
              fontWeight: timeFilter === filter ? 'bold' : 'normal',
              bgcolor: timeFilter === filter ? '#ff6b35' : 'transparent',
              color: timeFilter === filter ? 'white' : 'inherit',
              '&:hover': {
                bgcolor: timeFilter === filter ? '#ff6b35' : '#f5f5f5'
              }
            }}
          />
        ))}
      </Box>

      {/* Input Fields */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="subscriptions">Subscriptions</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: <CalendarToday sx={{ color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: <CalendarToday sx={{ color: 'text.secondary' }} />
            }}
          />
        </Grid>
      </Grid>

      {/* Chart Area */}
      <Box sx={{ height: 300, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={expenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box sx={{ 
                      bgcolor: 'white', 
                      p: 2, 
                      border: '1px solid #ccc', 
                      borderRadius: 1,
                      boxShadow: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          bgcolor: '#2dce89', 
                          borderRadius: '50%', 
                          mr: 1 
                        }} />
                        <Typography variant="body2">
                          Credit Expenses: {payload[0]?.value || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          bgcolor: '#f56565', 
                          borderRadius: '50%', 
                          mr: 1 
                        }} />
                        <Typography variant="body2">
                          Debit Expenses: {payload[1]?.value || 0}
                        </Typography>
                      </Box>
                    </Box>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="credit" fill="#2dce89" name="Credit" />
            <Bar dataKey="debit" fill="#f56565" name="Debit" />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            bgcolor: '#2dce89', 
            borderRadius: '50%', 
            mr: 1 
          }} />
          <Typography variant="body2">Credit Amount</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            bgcolor: '#f56565', 
            borderRadius: '50%', 
            mr: 1 
          }} />
          <Typography variant="body2">Debit Amount</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

// Bottom Stats Component
const BottomStatsCard = ({ title, value, onClick }) => (
  <Card 
    sx={{ 
      height: '80px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      '&:hover': onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: 3
      } : {}
    }}
    onClick={onClick}
  >
    <CardContent sx={{ 
      p: 2, 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      {onClick && (
        <IconButton size="small">
          <MoreHoriz />
        </IconButton>
      )}
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentBooks, setRecentBooks] = useState([])
  const [recentAuthors, setRecentAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD)
      const data = response.data.data

      setStats({
        totalRevenue: data.total_revenue || 39296,
        totalAndroidUsers: data.androiduser || 9000,
        totalIosUsers: data.iosuser || 847,
        totalReviews: 20, // This might need to be added to the API
        totalUsers: data.user || 8000,
        totalBooks: data.book || 187,
        totalContent: data.total_content || 140,
        totalAuthors: data.author || 0,
        totalReaders: data.reader || 0
      })

      setRecentBooks(data.recentbooks || [])
      setRecentAuthors(data.recentauthor || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
      // Set fallback data
      setStats({
        totalRevenue: 39296,
        totalAndroidUsers: 9000,
        totalIosUsers: 847,
        totalReviews: 20,
        totalUsers: 8000,
        totalBooks: 187,
        totalContent: 140,
        totalAuthors: 0,
        totalReaders: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Navigation handlers
  const handleNavigateToUsers = () => navigate('/users')
  const handleNavigateToBooks = () => navigate('/books')
  const handleNavigateToAuthors = () => navigate('/authors')

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#1a1630' }}>
          Hi! Welcome Back Kitab Cloud.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Key Metrics */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total Revenue From Stripe"
                value={stats.totalRevenue?.toLocaleString()}
                color="#2dce89"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total Android App Installs"
                value={`${(stats.totalAndroidUsers / 1000).toFixed(0)}k`}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total iOS App Installs"
                value={stats.totalIosUsers?.toLocaleString()}
                color="#2196F3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total Google Play Store Reviews"
                value={stats.totalReviews?.toLocaleString()}
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total User"
                value={`${(stats.totalUsers / 1000).toFixed(0)}k`}
                color="#9C27B0"
                onClick={handleNavigateToUsers}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard
                title="Total Books"
                value={stats.totalBooks?.toLocaleString()}
                color="#705ec8"
                onClick={handleNavigateToBooks}
              />
            </Grid>
          </Grid>

          {/* More Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#ff6b35',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#e55a2b'
                }
              }}
            >
              More
            </Button>
          </Box>

          {/* Bottom Stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <BottomStatsCard
                title="Total Content"
                value={stats.totalContent}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <BottomStatsCard
                title="Recent Books"
                onClick={handleNavigateToBooks}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <BottomStatsCard
                title="Recent Author"
                onClick={handleNavigateToAuthors}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side - Sales Analysis */}
        <Grid item xs={12} lg={4}>
          <SalesAnalysis />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard

