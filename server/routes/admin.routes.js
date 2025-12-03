const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// POST /api/admin/next - Call next ticket in queue
router.post('/next', adminController.callNextTicket);

// POST /api/admin/serve - Start serving current ticket
router.post('/serve', adminController.startServing);

// POST /api/admin/complete - Complete current ticket
router.post('/complete', adminController.completeTicket);

// POST /api/admin/no-show - Mark ticket as no-show
router.post('/no-show', adminController.markNoShow);

// GET /api/admin/agents - Get all agents (admin/supervisor only)
router.get('/agents', authorize('admin', 'supervisor'), adminController.getAgents);

module.exports = router;

