import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { dashboardService } from '../services/DashboardService';

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [regionalStats, setRegionalStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewData, regionalData, analyticsData] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getRegionalStats(),
        dashboardService.getAnalytics()
      ]);

      setOverview(overviewData);
      setRegionalStats(regionalData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  const StatCard = ({ title, value, subtitle, color = 'primary', icon }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" color={color} fontWeight="bold">
              {value?.toLocaleString() || '0'}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box color={`${color}.main`}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        🏠 SAI Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Real-time insights into sports talent assessment across India
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Athletes"
            value={overview?.totalAthletes}
            subtitle={`+${overview?.recentGrowth?.athletes || '0%'} this month`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assessments"
            value={overview?.totalAssessments}
            subtitle={`+${overview?.recentGrowth?.assessments || '0%'} this month`}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Today"
            value={overview?.activeToday}
            subtitle="Athletes online now"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Score"
            value={overview?.averageScore}
            subtitle="National average"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* State Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🗺️ State-wise Athlete Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(regionalStats?.stateDistribution || {}).map(([state, count]) => ({ state, count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="state" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Type Popularity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏃‍♂️ Test Type Popularity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics?.testTypePopularity || {}).map(([test, data]) => ({
                      name: test.replace('-', ' ').toUpperCase(),
                      value: data.count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(analytics?.testTypePopularity || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Performance Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Performance Trends (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.performanceTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageScore" 
                    stroke="#2196F3" 
                    name="Average Score"
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="participantCount" 
                    stroke="#4CAF50" 
                    name="Participants"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔧 System Health
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">API Response Time</Typography>
                  <Typography variant="body2" color="success.main">
                    {analytics?.systemHealth?.apiResponseTime || 0}ms
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Upload Success Rate</Typography>
                  <Typography variant="body2" color="success.main">
                    {((analytics?.systemHealth?.uploadSuccessRate || 0) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Processing Time</Typography>
                  <Typography variant="body2" color="warning.main">
                    {analytics?.systemHealth?.processingTime || 0}s avg
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Storage Used</Typography>
                  <Typography variant="body2">
                    {analytics?.systemHealth?.storageUsed || '0GB'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts and Notifications */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚨 System Alerts
              </Typography>
              <Box>
                <Alert severity="info" sx={{ mb: 1 }}>
                  {overview?.alertsCount?.pending_verification || 0} assessments pending verification
                </Alert>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  {overview?.alertsCount?.flagged_assessments || 0} assessments flagged for review
                </Alert>
                <Alert severity="error">
                  {overview?.alertsCount?.technical_issues || 0} technical issues requiring attention
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Top Performing Regions
              </Typography>
              <Box>
                {regionalStats?.performanceByRegion?.topPerformingStates?.slice(0, 5).map((state, index) => (
                  <Box key={state.name} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      #{index + 1} {state.name}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {state.avgScore?.toFixed(1) || 0}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}