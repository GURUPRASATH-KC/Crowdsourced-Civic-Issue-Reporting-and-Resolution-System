const Issue = require('../models/Issue');

// @desc    Create new issue
// @route   POST /api/issues/create
// @access  Private (User)
exports.createIssue = async (req, res) => {
  try {
    // req.body contains JSON fields, and req.file contains the image if present
    const { title, description, category, lat, lng } = req.body;
    
    let imageURL = 'no-photo.jpg';
    if (req.file) {
      imageURL = `/uploads/${req.file.filename}`;
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      imageURL,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ priorityScore: -1, createdAt: -1 }).populate('createdBy', 'name');
    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('createdBy', 'name');
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }
    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Confirm/Upvote an issue
// @route   POST /api/issues/confirm/:id
// @access  Private
exports.confirmIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    // Check if user already confirmed
    if (issue.confirmedByUsers.includes(req.user._id)) {
      return res.status(400).json({ success: false, error: 'You have already confirmed this issue' });
    }

    // Add user to confirmed list and increment count
    issue.confirmedByUsers.push(req.user._id);
    issue.confirmationsCount += 1;
    issue.priorityScore += 5;

    await issue.save();

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
