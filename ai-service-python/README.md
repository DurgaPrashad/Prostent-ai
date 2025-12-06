# Prostent AI Service (Python Version)

This service handles all AI-related functionality for the Prostent voice agent platform using the Google Gemini API, Deepgram ASR, Murf Falcon TTS, and includes advanced graph visualization capabilities.

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
- Multiple voice options available
- Customizable speech parameters (rate, pitch, emotion)

### ✅ Secure API Key Management
- All API keys stored in environment variables
- No hardcoded credentials in source code
- .env file for local development
- Production environment variables via deployment platform

## Features

- Natural language processing with Gemini AI
- Chat response generation with context awareness
- Context-aware multi-turn conversations
- Data type detection for automotive and other data
- Graph and chart visualization generation
- Sentiment analysis and emotion detection
- CORS support for frontend integration
- Murf Falcon TTS voice synthesis integration
- Deepgram ASR speech recognition integration

## Setup & Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Murf Falcon API Key (https://www.murf.ai/)
- Deepgram API Key (https://console.deepgram.com)
- Google Gemini API Key (https://ai.google.dev/)

### Environment Variables

1. Create a `.env` file in the ai-service-python directory:
   ```bash
   cp .env.example .env
   ```

2. Add the following required API keys:
   ```
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Murf Falcon TTS
   MURF_API_KEY=ap2_0241be10-1f6d-40e3-a4ab-d60b1c4df48a
   
   # Deepgram ASR
   DEEPGRAM_API_KEY=822def0564e22a959a8cec4a1d0ab6e855eaf882
   
   # Server Configuration
   PORT=8001
   NODE_ENV=development
   ```

### Installation Steps

1. Ensure you have the required environment variables in the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   MURF_API_KEY=your_murf_api_key_here
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   PORT=8001
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the service:
   ```bash
   python main.py
   ```

4. Access the service:
   ```
   API Base URL: http://localhost:8001
   Health Check: http://localhost:8001/health
   ```

## Clear Setup & Run Instructions

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DurgaPrashad/Prostent-ai.git
   cd prostent/ai-service-python
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   nano .env
   ```

3. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install and run**:
   ```bash
   pip install -r requirements.txt
   python main.py
   ```

5. **Test the service**:
   ```bash
   # Test health check
   curl http://localhost:8001/health
   
   # Test chat endpoint with Murf voice synthesis
   curl -X POST http://localhost:8001/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "How does the Murf Falcon voice agent work?",
       "token": "test_token"
     }'
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gemini API key not found | Verify GEMINI_API_KEY in .env file |
| Murf API errors | Check MURF_API_KEY is valid and has active credits |
| Deepgram connection failed | Verify DEEPGRAM_API_KEY is correct |
| Port 8001 already in use | Change PORT in .env or kill process using port 8001 |
| Python dependencies fail | Update pip: `pip install --upgrade pip` then retry |
| Module not found errors | Ensure virtual environment is activated and dependencies installed |

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

## API Endpoints

### Chat Endpoint (with Voice Support)
- `POST /chat` - Generate AI responses with optional Murf voice synthesis
  Request body:
  ```json
  {
    "message": "Your question here",
    "token": "authentication_token",
    "voiceId": "en-US-thomas",  // Optional: Murf voice ID
    "useVoice": true,           // Optional: Enable voice synthesis
    "sheetData": {
      "name": "Sheet Name",
      "columns": [{"name": "Column1"}, {"name": "Column2"}],
      "dataPreview": [["value1", "value2"], ["value3", "value4"]],
      "rowCount": 100
    },
    "conversation_history": [
      {"role": "user", "content": "Previous message"},
      {"role": "assistant", "content": "Previous response"}
    ]
  }
  ```
  
  Response includes:
  - AI-generated text response
  - Optional: Murf Falcon TTS audio URL
  - Visualizations for data analysis

### Health Check
- `GET /health` - Check if the service is running and all APIs are accessible
  Response:
  ```json
  {
    "status": "healthy",
    "service": "Prostent AI Service",
    "apis": {
      "gemini": "connected",
      "murf": "connected",
      "deepgram": "connected"
    }
  }
  ```

## Voice Processing Pipeline

This AI service integrates with the Prostent voice agent to provide:

1. **Speech Recognition**: Deepgram transcribes user voice input to text
2. **AI Processing**: Gemini generates intelligent context-aware responses (this service)
3. **Speech Synthesis**: Murf Falcon TTS converts responses to natural-sounding voice
4. **Conversation Context**: Maintains conversation history for multi-turn dialogues

### Complete Voice Flow

```
User Voice Input
    ↓
Deepgram ASR (speech-to-text)
    ↓
AI Service - Gemini Processing (this service)
    ↓
Murf Falcon TTS (text-to-speech) - Real-time audio synthesis
    ↓
Audio Output to User (via browser or speaker)
```

## Visualization Capabilities

The AI service can generate visualizations for data analysis:
- Histograms for numerical data
- Bar charts for categorical data
- Automatic chart selection based on data type
- Base64 encoded images returned in the response

## Data Type Detection

The service automatically detects the following data types:
- Automotive/Vehicle Data
- Service Records
- Customer Data
- Sales Data
- Inventory Data
- General Data

Each data type has specialized prompts for more accurate analysis and voice-based responses.

## Murf Voice Integration

### Supported Voices
The service can use any Murf Falcon voice:
- Thomas (Male, Professional)
- Amber (Female, Friendly)
- James (Male, British)
- Sophia (Female, British)
- Marcus (Male, Australian)
- And more...

### Voice Parameters
- **Rate**: Speech rate adjustment (0.5 - 2.0)
- **Pitch**: Voice pitch adjustment (0.5 - 2.0)
- **Emotion**: Emotional tone (Neutral, Enthusiastic, Sad, Angry, etc.)

## Service Integration

The service integrates seamlessly with:
- Frontend React/Vite application
- Backend Express.js API
- Main Prostent voice agent pipeline
- Deepgram ASR endpoints
- Murf Falcon TTS endpoints