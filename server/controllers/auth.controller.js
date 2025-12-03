const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const config = require('../config');

// Generate JWT token
const generateToken = (agent) => {
  return jwt.sign(
    { 
      id: agent._id, 
      username: agent.username,
      role: agent.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find agent
    const agent = await Agent.findOne({ username }).select('+password');

    if (!agent) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if agent is active
    if (!agent.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isMatch = await agent.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    agent.lastLoginAt = new Date();
    agent.isOnline = true;
    await agent.save();

    // Generate token
    const token = generateToken(agent);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        agent: {
          id: agent._id,
          username: agent.username,
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          role: agent.role,
          counterNumber: agent.counterNumber,
          services: agent.services
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id)
      .populate('currentTicket');

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    await Agent.findByIdAndUpdate(req.agent.id, { isOnline: false });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

// Register (admin only)
exports.register = async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, role, counterNumber, services } = req.body;

    // Check if username or email exists
    const existingAgent = await Agent.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const agent = new Agent({
      username,
      password,
      firstName,
      lastName,
      email,
      role: role || 'agent',
      counterNumber,
      services: services || ['general']
    });

    await agent.save();

    res.status(201).json({
      success: true,
      message: 'Agent registered successfully',
      data: {
        id: agent._id,
        username: agent.username,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        role: agent.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

