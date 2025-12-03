const Ticket = require('../models/Ticket');
const Agent = require('../models/Agent');
const socketService = require('../services/socket.service');

// Call next ticket
exports.callNextTicket = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const { serviceType } = req.body;

    // Get agent info
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Check if agent is already serving a ticket
    if (agent.currentTicket) {
      return res.status(400).json({
        success: false,
        message: 'Please complete current ticket before calling next'
      });
    }

    // Build query for next ticket
    const query = { status: 'waiting' };
    
    // Filter by service type if specified, or by agent's services
    if (serviceType) {
      query.serviceType = serviceType;
    } else if (agent.services && agent.services.length > 0) {
      query.serviceType = { $in: agent.services };
    }

    // Find next ticket (highest priority, earliest created)
    const ticket = await Ticket.findOne(query)
      .sort({ priority: -1, createdAt: 1 });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'No tickets waiting in queue'
      });
    }

    // Update ticket status
    ticket.status = 'called';
    ticket.calledAt = new Date();
    ticket.servedBy = agentId;
    ticket.counterNumber = agent.counterNumber;
    await ticket.save();

    // Update agent's current ticket
    agent.currentTicket = ticket._id;
    await agent.save();

    // Emit socket event for ticket called
    socketService.emitTicketCalled(ticket, agent);

    res.json({
      success: true,
      message: 'Ticket called successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error calling next ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error calling next ticket',
      error: error.message
    });
  }
};

// Start serving ticket
exports.startServing = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const agent = await Agent.findById(agentId).populate('currentTicket');

    if (!agent.currentTicket) {
      return res.status(400).json({
        success: false,
        message: 'No ticket to serve'
      });
    }

    const ticket = await Ticket.findById(agent.currentTicket._id);
    ticket.status = 'serving';
    ticket.servedAt = new Date();
    await ticket.save();

    socketService.emitTicketUpdated(ticket);

    res.json({
      success: true,
      message: 'Started serving ticket',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting service',
      error: error.message
    });
  }
};

// Complete ticket
exports.completeTicket = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const { notes } = req.body;

    const agent = await Agent.findById(agentId);
    if (!agent.currentTicket) {
      return res.status(400).json({
        success: false,
        message: 'No ticket to complete'
      });
    }

    const ticket = await Ticket.findById(agent.currentTicket);
    ticket.status = 'completed';
    ticket.completedAt = new Date();
    if (notes) ticket.notes = notes;
    await ticket.save();

    // Update agent stats
    agent.currentTicket = null;
    agent.ticketsServedToday += 1;
    
    // Update average service time
    const serviceDuration = ticket.serviceDuration || 0;
    const totalTickets = agent.ticketsServedToday;
    agent.averageServiceTime = Math.round(
      ((agent.averageServiceTime * (totalTickets - 1)) + serviceDuration) / totalTickets
    );
    await agent.save();

    socketService.emitTicketUpdated(ticket);

    res.json({
      success: true,
      message: 'Ticket completed',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing ticket',
      error: error.message
    });
  }
};

// Mark ticket as no-show
exports.markNoShow = async (req, res) => {
  try {
    const agentId = req.agent.id;
    const agent = await Agent.findById(agentId);

    if (!agent.currentTicket) {
      return res.status(400).json({ success: false, message: 'No ticket assigned' });
    }

    const ticket = await Ticket.findById(agent.currentTicket);
    ticket.status = 'no-show';
    ticket.completedAt = new Date();
    await ticket.save();

    agent.currentTicket = null;
    await agent.save();

    socketService.emitTicketUpdated(ticket);

    res.json({ success: true, message: 'Ticket marked as no-show', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true })
      .select('-password')
      .populate('currentTicket');

    res.json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching agents', error: error.message });
  }
};

