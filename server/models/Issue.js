import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pothole', 'Garbage', 'Streetlight', 'Water Issue', 'Sanitation', 'Roads', 'Electricity']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  image: {
    type: String,
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    enum: ['Road', 'Sanitation', 'Electricity', 'Water', 'Unassigned'],
    default: 'Unassigned'
  },
  upvotes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
