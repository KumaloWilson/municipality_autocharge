const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', routes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
