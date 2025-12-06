const Chat = require('../models/Chat');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBew6x4k5LRP9iuKFwt0LY2zSDMS6KGWV0');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Murf Falcon TTS Configuration
const MURF_API_BASE = 'https://api.murf.ai/v1';
const MURF_API_KEY = process.env.MURF_API_KEY || 'ap2_0241be10-1f6d-40e3-a4ab-d60b1c4df48a';

// Default Murf voice configuration
const DEFAULT_VOICE_CONFIG = {
  voiceId: 'en-US-thomas', // Professional male voice
  rate: 1.0,               // Normal speech rate
  pitch: 1.0,              // Normal pitch
  emotion: 'Neutral'       // Emotion tone
};

// Create a new chat session
const createChatSession = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const chat = new Chat({
      userId,
      sessionId: uuidv4(),
      messages: []
    });
    
    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a message to chat session and get AI response
const addMessageToChat = async (req, res) => {
  try {
    const { sessionId, role, content } = req.body;
    
    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Add user message to chat
    chat.messages.push({ role, content });
    
    // If it's a user message, generate AI response
    if (role === 'user') {
      try {
        // Prepare chat history for context
        const history = chat.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        // Generate AI response using Gemini
        const result = await model.generateContent({
          contents: history
        });
        const response = await result.response;
        const aiResponse = response.text();
        
        // Add AI response to chat
        chat.messages.push({ role: 'assistant', content: aiResponse });
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Add error response to chat
        chat.messages.push({ role: 'assistant', content: 'Sorry, I encountered an error processing your request. Please try again.' });
      }
    }
    
    const updatedChat = await chat.save();
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate speech from text using Murf Falcon TTS API
const generateSpeech = async (req, res) => {
  try {
    const { text, voiceId, rate, pitch, emotion } = req.body;
    
    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    // Use provided voice config or defaults
    const voice = {
      voiceId: voiceId || DEFAULT_VOICE_CONFIG.voiceId,
      rate: rate || DEFAULT_VOICE_CONFIG.rate,
      pitch: pitch || DEFAULT_VOICE_CONFIG.pitch,
      emotion: emotion || DEFAULT_VOICE_CONFIG.emotion
    };
    
    // Call Murf Falcon TTS API
    const response = await axios.post(
      `${MURF_API_BASE}/speech/generate`,
      {
        voiceId: voice.voiceId,
        text: text,
        rate: voice.rate,
        pitch: voice.pitch,
        emotion: voice.emotion
      },
      {
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    // Set response headers for audio
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Length', response.data.length);
    res.send(response.data);
    
  } catch (error) {
    console.error('Murf Falcon TTS error:', error.response?.data || error.message);
    
    // Handle specific Murf API errors
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Murf API key invalid or expired' });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({ message: 'Invalid text or voice parameters for Murf TTS' });
    }
    
    res.status(500).json({ 
      message: 'Failed to generate speech using Murf Falcon TTS',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createChatSession,
  addMessageToChat,
  getChatHistory,
  getUserChats,
  generateSpeech
};