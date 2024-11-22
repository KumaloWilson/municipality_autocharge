
const express = require('express');
const { manualChargeBalance, autoChargeMonthlyBalances } = require('./controllers/residentController');
const router = express.Router();

// Manual balance charge route for testing
router.post('/charge', manualChargeBalance);
router.post('/autoCharge', autoChargeMonthlyBalances);

module.exports = router;
