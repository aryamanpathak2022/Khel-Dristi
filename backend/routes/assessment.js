const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// In-memory storage for assessments (replace with database)
const assessments = new Map();

/**
 * @route POST /api/assessment/submit
 * @desc Submit performance assessment with video and AI analysis
 */
router.post('/submit', upload.single('video'), async (req, res) => {
  try {
    const {
      athleteId,
      testType,
      aiAnalysis,
      kineticBlueprint,
      performanceMetrics
    } = req.body;

    if (!athleteId || !testType || !aiAnalysis) {
      return res.status(400).json({
        error: 'Missing required fields: athleteId, testType, aiAnalysis'
      });
    }

    // Parse AI analysis data
    const analysisData = JSON.parse(aiAnalysis);
    const kineticData = JSON.parse(kineticBlueprint || '{}');
    const metrics = JSON.parse(performanceMetrics || '{}');

    // Create assessment record
    const assessmentId = crypto.randomUUID();
    const assessment = {
      id: assessmentId,
      athleteId,
      testType,
      timestamp: new Date(),
      videoPath: req.file ? req.file.path : null,
      videoMetadata: req.file ? {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : null,
      aiAnalysis: {
        posePoints: analysisData.posePoints || [],
        repCount: analysisData.repCount || 0,
        biomechanicalScore: analysisData.biomechanicalScore || 0,
        cheatDetected: analysisData.cheatDetected || false,
        confidenceScore: analysisData.confidenceScore || 0
      },
      kineticBlueprint: {
        jointAngles: kineticData.jointAngles || {},
        movementPattern: kineticData.movementPattern || [],
        signature: kineticData.signature || ''
      },
      performanceMetrics: {
        score: metrics.score || 0,
        jumpHeight: metrics.jumpHeight || null,
        squatDepth: metrics.squatDepth || null,
        runTime: metrics.runTime || null,
        technique: metrics.technique || null
      },
      // Proof-of-Performance Chain
      proofChain: {
        hash: crypto.createHash('sha256')
          .update(assessmentId + athleteId + testType + Date.now())
          .digest('hex'),
        previousHash: null, // Would link to previous assessment
        integrity: true
      },
      verified: false,
      ranking: null
    };

    // Store assessment
    assessments.set(assessmentId, assessment);

    // Calculate ranking (mock implementation)
    const rankingScore = calculateRanking(assessment);
    assessment.ranking = rankingScore;

    res.status(201).json({
      message: 'Assessment submitted successfully',
      assessmentId: assessmentId,
      analysis: {
        score: assessment.performanceMetrics.score,
        ranking: assessment.ranking,
        feedback: generateFeedback(assessment),
        badges: generateBadges(assessment)
      },
      proofHash: assessment.proofChain.hash
    });

  } catch (error) {
    res.status(500).json({
      error: 'Assessment submission failed',
      details: error.message
    });
  }
});

/**
 * @route GET /api/assessment/history/:athleteId
 * @desc Get assessment history for an athlete
 */
router.get('/history/:athleteId', (req, res) => {
  try {
    const { athleteId } = req.params;
    const athleteAssessments = Array.from(assessments.values())
      .filter(assessment => assessment.athleteId === athleteId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      assessments: athleteAssessments.map(assessment => ({
        id: assessment.id,
        testType: assessment.testType,
        timestamp: assessment.timestamp,
        score: assessment.performanceMetrics.score,
        ranking: assessment.ranking,
        verified: assessment.verified
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch assessment history',
      details: error.message
    });
  }
});

/**
 * @route GET /api/assessment/leaderboard/:testType
 * @desc Get leaderboard for specific test type
 */
router.get('/leaderboard/:testType', (req, res) => {
  try {
    const { testType } = req.params;
    const { state, district } = req.query;

    let filteredAssessments = Array.from(assessments.values())
      .filter(assessment => assessment.testType === testType && assessment.verified);

    // Apply regional filters if provided
    if (state || district) {
      // Would need to join with user data to filter by location
      // For now, return all assessments
    }

    const leaderboard = filteredAssessments
      .sort((a, b) => b.performanceMetrics.score - a.performanceMetrics.score)
      .slice(0, 50) // Top 50
      .map((assessment, index) => ({
        rank: index + 1,
        athleteId: assessment.athleteId,
        score: assessment.performanceMetrics.score,
        timestamp: assessment.timestamp,
        proofHash: assessment.proofChain.hash
      }));

    res.json({
      testType,
      leaderboard,
      totalParticipants: filteredAssessments.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch leaderboard',
      details: error.message
    });
  }
});

// Helper functions
function calculateRanking(assessment) {
  // Mock ranking calculation based on score
  const score = assessment.performanceMetrics.score;
  if (score >= 90) return { percentile: 95, category: 'Elite' };
  if (score >= 80) return { percentile: 85, category: 'Advanced' };
  if (score >= 70) return { percentile: 70, category: 'Intermediate' };
  if (score >= 60) return { percentile: 50, category: 'Beginner' };
  return { percentile: 25, category: 'Novice' };
}

function generateFeedback(assessment) {
  const score = assessment.performanceMetrics.score;
  const testType = assessment.testType;
  
  if (score >= 90) {
    return `Excellent ${testType} performance! You're in the top 10% nationally.`;
  } else if (score >= 70) {
    return `Good ${testType} form. Focus on consistency to improve further.`;
  } else {
    return `Keep practicing your ${testType} technique. Consider working on flexibility and strength.`;
  }
}

function generateBadges(assessment) {
  const badges = [];
  const score = assessment.performanceMetrics.score;
  
  if (score >= 90) badges.push('Gold Performance');
  if (score >= 80) badges.push('Silver Performance');
  if (!assessment.aiAnalysis.cheatDetected) badges.push('Fair Play');
  if (assessment.aiAnalysis.confidenceScore >= 0.95) badges.push('Perfect Form');
  
  return badges;
}

module.exports = router;