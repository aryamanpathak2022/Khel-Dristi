const express = require('express');
const router = express.Router();

// Mock storage for athlete data
const athletes = new Map();

/**
 * @route GET /api/athlete/profile/:athleteId
 * @desc Get athlete profile information
 */
router.get('/profile/:athleteId', (req, res) => {
  try {
    const { athleteId } = req.params;
    
    // Find athlete (mock implementation)
    const athlete = athletes.get(athleteId);
    
    if (!athlete) {
      return res.status(404).json({
        error: 'Athlete not found'
      });
    }

    res.json({
      profile: {
        id: athlete.id,
        name: athlete.name,
        age: athlete.age,
        gender: athlete.gender,
        sport: athlete.sport,
        state: athlete.state,
        district: athlete.district,
        joinedDate: athlete.createdAt,
        totalAssessments: athlete.assessments?.length || 0,
        bestScores: athlete.bestScores || {},
        achievements: athlete.achievements || [],
        kineticProfile: athlete.kineticProfile || null
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch athlete profile',
      details: error.message
    });
  }
});

/**
 * @route PUT /api/athlete/profile/:athleteId
 * @desc Update athlete profile
 */
router.put('/profile/:athleteId', (req, res) => {
  try {
    const { athleteId } = req.params;
    const updates = req.body;
    
    const athlete = athletes.get(athleteId);
    
    if (!athlete) {
      return res.status(404).json({
        error: 'Athlete not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'age', 'sport', 'state', 'district', 'phoneNumber'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        athlete[field] = updates[field];
      }
    });

    athlete.updatedAt = new Date();
    athletes.set(athleteId, athlete);

    res.json({
      message: 'Profile updated successfully',
      profile: {
        id: athlete.id,
        name: athlete.name,
        age: athlete.age,
        sport: athlete.sport,
        state: athlete.state,
        district: athlete.district
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message
    });
  }
});

/**
 * @route GET /api/athlete/stats/:athleteId
 * @desc Get athlete performance statistics
 */
router.get('/stats/:athleteId', (req, res) => {
  try {
    const { athleteId } = req.params;
    
    // Mock statistics calculation
    const stats = {
      totalTests: 25,
      averageScore: 78.5,
      bestScore: 92.3,
      improvementRate: 12.5, // percentage
      testsThisMonth: 8,
      currentRanking: {
        national: 156,
        state: 12,
        district: 3
      },
      testBreakdown: {
        'vertical-jump': { count: 8, avgScore: 82.1, bestScore: 89.5 },
        'squat': { count: 7, avgScore: 75.3, bestScore: 88.2 },
        'sprint': { count: 6, avgScore: 76.8, bestScore: 85.1 },
        'push-up': { count: 4, avgScore: 81.2, bestScore: 92.3 }
      },
      progressChart: generateProgressData(athleteId),
      achievements: [
        { name: 'First Test Completed', date: '2024-01-15' },
        { name: 'Top 10 in District', date: '2024-02-20' },
        { name: 'Perfect Form Badge', date: '2024-03-10' }
      ]
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
});

/**
 * @route GET /api/athlete/leaderboard-position/:athleteId
 * @desc Get athlete's position in various leaderboards
 */
router.get('/leaderboard-position/:athleteId', (req, res) => {
  try {
    const { athleteId } = req.params;
    const { testType } = req.query;

    // Mock leaderboard positions
    const positions = {
      national: {
        overall: 156,
        testSpecific: testType ? 89 : null
      },
      state: {
        overall: 12,
        testSpecific: testType ? 7 : null
      },
      district: {
        overall: 3,
        testSpecific: testType ? 2 : null
      },
      percentile: 78.5,
      totalParticipants: {
        national: 12543,
        state: 892,
        district: 45
      }
    };

    res.json({ positions });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch leaderboard position',
      details: error.message
    });
  }
});

// Helper function to generate mock progress data
function generateProgressData(athleteId) {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 6);
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: 60 + Math.random() * 30 + i * 0.5, // Showing gradual improvement
      testType: ['vertical-jump', 'squat', 'sprint', 'push-up'][i % 4]
    });
  }

  return data;
}

module.exports = router;