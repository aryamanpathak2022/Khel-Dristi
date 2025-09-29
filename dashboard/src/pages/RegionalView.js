import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export default function RegionalView() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🗺️ Regional Talent Heatmap
      </Typography>
      <Alert severity="info">
        Interactive regional heatmap coming soon!
      </Alert>
    </Box>
  );
}