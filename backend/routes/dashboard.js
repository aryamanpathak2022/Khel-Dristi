const express = require('express');
const router = express.Router();

// Mock data for SAI Dashboard
const mockData = {
  totalAthletes: 12543,
  totalAssessments: 98765,
  activeToday: 234,
  stateDistribution: {
    'Maharashtra': 2341,
    'Karnataka': 1876,
    'Tamil Nadu': 1654,
    'Gujarat': 1432,
    'Punjab': 1287,
    'Haryana': 1098,
    'Others': 2855
  },
  testTypeStats: {
    'vertical-jump': { count: 25431, avgScore: 76.3 },
    'squat': { count: 23876, avgScore: 74.8 },
    'sprint': { count: 22109, avgScore: 72.1 },
    'push-up': { count: 20987, avgScore: 78.9 },
    'long-jump': { count: 18654, avgScore: 75.2 }
  }
};

/**
 * @route GET /api/dashboard/overview
 * @desc Get dashboard overview statistics
 */
router.get('/overview', (req, res) => {
  try {
    const overview = {
      totalAthletes: mockData.totalAthletes,
      totalAssessments: mockData.totalAssessments,
      activeToday: mockData.activeToday,
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
    };

    res.json({ overview });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch dashboard overview',
      details: error.message
    });
  }
});

/**
 * @route GET /api/dashboard/regional-stats
 * @desc Get regional talent distribution and statistics
 */
router.get('/regional-stats', (req, res) => {
  try {
    const { state, district } = req.query;

    let regionalData = {
      stateDistribution: mockData.stateDistribution,
      topDistricts: [
        { name: 'Mumbai', state: 'Maharashtra', athletes: 456, avgScore: 82.1 },
        { name: 'Bangalore Urban', state: 'Karnataka', athletes: 398, avgScore: 79.8 },
        { name: 'Chennai', state: 'Tamil Nadu', athletes: 367, avgScore: 78.5 },
        { name: 'Ahmedabad', state: 'Gujarat', athletes: 334, avgScore: 77.2 },
        { name: 'Ludhiana', state: 'Punjab', athletes: 298, avgScore: 76.9 }
      ],
      talentHeatmap: generateHeatmapData(),
      performanceByRegion: generateRegionalPerformance()
    };

    // Filter by state/district if specified
    if (state) {
      regionalData = filterByState(regionalData, state);
    }

    res.json({ regionalData });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch regional statistics',
      details: error.message
    });
  }
});

/**
 * @route GET /api/dashboard/assessments
 * @desc Get assessment data for dashboard
 */
router.get('/assessments', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status = 'all',
      testType,
      state,
      dateRange 
    } = req.query;

    // Mock assessment data with filtering
    let assessments = generateMockAssessments(parseInt(limit) * 3);

    // Apply filters
    if (status !== 'all') {
      assessments = assessments.filter(a => a.status === status);
    }
    if (testType) {
      assessments = assessments.filter(a => a.testType === testType);
    }
    if (state) {
      assessments = assessments.filter(a => a.state === state);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedAssessments = assessments.slice(startIndex, startIndex + parseInt(limit));

    const response = {
      assessments: paginatedAssessments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(assessments.length / limit),
        totalItems: assessments.length,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        total: assessments.length,
        verified: assessments.filter(a => a.status === 'verified').length,
        pending: assessments.filter(a => a.status === 'pending').length,
        flagged: assessments.filter(a => a.status === 'flagged').length
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch assessment data',
      details: error.message
    });
  }
});

/**
 * @route GET /api/dashboard/analytics
 * @desc Get advanced analytics for SAI dashboard
 */
router.get('/analytics', (req, res) => {
  try {
    const analytics = {
      performanceTrends: generatePerformanceTrends(),
      testTypePopularity: mockData.testTypeStats,
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
        },
        sportsCategories: {
          'Track & Field': 4567,
          'Team Sports': 3456,
          'Individual Sports': 2890,
          'Combat Sports': 1630
        }
      },
      qualityMetrics: {
        averageConfidenceScore: 0.87,
        cheatDetectionRate: 0.03,
        videoQualityScore: 0.91,
        dataIntegrityScore: 0.98
      },
      systemHealth: {
        apiResponseTime: 245, // ms
        uploadSuccessRate: 0.96,
        processingTime: 12.3, // seconds average
        storageUsed: '2.4TB'
      }
    };

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
});

/**
 * @route POST /api/dashboard/verify-assessment
 * @desc Verify an assessment (SAI official action)
 */
router.post('/verify-assessment', (req, res) => {
  try {
    const { assessmentId, officialId, decision, notes } = req.body;

    if (!assessmentId || !officialId || !decision) {
      return res.status(400).json({
        error: 'Missing required fields: assessmentId, officialId, decision'
      });
    }

    // Mock verification process
    const verification = {
      assessmentId,
      officialId,
      decision, // 'approved', 'rejected', 'needs_review'
      timestamp: new Date(),
      notes: notes || '',
      verificationHash: require('crypto')
        .createHash('sha256')
        .update(assessmentId + officialId + decision + Date.now())
        .digest('hex')
    };

    res.json({
      message: 'Assessment verification completed',
      verification
    });
  } catch (error) {
    res.status(500).json({
      error: 'Verification failed',
      details: error.message
    });
  }
});

// Helper functions
function generateHeatmapData() {
  const states = Object.keys(mockData.stateDistribution);
  return states.map(state => ({
    state,
    athleteCount: mockData.stateDistribution[state],
    avgScore: 70 + Math.random() * 20,
    intensity: Math.min(mockData.stateDistribution[state] / 2500, 1)
  }));
}

function generateRegionalPerformance() {
  return {
    topPerformingStates: [
      { name: 'Punjab', avgScore: 82.3, athleteCount: 1287 },
      { name: 'Haryana', avgScore: 81.7, athleteCount: 1098 },
      { name: 'Maharashtra', avgScore: 79.4, athleteCount: 2341 },
      { name: 'Karnataka', avgScore: 78.8, athleteCount: 1876 },
      { name: 'Gujarat', avgScore: 77.9, athleteCount: 1432 }
    ],
    improvementAreas: [
      { name: 'Odisha', avgScore: 68.2, needsSupport: true },
      { name: 'Jharkhand', avgScore: 69.1, needsSupport: true },
      { name: 'Chhattisgarh', avgScore: 70.3, needsSupport: false }
    ]
  };
}

function generatePerformanceTrends() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    averageScore: 70 + Math.random() * 15,
    participantCount: 800 + Math.random() * 400,
    completionRate: 0.85 + Math.random() * 0.1
  }));
}

function generateMockAssessments(count) {
  const testTypes = ['vertical-jump', 'squat', 'sprint', 'push-up', 'long-jump'];
  const states = Object.keys(mockData.stateDistribution);
  const statuses = ['verified', 'pending', 'flagged'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `assess_${i + 1}`,
    athleteId: `athlete_${Math.floor(Math.random() * 1000)}`,
    athleteName: `Athlete ${i + 1}`,
    testType: testTypes[Math.floor(Math.random() * testTypes.length)],
    score: 60 + Math.random() * 35,
    state: states[Math.floor(Math.random() * states.length)],
    district: 'Sample District',
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    confidenceScore: 0.7 + Math.random() * 0.3,
    cheatDetected: Math.random() < 0.05
  }));
}

function filterByState(data, state) {
  // Filter data by specific state
  return {
    ...data,
    topDistricts: data.topDistricts.filter(d => d.state === state),
    stateDistribution: { [state]: data.stateDistribution[state] }
  };
}

module.exports = router;