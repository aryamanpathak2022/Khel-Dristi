const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user storage (replace with database in production)
const users = new Map();

/**
 * @route POST /api/auth/register
 * @desc Register new athlete
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      age, 
      gender, 
      sport, 
      state, 
      district,
      phoneNumber 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user object
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      sport,
      state,
      district,
      phoneNumber,
      createdAt: new Date(),
      assessments: [],
      kinetic_profile: null
    };

    // Store user
    users.set(email, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sport: user.sport,
        state: user.state,
        district: user.district
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      details: error.message
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login athlete
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sport: user.sport,
        state: user.state,
        district: user.district
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  }
});

module.exports = router;