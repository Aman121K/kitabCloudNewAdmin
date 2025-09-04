import React from 'react'
import { Box, Container, Paper } from '@mui/material'

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  )
}

export default AuthLayout
