/**
 * Dashboard Service for SAI Officials
 * Handles communication with backend API
 */
class DashboardService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // For demo purposes, return mock data when API fails
      return this.getMockData(endpoint);
    }
  }

  getMockData(endpoint) {
    // Mock data for demo purposes
    const mockData = {
      '/dashboard/overview': {
        totalAthletes: 12543,
        totalAssessments: 98765,
        activeToday: 234,
        activeThisWeek: 1567,
        activeThisMonth: 6789,
        averageScore: 75.6,
        topPerformingState: 'Maharashtra',
        recentGrowth: {
          athletes: '+12%',
          assessments: '+28%',
          engagement: '+15%'
        },
        alertsCount: {
          pending_verification: 45,
          flagged_assessments: 12,
          technical_issues: 3
        }
      },
      '/dashboard/regional-stats': {
        stateDistribution: {
          'Maharashtra': 2341,
          'Karnataka': 1876,
          'Tamil Nadu': 1654,
          'Gujarat': 1432,
          'Punjab': 1287,
          'Haryana': 1098,
          'Others': 2855
        },
        performanceByRegion: {
          topPerformingStates: [
            { name: 'Punjab', avgScore: 82.3, athleteCount: 1287 },
            { name: 'Haryana', avgScore: 81.7, athleteCount: 1098 },
            { name: 'Maharashtra', avgScore: 79.4, athleteCount: 2341 },
            { name: 'Karnataka', avgScore: 78.8, athleteCount: 1876 },
            { name: 'Gujarat', avgScore: 77.9, athleteCount: 1432 }
          ]
        }
      },
      '/dashboard/analytics': {
        performanceTrends: [
          { month: 'Jan', averageScore: 72.1, participantCount: 856 },
          { month: 'Feb', averageScore: 73.5, participantCount: 967 },
          { month: 'Mar', averageScore: 74.8, participantCount: 1123 },
          { month: 'Apr', averageScore: 75.2, participantCount: 1287 },
          { month: 'May', averageScore: 76.1, participantCount: 1456 },
          { month: 'Jun', averageScore: 75.6, participantCount: 1234 }
        ],
        testTypePopularity: {
          'vertical-jump': { count: 25431, avgScore: 76.3 },
          'squat': { count: 23876, avgScore: 74.8 },
          'sprint': { count: 22109, avgScore: 72.1 },
          'push-up': { count: 20987, avgScore: 78.9 }
        },
        demographicBreakdown: {
          ageGroups: {
            '10-15': 3456,
            '16-20': 4567,
            '21-25': 2890,
            '26-30': 1234,
            '30+': 396
          },
          genderDistribution: {
            male: 7832,
            female: 4711
          }
        },
        qualityMetrics: {
          averageConfidenceScore: 0.87,
          cheatDetectionRate: 0.03,
          videoQualityScore: 0.91,
          dataIntegrityScore: 0.98
        },
        systemHealth: {
          apiResponseTime: 245,
          uploadSuccessRate: 0.96,
          processingTime: 12.3,
          storageUsed: '2.4TB'
        }
      }
    };

    return mockData[endpoint] || {};
  }

  // API Methods
  async getOverview() {
    return this.makeRequest('/dashboard/overview');
  }

  async getRegionalStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/dashboard/regional-stats${queryString ? '?' + queryString : ''}`);
  }

  async getAnalytics() {
    return this.makeRequest('/dashboard/analytics');
  }

  async getAssessments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/dashboard/assessments${queryString ? '?' + queryString : ''}`);
  }

  async verifyAssessment(assessmentData) {
    return this.makeRequest('/dashboard/verify-assessment', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  async getAthleteProfile(athleteId) {
    return this.makeRequest(`/athlete/profile/${athleteId}`);
  }

  async getLeaderboards(testType, region = null) {
    const params = { testType };
    if (region) params.region = region;
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/assessment/leaderboard/${testType}${queryString ? '?' + queryString : ''}`);
  }

  async exportData(params = {}) {
    // Mock export functionality
    console.log('Exporting data with params:', params);
    return {
      success: true,
      message: 'Export initiated. You will receive the file via email.',
      exportId: 'export_' + Date.now()
    };
  }

  async getSystemMetrics() {
    return this.makeRequest('/dashboard/system-metrics');
  }

  async getTalentHeatmap(params = {}) {
    // Generate mock heatmap data
    const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar'];
    return {
      heatmapData: states.map(state => ({
        state,
        intensity: Math.random(),
        athleteCount: Math.floor(Math.random() * 2000) + 500,
        avgScore: 70 + Math.random() * 20
      }))
    };
  }

  async searchAthletes(query, filters = {}) {
    // Mock search functionality
    return {
      results: Array.from({ length: 10 }, (_, i) => ({
        id: `athlete_${i}`,
        name: `Athlete ${i + 1}`,
        age: 18 + Math.floor(Math.random() * 10),
        sport: ['Track & Field', 'Swimming', 'Boxing', 'Wrestling'][Math.floor(Math.random() * 4)],
        state: ['Maharashtra', 'Karnataka', 'Punjab'][Math.floor(Math.random() * 3)],
        bestScore: 70 + Math.random() * 25,
        totalTests: Math.floor(Math.random() * 50) + 1
      })),
      total: 156,
      page: 1
    };
  }
}

export const dashboardService = new DashboardService();