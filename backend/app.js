const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // Ensure this line comes first
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import your routes after declaring app
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes); // Use transaction routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
