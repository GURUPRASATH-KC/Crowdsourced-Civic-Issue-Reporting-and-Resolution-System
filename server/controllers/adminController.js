const Issue = require('../models/Issue');

// @desc    Get all issues with filters
// @route   GET /api/admin/issues
// @access  Private (Admin)
exports.getAdminIssues = async (req, res) => {
  try {
    let query;

    const reqQuery = { ...req.query };
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    query = Issue.find(reqQuery).populate('createdBy', 'name');

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const issues = await query;
    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Assign issue to department and update status
// @route   PUT /api/admin/assign/:id
// @access  Private (Admin)
exports.assignIssue = async (req, res) => {
  try {
    const { department, status, priorityScore } = req.body;
    let updateFields = {};
    if (department) updateFields.department = department;
    if (status) updateFields.status = status;
    if (priorityScore !== undefined) updateFields.priorityScore = priorityScore;

    const issue = await Issue.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

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

// @desc    Delete issue
// @route   DELETE /api/admin/delete/:id
// @access  Private (Admin)
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
