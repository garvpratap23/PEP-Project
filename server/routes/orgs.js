const express = require('express');
const router = express.Router();
const { getOrgs, getOrgDetails } = require('../controllers/orgController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOrgs);
router.get('/:org', protect, getOrgDetails);

module.exports = router;
