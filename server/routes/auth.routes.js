const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
// POST /api/auth/login - Login agent
router.post('/login', authController.login);

// Protected routes
// GET /api/auth/me - Get current logged in agent
router.get('/me', protect, authController.getMe);

// POST /api/auth/logout - Logout agent
router.post('/logout', protect, authController.logout);

// Admin only routes
// POST /api/auth/register - Register new agent (admin only)
router.post('/register', protect, authorize('admin'), authController.register);

module.exports = router;

