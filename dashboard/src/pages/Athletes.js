import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { dashboardService } from '../services/DashboardService';

export default function Athletes() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    sport: '',
    ageGroup: ''
  });

  useEffect(() => {
    loadAthletes();
  }, [searchQuery, filters]);

  const loadAthletes = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.searchAthletes(searchQuery, filters);
      setAthletes(result.results || []);
    } catch (error) {
      console.error('Failed to load athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getSportColor = (sport) => {
    const colors = {
      'Track & Field': 'primary',
      'Swimming': 'info', 
      'Boxing': 'warning',
      'Wrestling': 'error',
      'Gymnastics': 'success'
    };
    return colors[sport] || 'default';
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        👥 Athletes Database
      </Typography>
      
      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  label="State"
                >
                  <MenuItem value="">All States</MenuItem>
                  <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  <MenuItem value="Karnataka">Karnataka</MenuItem>
                  <MenuItem value="Punjab">Punjab</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sport</InputLabel>
                <Select
                  value={filters.sport}
                  onChange={(e) => handleFilterChange('sport', e.target.value)}
                  label="Sport"
                >
                  <MenuItem value="">All Sports</MenuItem>
                  <MenuItem value="Track & Field">Track & Field</MenuItem>
                  <MenuItem value="Swimming">Swimming</MenuItem>
                  <MenuItem value="Boxing">Boxing</MenuItem>
                  <MenuItem value="Wrestling">Wrestling</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Age Group</InputLabel>
                <Select
                  value={filters.ageGroup}
                  onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  label="Age Group"
                >
                  <MenuItem value="">All Ages</MenuItem>
                  <MenuItem value="10-15">10-15 years</MenuItem>
                  <MenuItem value="16-20">16-20 years</MenuItem>
                  <MenuItem value="21-25">21-25 years</MenuItem>
                  <MenuItem value="26+">26+ years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterList />}
                onClick={loadAthletes}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Athletes Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Athletes ({athletes.length} found)
          </Typography>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Athlete</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Sport</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Best Score</TableCell>
                  <TableCell>Total Tests</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {athletes.map((athlete) => (
                  <TableRow key={athlete.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {athlete.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {athlete.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {athlete.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{athlete.age}</TableCell>
                    <TableCell>
                      <Chip 
                        label={athlete.sport} 
                        color={getSportColor(athlete.sport)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{athlete.state}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                        {athlete.bestScore.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell>{athlete.totalTests}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}