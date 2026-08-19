const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a Disaster Preparedness AI assistant.

Your purpose is to provide clear, practical and safety-focused disaster preparedness information.

You can help users understand:
- weather-related hazards
- flood safety
- heavy rain
- thunderstorms
- extreme heat
- cyclones
- strong winds
- earthquakes
- fire safety
- emergency kits
- evacuation preparation

Use simple language.

Do not claim that you can physically detect an emergency unless the application provides actual sensor/API information.

Do not invent weather conditions.

If the user asks about current weather, use the weather information supplied by the application rather than guessing.

For serious emergencies, encourage the user to follow instructions from local emergency authorities.

Do not provide dangerous instructions.

Keep answers concise and actionable.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ollamaBaseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, currentWeather, activeAlerts, conversationHistory = [] } = req.body || {};

  console.log(`\n[CHAT] ==========================================`);
  console.log(`[CHAT] Request received`);
  console.log(`[CHAT] Message: "${message ? message.trim() : ''}"`);
  console.log(`[CHAT] Ollama URL: ${OLLAMA_BASE_URL}/api/chat`);
  console.log(`[CHAT] Model: ${OLLAMA_MODEL}`);

  if (currentWeather) {
    console.log(`[CHAT] Weather Context Provided: Temp=${currentWeather.temp}°C, Condition=${currentWeather.condition}, Location=${currentWeather.location || 'Local Area'}`);
  } else {
    console.log(`[CHAT] Weather Context: None`);
  }

  if (Array.isArray(activeAlerts) && activeAlerts.length > 0) {
    console.log(`[CHAT] Active Alerts Context: ${activeAlerts.length} active alert(s)`);
  } else {
    console.log(`[CHAT] Active Alerts Context: No active alerts`);
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    console.log(`[CHAT] Rejected empty message`);
    console.log(`[CHAT] ==========================================\n`);
    return res.status(400).json({
      error: true,
      code: 'EMPTY_MESSAGE',
      message: 'Message content is required.',
    });
  }

  // Construct system prompt with live application weather & alert context
  let contextSnippet = '';

  if (currentWeather) {
    contextSnippet += `\n\n[Current Weather Telemetry Provided By Application]`;
    contextSnippet += `\nLocation: ${currentWeather.location || 'Local Area'}`;
    contextSnippet += `\nTemperature: ${currentWeather.temp}°C`;
    contextSnippet += `\nFeels Like: ${currentWeather.feelsLike || currentWeather.temp}°C`;
    contextSnippet += `\nHumidity: ${currentWeather.humidity}%`;
    contextSnippet += `\nWind Speed: ${currentWeather.windSpeed} km/h`;
    contextSnippet += `\nRainfall: ${currentWeather.rainfall || 0} mm`;
    contextSnippet += `\nCondition: ${currentWeather.condition || 'Normal'}`;
  }

  if (Array.isArray(activeAlerts) && activeAlerts.length > 0) {
    contextSnippet += `\n\n[Active Weather Alerts Currently Triggered]`;
    activeAlerts.forEach((alert) => {
      contextSnippet += `\n- ${alert.title}: ${alert.message} (Status: Active)`;
    });
  } else {
    contextSnippet += `\n\n[Active Weather Alerts]: No active weather alerts. Current conditions are normal.`;
  }

  const fullSystemContent = SYSTEM_PROMPT + contextSnippet;

  // Format messages array for Ollama Chat API
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

  console.log(`[CHAT] Calling Ollama API...`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout for local LLM generation

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: messagesPayload,
        stream: false,
      }),
    });

    clearTimeout(timeoutId);

    if (!ollamaResponse.ok) {
      console.error(`[CHAT] Ollama returned error status: ${ollamaResponse.status}`);
      console.log(`[CHAT] ==========================================\n`);

      if (ollamaResponse.status === 404) {
        return res.status(404).json({
          error: true,
          code: 'MODEL_UNAVAILABLE',
          message: `AI assistant is currently unavailable. Please try again.`,
          devDetail: `Model '${OLLAMA_MODEL}' was not found in Ollama. Run 'ollama pull ${OLLAMA_MODEL}'.`,
        });
      }
      return res.status(500).json({
        error: true,
        code: 'OLLAMA_ERROR',
        message: 'AI assistant is currently unavailable. Please try again.',
        devDetail: `Ollama API returned HTTP ${ollamaResponse.status}`,
      });
    }

    const data = await ollamaResponse.json();
    const replyText = data.message?.content || data.response || '';

    if (!replyText) {
      console.error(`[CHAT] Received empty response content from Ollama`);
      console.log(`[CHAT] ==========================================\n`);
      return res.status(500).json({
        error: true,
        code: 'EMPTY_RESPONSE',
        message: 'AI assistant is currently unavailable. Please try again.',
        devDetail: 'Ollama response body contained no text content.',
      });
    }

    console.log(`[CHAT] Ollama response received successfully (${replyText.length} characters)`);
    console.log(`[CHAT] ==========================================\n`);

    return res.json({
      response: replyText,
      modelUsed: OLLAMA_MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`[CHAT] Ollama connection failed!`);
    console.error(`[CHAT] Error Detail: ${err.message}`);
    console.log(`[CHAT] ==========================================\n`);

    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: true,
        code: 'TIMEOUT',
        message: 'AI assistant is currently unavailable. Please try again.',
        devDetail: 'Ollama request timed out after 25 seconds.',
      });
    }

    return res.status(503).json({
      error: true,
      code: 'OLLAMA_UNAVAILABLE',
      message: 'AI assistant is currently unavailable. Please try again.',
      devDetail: `Could not connect to Ollama at ${OLLAMA_BASE_URL}: ${err.message}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Disaster AI Backend Server running on port ${PORT}`);
  console.log(`Connecting to Ollama at: ${OLLAMA_BASE_URL}`);
  console.log(`Configured Model: ${OLLAMA_MODEL}`);
});
