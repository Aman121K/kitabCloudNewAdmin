import React from 'react'
import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        bgcolor: 'white',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        ml: { md: '280px' }, // Account for sidebar width
        width: { md: 'calc(100% - 280px)' }
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          textAlign: 'center',
          fontWeight: 500
        }}
      >
        All rights reserved By Kitabcloud.com
      </Typography>
    </Box>
  )
}

export default Footer
