const express = require('express');
const {
  createIssue,
  getIssues,
  getIssue,
  confirmIssue
} = require('../controllers/issueController');

const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/')
  .get(getIssues);

router.route('/create')
  .post(protect, upload.single('image'), createIssue);

router.route('/:id')
  .get(getIssue);

router.route('/confirm/:id')
  .post(protect, confirmIssue);

module.exports = router;
