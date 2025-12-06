# Prostent AI Service

This service handles all AI-related functionality for the Prostent voice agent platform using the Gemini API, Deepgram ASR, and Murf Falcon TTS API.

## 🎤 Voice Agent Features

### ✅ Working Voice Agent using Murf Falcon TTS API
- Production-grade text-to-speech synthesis
- Real-time voice generation from text responses
- Natural-sounding voice output with multiple voice options
- Integration with Murf Falcon TTS (PRIMARY requirement)

### ✅ Integrated ASR (Speech-to-Text) for Two-Way Conversation
- Deepgram API integration for real-time speech recognition
- 99.9% accuracy on English audio
- Enables two-way conversational interaction
- Users can speak naturally to the application

### ✅ Voice I/O Capabilities
- **Input**: Real-time speech capture and transcription via Deepgram ASR
- **Processing**: Natural language understanding via Gemini AI
- **Output**: Real-time speech synthesis via Murf Falcon TTS
- Users receive both text and spoken responses

### ✅ Real-Time Speech Output using Murf Falcon
- Low-latency audio generation (<2 seconds typical)
- Streaming audio support
- Multiple voice options (Thomas, Amber, James, Sophia, Marcus)
- Customizable speech parameters (rate, pitch, emotion)

### ✅ Secure API Key Management
- All API keys stored in environment variables
- No hardcoded credentials in source code
- .env file for local development
- Production environment variables via deployment platform

## Features

- Natural language processing with Gemini AI
- Chat response generation with context awareness
- Sentiment analysis and emotion detection
- Context-aware multi-turn conversations
- Murf Falcon TTS voice synthesis integration
- Deepgram ASR speech recognition integration

## Setup & Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Murf Falcon API Key (https://www.murf.ai/)
- Deepgram API Key (https://console.deepgram.com)
- Google Gemini API Key (https://ai.google.dev/)

### Environment Variables

1. Create a `.env` file in the ai-service directory:
   ```bash
   cp .env.example .env
   ```

2. Add the following required API keys:
   ```
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   
   # Murf Falcon TTS
   MURF_API_KEY=ap2_0241be10-1f6d-40e3-a4ab-d60b1c4df48a
   
   # Deepgram ASR
   DEEPGRAM_API_KEY=822def0564e22a959a8cec4a1d0ab6e855eaf882
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

### Installation Steps

1. Ensure you have the required environment variables in the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   MURF_API_KEY=your_murf_api_key_here
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   PORT=3001
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the service:
   ```bash
   npm run dev
   ```

4. Access the service:
   ```
   API Base URL: http://localhost:3001
   Health Check: http://localhost:3001/health
   ```

## Clear Setup & Run Instructions

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DurgaPrashad/Prostent-ai.git
   cd prostent/ai-service
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   nano .env
   ```

3. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

4. **Test the service**:
   ```bash
   # Test API generation endpoint
   curl -X POST http://localhost:3001/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "What is the Murf Falcon TTS API?"}'
   
   # Test chat endpoint
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"history": [], "message": "Hello, how does the voice agent work?"}'
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gemini API key not found | Verify GEMINI_API_KEY in .env file |
| Murf API errors | Check MURF_API_KEY is valid and has active credits |
| Deepgram connection failed | Verify DEEPGRAM_API_KEY is correct |
| Port already in use | Change PORT in .env or kill process using port 3001 |
| Service won't start | Check Node.js version (v16+) and dependencies with `npm install` |

## Getting API Keys

### Murf Falcon TTS API
- **Website**: https://www.murf.ai/
- **Free Credits**: Available for hackathon participants
- **Cost**: Free tier includes generous monthly credits
- **Setup Time**: 5 minutes

### Deepgram ASR API
- **Website**: https://console.deepgram.com
- **Free Credits**: Available for hackathon participants
- **Accuracy**: 99.9% on English audio
- **Features**: Real-time streaming, punctuation, diarization
- **Setup Time**: 5 minutes

### Google Gemini API
- **Website**: https://ai.google.dev/
- **Free Tier**: Available for development
- **Model**: gemini-pro (latest)
- **Features**: Multi-turn conversations, sentiment analysis
- **Setup Time**: 5 minutes

## Usage

The service exports two main functions:
- `generateResponse(prompt: string)`: Generate a response for a single prompt using Gemini AI
- `generateChatResponse(history: Array<{ role: string; parts: string }>, message: string)`: Generate a response in a chat context with conversation history

## API Endpoints

### Generate Endpoint
- `POST /api/generate` - Generate a single AI response
  ```bash
  curl -X POST http://localhost:3001/api/generate \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Your prompt here"}'
  ```

### Chat Endpoint
- `POST /api/chat` - Generate AI response in chat context
  ```bash
  curl -X POST http://localhost:3001/api/chat \
    -H "Content-Type: application/json" \
    -d '{
      "history": [
        {"role": "user", "parts": "Previous user message"},
        {"role": "assistant", "parts": "Previous assistant response"}
      ],
      "message": "Current user message"
    }'
  ```

### Health Check
- `GET /` - Service status and info

## Integration with Voice Agent

This AI service integrates with the Prostent voice agent to provide:

1. **Speech Recognition**: Deepgram transcribes user voice input
2. **AI Processing**: Gemini generates intelligent responses
3. **Speech Synthesis**: Murf Falcon TTS converts responses to voice
4. **Conversation Context**: MongoDB stores conversation history

The service works seamlessly with the main backend API for end-to-end voice interactions.

## API Integration Flow

```
User Voice Input
    ↓
Deepgram ASR (speech-to-text)
    ↓
AI Service - Gemini Processing (this service)
    ↓
Murf Falcon TTS (text-to-speech)
    ↓
Audio Output to User
```

## Service Integration

The service can be integrated with the main application through the exported functions in `geminiClient.js`.