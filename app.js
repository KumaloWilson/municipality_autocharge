const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
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

// Scheduled Cron Job (First day of every month at midnight)
cron.schedule('0 0 1 * *', async () => {
    try {
        console.log("Running scheduled auto charge...");

        // Call the autoCharge API
        const response = await axios.post(`${BASE_URL}/api/autoCharge`);
        console.log("Auto charge completed successfully:", response.data.message);
    } catch (error) {
        console.error("Error during scheduled auto charge:", error.message);
    }
}, {
    scheduled: true,
    timezone: "UTC" // Set desired timezone
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Log BASE_URL for debugging
    console.log(`Using Base URL: ${BASE_URL}`);
});
