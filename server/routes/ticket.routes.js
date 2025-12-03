const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

// Public routes
// POST /api/tickets - Create a new ticket
router.post('/', ticketController.createTicket);

// GET /api/tickets - Get tickets (query: status, serviceType, limit)
router.get('/', ticketController.getTickets);

// GET /api/tickets/:id - Get single ticket by ID
router.get('/:id', ticketController.getTicketById);

// GET /api/tickets/number/:ticketNumber - Get ticket by ticket number
router.get('/number/:ticketNumber', ticketController.getTicketByNumber);

// POST /api/tickets/:id/checkin - Check-in ticket
router.post('/:id/checkin', ticketController.checkinTicket);

// POST /api/tickets/:id/cancel - Cancel ticket
router.post('/:id/cancel', ticketController.cancelTicket);

module.exports = router;

