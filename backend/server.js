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

Terminology & Accuracy Rules:
- In programming questions:
  * "OOP" means Object-Oriented Programming.
  * "OOPs" / "oops" refers to Object-Oriented Programming concepts.
  * "oops concept in Java" MUST be answered strictly as Object-Oriented Programming concepts in Java: Encapsulation, Inheritance, Polymorphism, Abstraction.
  * NEVER claim that "Oops" is a Java keyword, exception concept, or "Oh No!" concept.
- Never invent programming keywords or technical concepts.

Response Length & Formatting Rules:
- For simple questions or definitions, answer concisely (80–150 words). Do not write long essays.
- Do not repeat the user's question or end every response with repetitive questions.
- For disaster & emergency safety questions, prioritize clear, practical action steps without long scientific background unless asked.
- Do not generate long essays unless the user explicitly requests "explain in detail" or "detailed explanation".

Weather Context Rules:
- Never invent or hallucinate weather conditions, temperatures, rainfall, wind speeds, or emergency alerts.
- If current weather telemetry is supplied in the context, use it accurately when answering weather or outdoor safety questions.
- If current weather data is unavailable, state clearly: "I don't have current weather data available right now."`;

function normalizeIntent(text) {
  if (!text || typeof text !== 'string') return '';
  let normalized = text.trim();
  normalized = normalized.replace(/\boops\s+concepts?\b/gi, 'OOP concepts');
  normalized = normalized.replace(/\boops\b/gi, 'OOP');
  return normalized;
}

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

// Optimized Chat endpoint with intent normalization, precise stage timing, & Tokens/sec metrics
app.post('/api/chat', async (req, res) => {
  const reqStart = Date.now();
  const requestId = 'req_' + Math.random().toString(36).substring(2, 9);
  const { message, currentWeather, activeAlerts, conversationHistory = [] } = req.body || {};

  console.log(`\n[PERF ${requestId}] Request received: ${new Date().toISOString()}`);
  console.log(`[PERF ${requestId}] Original Message: "${message ? message.trim() : ''}"`);

  if (!message || typeof message !== 'string' || !message.trim()) {
    console.log(`[PERF ${requestId}] Rejected empty message`);
    console.log(`[PERF ${requestId}] Total request time: ${Date.now() - reqStart} ms\n`);
    return res.status(400).json({
      error: true,
      code: 'EMPTY_MESSAGE',
      message: 'Message content is required.',
    });
  }

  const queryToOllama = normalizeIntent(message);
  console.log(`[PERF ${requestId}] Normalized Query: "${queryToOllama}"`);
  console.log(`[PERF ${requestId}] Ollama Base URL: ${OLLAMA_BASE_URL}`);
  console.log(`[PERF ${requestId}] Ollama Model: ${OLLAMA_MODEL}`);

  const shouldIncludeWeather = isWeatherRelevant(queryToOllama);
  let contextSnippet = '';

  if (shouldIncludeWeather && currentWeather) {
    console.log(`[PERF ${requestId}] Including Weather Context: Temp=${currentWeather.temp}°C, Condition=${currentWeather.condition}`);
    contextSnippet += `\n\n[Current Weather Telemetry Provided By Application]`;
    contextSnippet += `\nLocation: ${currentWeather.location || 'Local Area'}`;
    contextSnippet += `\nTemperature: ${currentWeather.temp}°C`;
    contextSnippet += `\nFeels Like: ${currentWeather.feelsLike || currentWeather.temp}°C`;
    contextSnippet += `\nHumidity: ${currentWeather.humidity}%`;
    contextSnippet += `\nWind Speed: ${currentWeather.windSpeed} km/h`;
    contextSnippet += `\nRainfall: ${currentWeather.rainfall || 0} mm`;
    contextSnippet += `\nCondition: ${currentWeather.condition || 'Normal'}`;
  } else {
    console.log(`[PERF ${requestId}] Weather Context: Omitted (Not relevant or unavailable)`);
  }

  if (shouldIncludeWeather && Array.isArray(activeAlerts) && activeAlerts.length > 0) {
    console.log(`[PERF ${requestId}] Including Active Alerts Context: ${activeAlerts.length} active alert(s)`);
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
    { role: 'user', content: queryToOllama },
  ];

  const isDetailed = queryToOllama.toLowerCase().includes('in detail') || queryToOllama.toLowerCase().includes('explain in detail');
  const numPredict = isDetailed ? 500 : 200; // Constrain token length to prevent 50s generation overhead on CPU

  console.log(`[PERF ${requestId}] Prompt size: ${fullSystemContent.length} chars (num_predict=${numPredict})`);
  console.log(`[PERF ${requestId}] Ollama request started`);
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
        options: {
          num_predict: numPredict,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!ollamaResponse.ok) {
      console.error(`[PERF ${requestId}] Ollama returned HTTP error: ${ollamaResponse.status}`);
      console.log(`[PERF ${requestId}] Total request time: ${Date.now() - reqStart} ms\n`);
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
              console.log(`[PERF ${requestId}] First token received: ${Date.now() - ollamaReqStart} ms`);
            }
            totalChars += token.length;
            res.write(token);
          }
        } catch (e) {
          if (!firstTokenReceived) {
            firstTokenReceived = true;
            console.log(`[PERF ${requestId}] First token received: ${Date.now() - ollamaReqStart} ms`);
          }
          totalChars += line.length;
          res.write(line);
        }
      }
    }

    const generationTime = Date.now() - ollamaReqStart;
    const generationSec = generationTime / 1000;
    const approxTokens = Math.round(totalChars / 4);
    const tokensSec = generationSec > 0 ? (approxTokens / generationSec).toFixed(1) : '0';
    const totalTime = Date.now() - reqStart;

    console.log(`[PERF ${requestId}] Ollama completed: ${generationTime} ms`);
    console.log(`[PERF ${requestId}] Total tokens (approx): ${approxTokens}`);
    console.log(`[PERF ${requestId}] Tokens/sec: ${tokensSec} tokens/s`);
    console.log(`[PERF ${requestId}] Total request time: ${totalTime} ms\n`);

    res.end();
  } catch (err) {
    console.error(`[PERF ${requestId}] Ollama connection failed: ${err.message}`);
    console.log(`[PERF ${requestId}] Total request time: ${Date.now() - reqStart} ms\n`);

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
