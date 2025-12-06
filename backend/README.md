# Prostent Backend Service

This service handles all backend functionality for the Prostent voice agent platform using MongoDB and Murf Falcon TTS API.

## Features

- MongoDB database integration
- User authentication with JWT
- Voice conversation management with Murf Falcon TTS
- Real-time speech synthesis from text responses
- Deepgram ASR integration for speech-to-text
- Google Gemini API for conversational AI
- Role-based access control
- RESTful API endpoints

## Setup

1. Ensure you have the required environment variables in the `.env` file:
   ```
   # Database Configuration
   MONGODB_URI=mongodb+srv://prostent:prostent99@cluster0.jry2x4n.mongodb.net/?appName=Cluster0
   MONGODB_DB_NAME=prostent
   JWT_SECRET=prostent_secret_key_for_hackathon
   
   # Voice & AI APIs
   MURF_API_KEY=ap2_0241be10-1f6d-40e3-a4ab-d60b1c4df48a
   DEEPGRAM_API_KEY=822def0564e22a959a8cec4a1d0ab6e855eaf882
   GEMINI_API_KEY=AIzaSyBew6x4k5LRP9iuKFwt0LY2zSDMS6KGWV0
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   BACKEND_URL=http://localhost:5000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the service:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Voice & Chat Management
- `POST /api/chat/create` - Create a new chat session
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/user/:userId` - Get all chats for user
- `POST /api/chat/speech` - Generate speech from text using Murf Falcon TTS

## Database Schema

The backend uses the following collections:
- `users`: User information (customers, providers, admins)
- `chats`: Chat sessions and conversation history

## Voice Agent Features

### Speech-to-Text (ASR)
- Deepgram API integration for real-time speech recognition
- 99.9% accuracy on English audio
- Supports multiple languages

### Natural Language Processing
- Google Gemini AI for intent recognition and response generation
- Context-aware responses based on conversation history
- Sentiment analysis capabilities

### Text-to-Speech (TTS)
- Murf Falcon TTS API for production-grade voice synthesis
- Natural-sounding voice output
- Multiple voice options available
- Real-time audio generation

## Role-Based Access

- **User**: Can create chat sessions, interact with voice agent
- **Admin**: Full access to all features and user data

## Environment Variables

### Database
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: Database name

### API Keys (Voice & AI)
- `MURF_API_KEY`: Murf Falcon TTS API key (PRIMARY)
- `DEEPGRAM_API_KEY`: Deepgram ASR API key
- `GEMINI_API_KEY`: Google Gemini API key for NLP

### Security
- `JWT_SECRET`: Secret key for JWT token generation

### Server
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `BACKEND_URL`: Backend server URL

## Getting API Keys

1. **Murf Falcon TTS**: https://www.murf.ai/ (Free hackathon credits)
2. **Deepgram ASR**: https://console.deepgram.com (Free credits available)
3. **Google Gemini**: https://ai.google.dev/ (Free tier)
4. **MongoDB**: https://www.mongodb.com/cloud/atlas (Free tier)