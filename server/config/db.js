const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedDB = async () => {
  const adminEmail = 'admin12@gmail.com';
  const adminPassword = 'password123';
  
  try {
    const userExists = await User.findOne({ email: adminEmail });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('--------------------------------------------------');
      console.log(`Default admin user created:`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    // Spin up an in-memory MongoDB instance to bypass local network/firewall blocks
    // Using version 5.0.26 for driver compatibility (needs at least 4.2)
    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '5.0.26'
      }
    });
    const mongoUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`In-Memory MongoDB (v5.0.26) Connected: ${conn.connection.host}`);
    
    // Seed the database
    await seedDB();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
