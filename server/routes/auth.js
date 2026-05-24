const express = require('express');
const router = express.Router();
const { githubAuth, githubCallback, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/github', githubAuth);
router.get('/callback', githubCallback);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
