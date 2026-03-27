const express = require('express');
const {
  getAdminIssues,
  assignIssue,
  deleteIssue
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/issues')
  .get(getAdminIssues);

router.route('/assign/:id')
  .put(assignIssue);

router.route('/delete/:id')
  .delete(deleteIssue);

module.exports = router;
