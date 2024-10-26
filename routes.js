
const express = require('express');
const { manualChargeBalance } = require('./controllers/residentController');
const router = express.Router();

// Manual balance charge route for testing
router.post('/charge', manualChargeBalance);

module.exports = router;
