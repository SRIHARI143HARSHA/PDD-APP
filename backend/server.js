const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Disaster AI Assistant, a helpful, calm, professional, friendly, clear, practical, and safety-focused AI assistant built into this application.

Identity & Persona Rules:
- Your name is "Disaster AI Assistant".
- When greeted with "hi", "hello", or "hey", respond briefly and naturally: "Hi! 👋 I'm Disaster AI Assistant. I can help you with disaster preparedness, weather safety, emergency procedures, and general questions. What would you like to know?"
- When asked "who are you?", answer: "I'm Disaster AI Assistant, an AI assistant built into this app to help with disaster preparedness, weather safety, emergency procedures, and general safety guidance."
- Never identify as "Universal AI Assistant".
- Never output rigid template headers like "Knowledge Guide", "Key Concept & Overview", "Fundamental Principles", or "Recommended Actions".

Response Length & Formatting Rules:
- Keep normal answers concise and direct (2–5 short paragraphs or bullet points).
- For disaster & emergency safety questions, prioritize clear, practical action steps without long scientific background unless asked.
- For technical & general questions, give a direct definition, brief explanation, and short code snippet if relevant.
- Do not generate long essays unless the user explicitly requests "explain in detail" or "detailed explanation".

Weather Context Rules:
- Never invent or hallucinate weather conditions, temperatures, rainfall, wind speeds, or emergency alerts.
- If current weather telemetry is supplied in the context, use it accurately when answering weather or outdoor safety questions.
- If current weather data is unavailable, state clearly: "I don't have current weather data available right now."`;

function isWeatherRelevant(text) {
  if (!text || typeof text !== 'string') return false;
  const q = text.toLowerCase();
  return (
    q.includes('weather') ||
    q.includes('rain') ||
    q.includes('temp') ||
    q.includes('temperature') ||
    q.includes('wind') ||
    q.includes('humidity') ||
    q.includes('sun') ||
    q.includes('cloud') ||
    q.includes('hot') ||
    q.includes('cold') ||
    q.includes('storm') ||
    q.includes('flood') ||
    q.includes('drizzle') ||
    q.includes('alert') ||
    q.includes('warning') ||
    q.includes('cyclone') ||
    q.includes('lightning') ||
    q.includes('thunder') ||
    q.includes('outside') ||
    q.includes('go out') ||
    q.includes('safe to go')
  );
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ollamaBaseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// Optimized Chat endpoint with real-time streaming & performance timing
app.post('/api/chat', async (req, res) => {
  const reqStart = Date.now();
  const { message, currentWeather, activeAlerts, conversationHistory = [], stream = true } = req.body || {};

  console.log(`\n[CHAT] ==========================================`);
  console.log(`[CHAT] Request started: ${new Date().toISOString()}`);
  console.log(`[CHAT] Message: "${message ? message.trim() : ''}"`);
  console.log(`[CHAT] Ollama URL: ${OLLAMA_BASE_URL}/api/chat`);
  console.log(`[CHAT] Model: ${OLLAMA_MODEL}`);

  if (!message || typeof message !== 'string' || !message.trim()) {
    console.log(`[CHAT] Rejected empty message`);
    console.log(`[CHAT] ==========================================\n`);
    return res.status(400).json({
      error: true,
      code: 'EMPTY_MESSAGE',
      message: 'Message content is required.',
    });
  }

  const shouldIncludeWeather = isWeatherRelevant(message);
  let contextSnippet = '';

  if (shouldIncludeWeather && currentWeather) {
    console.log(`[CHAT] Including Weather Context: Temp=${currentWeather.temp}°C, Condition=${currentWeather.condition}`);
    contextSnippet += `\n\n[Current Weather Telemetry Provided By Application]`;
    contextSnippet += `\nLocation: ${currentWeather.location || 'Local Area'}`;
    contextSnippet += `\nTemperature: ${currentWeather.temp}°C`;
    contextSnippet += `\nFeels Like: ${currentWeather.feelsLike || currentWeather.temp}°C`;
    contextSnippet += `\nHumidity: ${currentWeather.humidity}%`;
    contextSnippet += `\nWind Speed: ${currentWeather.windSpeed} km/h`;
    contextSnippet += `\nRainfall: ${currentWeather.rainfall || 0} mm`;
    contextSnippet += `\nCondition: ${currentWeather.condition || 'Normal'}`;
  } else {
    console.log(`[CHAT] Weather Context: Omitted (Not relevant or unavailable)`);
  }

  if (shouldIncludeWeather && Array.isArray(activeAlerts) && activeAlerts.length > 0) {
    console.log(`[CHAT] Including Active Alerts Context: ${activeAlerts.length} active alert(s)`);
    contextSnippet += `\n\n[Active Weather Alerts Currently Triggered]`;
    activeAlerts.forEach((alert) => {
      contextSnippet += `\n- ${alert.title}: ${alert.message} (Status: Active)`;
    });
  }

  const fullSystemContent = SYSTEM_PROMPT + contextSnippet;

  // Limit conversation history to last 6 messages max for minimum token overhead
  const historyMessages = (Array.isArray(conversationHistory) ? conversationHistory : [])
    .slice(-6)
    .map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text || '',
    }));

  const messagesPayload = [
    { role: 'system', content: fullSystemContent },
    ...historyMessages,
    { role: 'user', content: message.trim() },
  ];

  console.log(`[CHAT] Ollama request started...`);
  const ollamaReqStart = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: messagesPayload,
        stream: true,
      }),
    });

    clearTimeout(timeoutId);

    if (!ollamaResponse.ok) {
      console.error(`[CHAT] Ollama returned HTTP error: ${ollamaResponse.status}`);
      console.log(`[CHAT] ==========================================\n`);
      return res.status(ollamaResponse.status).json({
        error: true,
        code: 'OLLAMA_ERROR',
        message: 'AI assistant is currently unavailable. Please try again.',
        devDetail: `Ollama API returned HTTP ${ollamaResponse.status}`,
      });
    }

    // Handle Streaming Output to Client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();
    let firstTokenReceived = false;
    let totalChars = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          const token = parsed.message?.content || parsed.response || '';
          if (token) {
            if (!firstTokenReceived) {
              firstTokenReceived = true;
              console.log(`[CHAT] First token received: ${Date.now() - ollamaReqStart} ms`);
            }
            totalChars += token.length;
            res.write(token);
          }
        } catch (e) {
          // If chunk is raw text token
          if (!firstTokenReceived) {
            firstTokenReceived = true;
            console.log(`[CHAT] First token received: ${Date.now() - ollamaReqStart} ms`);
          }
          totalChars += line.length;
          res.write(line);
        }
      }
    }

    const totalTime = Date.now() - reqStart;
    console.log(`[CHAT] Ollama response completed: ${Date.now() - ollamaReqStart} ms (${totalChars} chars)`);
    console.log(`[CHAT] Total request time: ${totalTime} ms`);
    console.log(`[CHAT] ==========================================\n`);

    res.end();
  } catch (err) {
    console.error(`[CHAT] Ollama connection failed!`);
    console.error(`[CHAT] Error Detail: ${err.message}`);
    console.log(`[CHAT] ==========================================\n`);

    if (!res.headersSent) {
      return res.status(503).json({
        error: true,
        code: 'OLLAMA_UNAVAILABLE',
        message: 'AI assistant is currently unavailable. Please try again.',
        devDetail: `Could not connect to Ollama at ${OLLAMA_BASE_URL}: ${err.message}`,
      });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Disaster AI Backend Server running on port ${PORT}`);
  console.log(`Connecting to Ollama at: ${OLLAMA_BASE_URL}`);
  console.log(`Configured Model: ${OLLAMA_MODEL}`);
});
