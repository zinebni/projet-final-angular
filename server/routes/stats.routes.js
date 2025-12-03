const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
// GET /api/stats/queue - Get queue status (for public display)
router.get('/queue', statsController.getQueueStatus);

// Protected routes
// GET /api/stats - Get overall statistics
router.get('/', protect, statsController.getStats);

// GET /api/stats/agents - Get agent performance stats (admin/supervisor only)
router.get('/agents', protect, authorize('admin', 'supervisor'), statsController.getAgentStats);

module.exports = router;

