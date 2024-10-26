
const cron = require('node-cron');
const { autoChargeMonthlyBalances } = require('../controllers/residentController');

// Schedule job to run at 00:00 on the first of each month
cron.schedule('0 0 1 * *', () => {
    autoChargeMonthlyBalances();
});
