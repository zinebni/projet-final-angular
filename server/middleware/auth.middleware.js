const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const config = require('../config');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get agent from token
      const agent = await Agent.findById(decoded.id);

      if (!agent) {
        return res.status(401).json({
          success: false,
          message: 'Agent not found'
        });
      }

      if (!agent.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      req.agent = agent;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message
    });
  }
};

// Authorize by role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.agent.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.agent.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const agent = await Agent.findById(decoded.id);
        if (agent && agent.isActive) {
          req.agent = agent;
        }
      } catch (err) {
        // Token invalid, continue without auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

