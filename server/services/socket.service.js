const { Server } = require('socket.io');
const config = require('../config');

class SocketService {
  constructor() {
    this.io = null;
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: config.clientUrl,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Join a room based on role
      socket.on('join:room', (room) => {
        socket.join(room);
        console.log(`📍 Socket ${socket.id} joined room: ${room}`);
      });

      // Leave a room
      socket.on('leave:room', (room) => {
        socket.leave(room);
        console.log(`🚪 Socket ${socket.id} left room: ${room}`);
      });

      // Agent goes online
      socket.on('agent:online', (agentId) => {
        socket.join(`agent:${agentId}`);
        this.io.emit('agent:status', { agentId, status: 'online' });
      });

      // Agent goes offline
      socket.on('agent:offline', (agentId) => {
        socket.leave(`agent:${agentId}`);
        this.io.emit('agent:status', { agentId, status: 'offline' });
      });

      // Subscribe to ticket updates
      socket.on('ticket:subscribe', (ticketId) => {
        socket.join(`ticket:${ticketId}`);
      });

      // Unsubscribe from ticket updates
      socket.on('ticket:unsubscribe', (ticketId) => {
        socket.leave(`ticket:${ticketId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });

    console.log('✅ Socket.io initialized');
  }

  // Emit when a new ticket is created
  emitTicketCreated(ticket) {
    if (this.io) {
      this.io.emit('ticket:created', ticket);
      console.log(`📤 Emitted ticket:created - ${ticket.ticketNumber}`);
    }
  }

  // Emit when a ticket is updated
  emitTicketUpdated(ticket) {
    if (this.io) {
      this.io.emit('ticket:updated', ticket);
      this.io.to(`ticket:${ticket._id}`).emit('ticket:updated', ticket);
      console.log(`📤 Emitted ticket:updated - ${ticket.ticketNumber}`);
    }
  }

  // Emit when a ticket is called
  emitTicketCalled(ticket, agent) {
    if (this.io) {
      const data = {
        ticket: {
          id: ticket._id,
          ticketNumber: ticket.ticketNumber,
          serviceType: ticket.serviceType,
          counterNumber: ticket.counterNumber
        },
        agent: {
          id: agent._id,
          name: agent.fullName,
          counterNumber: agent.counterNumber
        }
      };

      // Broadcast to all clients
      this.io.emit('ticket:called', data);
      
      // Also emit to specific ticket room
      this.io.to(`ticket:${ticket._id}`).emit('ticket:called', data);
      
      console.log(`📤 Emitted ticket:called - ${ticket.ticketNumber} to counter ${agent.counterNumber}`);
    }
  }

  // Emit queue update
  emitQueueUpdate(queueData) {
    if (this.io) {
      this.io.emit('queue:updated', queueData);
    }
  }

  // Emit stats update
  emitStatsUpdate(stats) {
    if (this.io) {
      this.io.to('admin').emit('stats:updated', stats);
    }
  }

  // Send notification to specific agent
  notifyAgent(agentId, notification) {
    if (this.io) {
      this.io.to(`agent:${agentId}`).emit('notification', notification);
    }
  }

  // Get io instance
  getIO() {
    return this.io;
  }
}

// Export singleton instance
module.exports = new SocketService();

