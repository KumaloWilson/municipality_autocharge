const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment-timezone');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Environment Variables
const PORT = 3300;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;


// Scheduled Cron Job (First day of every month at midnight GMT)
cron.schedule('0 0 1 * *', async () => {
    try {
        const currentTime = moment().tz('GMT').format(); // Log the current GMT time
        console.log(`Running scheduled auto charge at ${currentTime} (GMT)...`);

        // Call the autoCharge API
        const response = await axios.post(`${BASE_URL}/api/autoCharge`);
        console.log("Auto charge completed successfully:", response.data.message);
    } catch (error) {
        console.error("Error during scheduled auto charge:", error.message);
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Log BASE_URL for debugging
    console.log(`Using Base URL: ${BASE_URL}`);
});
