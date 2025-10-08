const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const { logger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.get('/', (req, res) => res.send('Welcome to the Product API (MongoDB)'));
app.use('/api/products', productRoutes);

// Error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = app;
