require('dotenv').config();
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const config = require('../config');

const seedAgents = [
  {
    username: 'admin',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@smartqueue.com',
    role: 'admin',
    counterNumber: null,
    services: ['account', 'loan', 'general', 'registration', 'consultation', 'payment']
  },
  {
    username: 'agent1',
    password: 'agent123',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@smartqueue.com',
    role: 'agent',
    counterNumber: 1,
    services: ['account', 'general']
  },
  {
    username: 'agent2',
    password: 'agent123',
    firstName: 'Jean',
    lastName: 'Martin',
    email: 'jean.martin@smartqueue.com',
    role: 'agent',
    counterNumber: 2,
    services: ['loan', 'consultation']
  },
  {
    username: 'agent3',
    password: 'agent123',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@smartqueue.com',
    role: 'agent',
    counterNumber: 3,
    services: ['registration', 'payment']
  },
  {
    username: 'supervisor',
    password: 'supervisor123',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@smartqueue.com',
    role: 'supervisor',
    counterNumber: null,
    services: ['account', 'loan', 'general', 'registration', 'consultation', 'payment']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing agents
    await Agent.deleteMany({});
    console.log('🗑️  Cleared existing agents');

    // Create agents
    for (const agentData of seedAgents) {
      const agent = new Agent(agentData);
      await agent.save();
      console.log(`✅ Created agent: ${agent.username} (${agent.role})`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Supervisor: supervisor / supervisor123');
    console.log('   Agent 1: agent1 / agent123');
    console.log('   Agent 2: agent2 / agent123');
    console.log('   Agent 3: agent3 / agent123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

