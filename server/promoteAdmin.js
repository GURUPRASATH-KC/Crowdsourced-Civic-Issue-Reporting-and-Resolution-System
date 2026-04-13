import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node promoteAdmin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_reporter')
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${user.name} (${user.email}) is now an admin.`);
    } else {
      console.error(`User with email ${email} not found.`);
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
