import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export default function Analytics() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📊 Advanced Analytics
      </Typography>
      <Alert severity="info">
        Advanced analytics dashboard coming soon!
      </Alert>
    </Box>
  );
}