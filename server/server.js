const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('⚠️ MONGODB_URI not found in environment variables. Database connection skipped.');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (for deployment monitoring & validation)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Campus Lost & Found API is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Campus Lost & Found API is active. Access endpoints via /api/reports');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`📋 Reports API available at http://localhost:${PORT}/api/reports`);
});
