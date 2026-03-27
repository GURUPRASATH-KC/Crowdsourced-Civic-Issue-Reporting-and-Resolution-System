const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['road', 'water', 'electricity', 'waste', 'other']
  },
  imageURL: {
    type: String,
    default: 'no-photo.jpg'
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  priorityScore: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  confirmationsCount: {
    type: Number,
    default: 0
  },
  confirmedByUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  department: {
    type: String,
    default: 'Unassigned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Issue', issueSchema);
