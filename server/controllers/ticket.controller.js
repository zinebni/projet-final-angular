const Ticket = require('../models/Ticket');
const socketService = require('../services/socket.service');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { serviceType, customerName, customerPhone, priority } = req.body;

    // Generate ticket number
    const ticketNumber = await Ticket.generateTicketNumber(serviceType || 'general');

    // Calculate estimated wait time
    const waitingCount = await Ticket.countDocuments({ 
      status: 'waiting',
      serviceType: serviceType || 'general'
    });
    const estimatedWaitTime = waitingCount * 5; // 5 minutes per ticket

    const ticket = new Ticket({
      ticketNumber,
      serviceType: serviceType || 'general',
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      priority: priority || 0,
      estimatedWaitTime
    });

    await ticket.save();

    // Emit socket event
    socketService.emitTicketCreated(ticket);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticket',
      error: error.message
    });
  }
};

// Get tickets by status
exports.getTickets = async (req, res) => {
  try {
    const { status, serviceType, limit = 50 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;

    const tickets = await Ticket.find(filter)
      .populate('servedBy', 'firstName lastName counterNumber')
      .sort({ priority: -1, createdAt: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};

// Get single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('servedBy', 'firstName lastName counterNumber');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Get ticket by ticket number
exports.getTicketByNumber = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber })
      .populate('servedBy', 'firstName lastName counterNumber');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Get position in queue
    const position = await Ticket.countDocuments({
      status: 'waiting',
      serviceType: ticket.serviceType,
      createdAt: { $lt: ticket.createdAt }
    }) + 1;

    res.json({
      success: true,
      data: { ...ticket.toJSON(), queuePosition: position }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
};

// Check-in ticket (mark as arrived)
exports.checkinTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.status !== 'waiting') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is not in waiting status'
      });
    }

    // Update notes to indicate check-in
    ticket.notes = `Checked in at ${new Date().toLocaleTimeString()}`;
    await ticket.save();

    socketService.emitTicketUpdated(ticket);

    res.json({
      success: true,
      message: 'Ticket checked in successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking in ticket',
      error: error.message
    });
  }
};

// Cancel ticket
exports.cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    ticket.status = 'cancelled';
    await ticket.save();
    socketService.emitTicketUpdated(ticket);
    res.json({ success: true, message: 'Ticket cancelled', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling ticket', error: error.message });
  }
};

