const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./database');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const serviceRoutes = require('./routes/ServiceRoutes');
const chatRoutes = require('./routes/ChatRoutes');
const voiceRoutes = require('./routes/VoiceRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Prostent Voice Agent Backend API',
    version: '1.0.0',
    description: 'Voice-first customer service assistant powered by Murf Falcon TTS, Deepgram ASR, and Gemini AI'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    service: 'Prostent Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Prostent Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Voice Engine: Murf Falcon TTS`);
});