const express = require('express');
const router = express.Router();
const {
  getCommits,
  getPRs,
  getReviews,
  getVelocity,
  getHealth,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/commits', protect, getCommits);
router.get('/prs', protect, getPRs);
router.get('/reviews', protect, getReviews);
router.get('/velocity', protect, getVelocity);
router.get('/health', protect, getHealth);

module.exports = router;
