# Voice Integration Guide - Prostent Hackathon

This guide explains how Prostent implements the Murf Voice Agent Hackathon requirements.

## Overview

Prostent is a **voice-first conversational AI application** that:
1. ✅ Accepts spoken input via microphone
2. ✅ Converts speech to text using ASR (Deepgram/AssemblyAI)
3. ✅ Processes intent using Gemini AI
4. ✅ Generates responses using Murf Falcon TTS
5. ✅ Returns synthesized speech output in real-time

## Voice Processing Pipeline

```
User Speech
    ↓
[Web Audio API - Frontend]
    ↓
[ASR Processing - Deepgram/AssemblyAI]
    ↓
Text Transcript
    ↓
[Backend API - Node.js/Express]
    ↓
[NLP Processing - Gemini API]
    ↓
AI Generated Response Text
    ↓
[Murf Falcon TTS API]
    ↓
Real-time Audio Stream
    ↓
User Hears Response
```

## API Integration Details

### 1. Murf Falcon TTS API Integration

**Main TTS Provider for the Hackathon**

#### How it works:
```javascript
// Backend implementation example
const murf = require('murf-api');

async function synthesizeSpeech(text, voiceId = 'default') {
  const response = await fetch('https://api.murf.ai/v1/speech/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MURF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      voiceId: voiceId,
      rate: 1.0,
      pitch: 1.0,
      emotion: 'neutral'
    })
  });

  const audioStream = await response.json();
  return audioStream.audioUrl; // Returns playable audio URL
}
```

#### Features Utilized:
- **Real-time Streaming**: Audio starts playing as it's generated
- **Natural Voices**: Multiple voice profiles with different tones
- **Customization**: Control speed, pitch, emotion
- **Production Quality**: Industry-leading voice synthesis
- **Free Tier**: Hackathon credits available

### 2. Speech Recognition Integration

#### Option A: Deepgram (Recommended)

```javascript
// Browser-side implementation
import { Deepgram } from '@deepgram/sdk';

const deepgram = new Deepgram(process.env.REACT_APP_DEEPGRAM_API_KEY);

async function captureAndTranscribe() {
  const mediaRecorder = new MediaRecorder(stream);
  
  deepgram.listen({
    model: 'nova',
    language: 'en',
    punctuate: true,
    interim_results: true
  });

  deepgram.addListener('open', () => console.log('Deepgram connected'));
  deepgram.addListener('results', (result) => {
    const transcript = result.channel.alternatives[0].transcript;
    // Send transcript to backend
    sendToBackend(transcript);
  });
}
```

**Deepgram Benefits:**
- 99.9% accuracy
- Real-time transcription (<100ms latency)
- Multiple language support
- Speaker diarization
- Free credits for hackathon

#### Option B: AssemblyAI (Alternative)

```javascript
// Backend implementation
const AssemblyAI = require('assemblyai');

async function transcribeAudio(audioFile) {
  const aai = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
  });

  const transcript = await aai.transcripts.transcribe({
    audio: audioFile,
    sentiment_analysis: true,
    entity_detection: true
  });

  return {
    text: transcript.text,
    sentiment: transcript.sentiment_analysis_results
  };
}
```

**AssemblyAI Benefits:**
- Entity recognition & PII redaction
- Built-in sentiment analysis
- Webhook support for async processing
- Auto chapters & summarization

### 3. Gemini API for NLP

```javascript
// Backend: Process transcript and generate response
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateResponse(userInput) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: conversationHistory,
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response.text();

  return response;
}
```

## Frontend Voice Components

### VoiceAssistant Component

```typescript
// src/components/VoiceAssistant.tsx
import React, { useState, useRef } from 'react';
import { useMicrophone } from '../hooks/useMicrophone';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { startListening, stopListening } = useMicrophone();

  const handleMicrophoneClick = async () => {
    if (!isListening) {
      setIsListening(true);
      await startListening(); // ASR processing
    } else {
      setIsListening(false);
      const text = await stopListening();
      setTranscript(text);
      await processVoiceQuery(text);
    }
  };

  const processVoiceQuery = async (text: string) => {
    setIsProcessing(true);
    try {
      // Send text to backend for NLP + TTS
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      // Play synthesized speech
      if (audioRef.current && data.audioUrl) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-assistant">
      <button 
        onClick={handleMicrophoneClick}
        disabled={isProcessing}
        className={`mic-button ${isListening ? 'listening' : ''}`}
      >
        🎤 {isListening ? 'Listening...' : 'Click to Speak'}
      </button>
      
      {transcript && <p>You said: {transcript}</p>}
      {isProcessing && <p>Processing...</p>}
      
      <audio ref={audioRef} />
    </div>
  );
};
```

### useMicrophone Hook

```typescript
// src/hooks/useMicrophone.ts
import { useState, useRef } from 'react';

export const useMicrophone = () => {
  const [isActive, setIsActive] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        
        // Call ASR service
        await transcribeAudio(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsActive(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopListening = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsActive(false);
    }
  };

  return { startListening, stopListening };
};
```

