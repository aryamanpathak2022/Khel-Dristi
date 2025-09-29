import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export default function Assessments() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📋 Assessment Management
      </Typography>
      <Alert severity="info">
        Assessment management interface coming soon!
      </Alert>
    </Box>
  );
}