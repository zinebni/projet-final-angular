const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema({
  // Agent credentials
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Agent information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  
  // Role
  role: {
    type: String,
    enum: ['agent', 'admin', 'supervisor'],
    default: 'agent'
  },
  
  // Counter/desk assignment
  counterNumber: {
    type: Number,
    default: null
  },
  
  // Services this agent can handle
  services: [{
    type: String,
    enum: ['account', 'loan', 'general', 'registration', 'consultation', 'payment']
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isOnline: {
    type: Boolean,
    default: false
  },
  
  // Current ticket being served
  currentTicket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    default: null
  },
  
  // Statistics
  ticketsServedToday: {
    type: Number,
    default: 0
  },
  
  averageServiceTime: {
    type: Number,
    default: 0
  },
  
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
agentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to hash password
agentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
agentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to reset daily stats
agentSchema.methods.resetDailyStats = function() {
  this.ticketsServedToday = 0;
};

// Index
agentSchema.index({ username: 1 });
agentSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('Agent', agentSchema);

