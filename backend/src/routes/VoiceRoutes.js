const express = require('express');
const axios = require('axios');
const router = express.Router();

// Murf Falcon TTS Configuration
const MURF_API_BASE = 'https://api.murf.ai/v1';
const MURF_API_KEY = process.env.MURF_API_KEY || 'ap2_0241be10-1f6d-40e3-a4ab-d60b1c4df48a';

/**
 * POST /api/voice/process
 * Process text and convert to speech using Murf Falcon TTS
 * 
 * Request body:
 * {
 *   text: string,           // Text to convert to speech
 *   voiceId?: string,       // Optional: Murf voice ID (default: en-US-thomas)
 *   rate?: number,          // Optional: Speech rate 0.5-2.0
 *   pitch?: number,         // Optional: Pitch 0.5-2.0
 *   emotion?: string        // Optional: Emotion tone
 * }
 */
router.post('/process', async (req, res) => {
  try {
    const { text, voiceId = 'en-US-thomas', rate = 1.0, pitch = 1.0, emotion = 'Neutral' } = req.body;
    
    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text is required',
        message: 'Please provide text to convert to speech'
      });
    }
    
    // Call Murf Falcon TTS API
    const response = await axios.post(
      `${MURF_API_BASE}/speech/generate`,
      {
        voiceId: voiceId,
        text: text,
        rate: rate,
        pitch: pitch,
        emotion: emotion
      },
      {
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    // Convert audio to base64 for easier transmission
    const audioBase64 = Buffer.from(response.data).toString('base64');
    
    res.json({
      success: true,
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      text: text,
      voiceId: voiceId,
      rate: rate,
      pitch: pitch
    });
    
  } catch (error) {
    console.error('Murf Falcon TTS error:', error.response?.data || error.message);
    
    // Handle specific Murf API errors
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Murf API authentication failed',
        message: 'Invalid or expired Murf API key'
      });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid parameters for Murf TTS',
        message: error.response.data?.message || 'Check text and voice parameters'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate speech',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/voice/stream
 * Stream audio directly without base64 encoding
 */
router.post('/stream', async (req, res) => {
  try {
    const { text, voiceId = 'en-US-thomas', rate = 1.0, pitch = 1.0 } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Call Murf Falcon TTS API with stream response
    const response = await axios.post(
      `${MURF_API_BASE}/speech/generate`,
      {
        voiceId: voiceId,
        text: text,
        rate: rate,
        pitch: pitch
      },
      {
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );
    
    // Set audio headers and pipe response
    res.set('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Murf TTS streaming error:', error.message);
    res.status(500).json({ error: 'Failed to stream audio' });
  }
});

/**
 * GET /api/voice/voices
 * Get list of available Murf voices
 */
router.get('/voices', (req, res) => {
  // Available Murf Falcon voices
  const voices = [
    { id: 'en-US-thomas', name: 'Thomas', gender: 'Male', language: 'English (US)' },
    { id: 'en-US-amber', name: 'Amber', gender: 'Female', language: 'English (US)' },
    { id: 'en-GB-james', name: 'James', gender: 'Male', language: 'English (UK)' },
    { id: 'en-GB-sophia', name: 'Sophia', gender: 'Female', language: 'English (UK)' },
    { id: 'en-AU-marcus', name: 'Marcus', gender: 'Male', language: 'English (AU)' }
  ];
  
  res.json({
    success: true,
    voices: voices,
    total: voices.length
  });
});

/**
 * POST /api/voice/health
 * Check Murf API health status
 */
router.post('/health', async (req, res) => {
  try {
    // Test with a simple text-to-speech call
    const response = await axios.post(
      `${MURF_API_BASE}/speech/generate`,
      {
        voiceId: 'en-US-thomas',
        text: 'Test',
        rate: 1.0
      },
      {
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    res.json({
      status: 'healthy',
      service: 'Murf Falcon TTS',
      apiReachable: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'Murf Falcon TTS',
      apiReachable: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
