const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./src/config');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');
const notFound = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/error');

const app = express();

// Connect to MongoDB
// Uncomment the line below to connect. Commented out initially to avoid crash if no DB is running.
// connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & Logging
app.use(cors());
app.use(helmet());
if (config.env === 'development') {
    app.use(morgan('dev'));
}

// Sub-router for API v1
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
