import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Model imports
import User from './models/User.js';
import Issue from './models/Issue.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_reporter')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Civic Reporter API is running');
});

// Middleware for JWT authentication
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Please authenticate.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// --- AUTH ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');
    res.status(201).json({ user: { id: user._id, name, email, role: user.role }, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- ISSUE ROUTES ---

// Create issue
app.post('/api/issues', auth, async (req, res) => {
  try {
    const issue = new Issue({
      ...req.body,
      createdBy: req.userId
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all issues (filtered or all)
app.get('/api/issues', async (req, res) => {
  try {
    const issues = await Issue.find().populate('createdBy', 'name');
    res.json(issues);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get recent issues
app.get('/api/issues/recent', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name');
    res.json(issues);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user's issues
app.get('/api/issues/my', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.userId });
    res.json(issues);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: Update status
app.patch('/api/issues/:id/status', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Access denied' });
    
    const { status, department } = req.body;
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status, department }, { new: true });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    
    res.json(issue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Upvote issue
app.post('/api/issues/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });
    res.json(issue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Analytics
app.get('/api/analytics', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Access denied' });
    
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'Pending' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    
    res.json({ total, pending, inProgress, resolved });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