## Backend Voice Endpoints

### POST /api/voice/process

Handles complete voice interaction pipeline:

```javascript
// backend/routes/voiceRoutes.js
router.post('/api/voice/process', async (req, res) => {
  try {
    const { text } = req.body;

    // 1. Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text required' });
    }

    // 2. Generate AI response
    const aiResponse = await generateGeminiResponse(text);

    // 3. Synthesize speech with Murf Falcon
    const audioUrl = await synthesizeSpeechMurf(aiResponse);

    // 4. Store conversation
    await saveConversation({
      userInput: text,
      aiResponse: aiResponse,
      audioUrl: audioUrl,
      timestamp: new Date()
    });

    res.json({
      userInput: text,
      response: aiResponse,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({ error: 'Failed to process voice' });
  }
});
```

### GET /api/voice/test

Health check for voice services:

```javascript
router.get('/api/voice/test', async (req, res) => {
  const status = {
    murf: await checkMurfAPI(),
    deepgram: await checkDeepgramAPI(),
    gemini: await checkGeminiAPI(),
    mongodb: await checkDatabaseConnection()
  };

  res.json(status);
});
```

## Environment Configuration

### Critical Variables

```env
# MUST HAVE for voice functionality
MURF_API_KEY=xxx          # Murf Falcon TTS
DEEPGRAM_API_KEY=xxx      # Speech Recognition
GEMINI_API_KEY=xxx        # NLP Processing
```

### Optional Configuration

```env
# Voice Options
MURF_VOICE_ID=default     # Different voice profiles
DEEPGRAM_MODEL=nova       # Latest Deepgram model
SPEECH_LANGUAGE=en        # Language setting

# Performance
STREAM_CHUNK_SIZE=2048    # Audio streaming chunk
TTS_TIMEOUT=5000          # TTS generation timeout
ASR_TIMEOUT=30000         # Speech recognition timeout
```

## Testing Voice Features

### Test Script

```bash
# Test all voice services
npm run test:voice

# Test individual services
npm run test:murf          # Test TTS
npm run test:deepgram      # Test ASR
npm run test:gemini        # Test NLP
```

### Manual Testing

1. **Microphone Test**
   - Open browser DevTools Console
   - Click microphone button
   - Speak into microphone
   - Check transcription in console

2. **TTS Test**
   ```javascript
   // In browser console
   fetch('/api/voice/process', {
     method: 'POST',
     body: JSON.stringify({ text: 'Hello world' }),
     headers: { 'Content-Type': 'application/json' }
   }).then(r => r.json()).then(d => {
     new Audio(d.audioUrl).play();
   });
   ```

3. **End-to-End Test**
   - Speak: "What is machine learning?"
   - Wait for response
   - Verify audio playback

## Troubleshooting Voice Issues

### Issue: No Sound Output
**Solution:**
- Check browser speaker volume
- Verify audio permissions granted
- Check browser console for errors
- Test audio with: `new Audio('https://example.com/audio.wav').play()`

### Issue: Speech Not Recognized
**Solution:**
- Check microphone works in system settings
- Verify DEEPGRAM_API_KEY is valid
- Test microphone: `navigator.mediaDevices.enumerateDevices()`
- Check API rate limits

### Issue: Slow TTS Response
**Solution:**
- Check Murf API status dashboard
- Verify MURF_API_KEY is valid
- Check network latency
- Monitor API quota usage

### Issue: Conversation Not Saving
**Solution:**
- Verify MongoDB connection string
- Check database permissions
- Monitor database logs
- Test with: `curl http://localhost:3000/api/voice/test`

## Performance Optimization

### ASR Optimization
- Use streaming mode for real-time transcription
- Enable interim results for faster feedback
- Choose appropriate model (nova vs base)

### TTS Optimization
- Cache common responses
- Batch requests when possible
- Use appropriate voice settings
- Monitor API rate limits

### Overall Pipeline
- Reduce conversation history to last 5 messages
- Implement request queuing for high load
- Add Redis caching for responses
- Use CDN for audio delivery

## Compliance & Security

### API Key Security
✅ Store all keys in environment variables
✅ Never hardcode credentials
✅ Use .gitignore for .env files
✅ Rotate keys regularly
✅ Monitor API usage for suspicious activity

### Data Privacy
✅ Don't log sensitive user data
✅ Encrypt conversation storage
✅ Clear session data on logout
✅ Comply with GDPR/CCPA

### Rate Limiting
✅ Implement per-user rate limits
✅ Queue requests for fair access
✅ Monitor API quotas
✅ Set up alerts for overages

## Next Steps

1. Sign up for free API credentials
2. Install required packages: `npm install`
3. Configure `.env` file with API keys
4. Run development servers
5. Test voice pipeline end-to-end
6. Deploy to production

## Support

For issues or questions:
- Check API provider documentation
- Review browser console errors
- Test with curl/Postman
- Check GitHub issues
