const getEnvVar = (key) => {
  try {
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env[key];
    }
  } catch (e) {}
  return undefined;
};

const getApiUrl = () => {
  const envUrl = getEnvVar('EXPO_PUBLIC_API_URL');
  if (envUrl) {
    return envUrl;
  }
  return 'http://localhost:5000';
};

/**
 * Ask Ollama AI Chatbot via Express Backend Bridge with real-time token streaming.
 * Accepts an onToken(token, fullText) callback for live UI response streaming.
 */
export async function askChatbot(question, context = {}, onToken = null) {
  const query = (question || '').trim();
  if (!query) {
    const errText = 'Message content is required.';
    return Object.assign(String(errText), {
      error: true,
      code: 'EMPTY_MESSAGE',
      message: errText,
      response: errText,
    });
  }

  const { currentWeather = null, activeAlerts = [], conversationHistory = [] } = context;
  const apiUrl = getApiUrl();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const res = await fetch(`${apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message: query,
        currentWeather: currentWeather,
        activeAlerts: activeAlerts,
        conversationHistory: conversationHistory,
        stream: true,
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = typeof res.json === 'function' ? await res.json().catch(() => ({})) : {};
      const userErrMsg = errData.message || 'AI assistant is currently unavailable. Please try again.';
      return Object.assign(String(userErrMsg), {
        error: true,
        code: errData.code || 'API_ERROR',
        message: userErrMsg,
        devDetail: errData.devDetail,
        response: userErrMsg,
      });
    }

    // Read HTTP Stream Tokens in Real-Time
    if (res.body && typeof res.body.getReader === 'function') {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const tokenChunk = decoder.decode(value, { stream: true });
        if (tokenChunk) {
          fullText += tokenChunk;
          if (typeof onToken === 'function') {
            onToken(tokenChunk, fullText);
          }
        }
      }

      if (fullText.trim()) {
        return Object.assign(String(fullText), { success: true, response: fullText });
      }
    }

    // Fallback for non-streaming or test mocks
    let fullText = '';
    if (typeof res.text === 'function') {
      fullText = await res.text();
    } else if (typeof res.json === 'function') {
      const data = await res.json();
      fullText = data.response || JSON.stringify(data);
    }

    if (typeof onToken === 'function') {
      onToken(fullText, fullText);
    }
    return Object.assign(String(fullText), { success: true, response: fullText });
  } catch (err) {
    console.error('[chatbotService] Network/Fetch Error:', err.message);
    const userErrMsg = 'AI assistant is currently unavailable. Please try again.';
    return Object.assign(String(userErrMsg), {
      error: true,
      code: 'NETWORK_ERROR',
      message: userErrMsg,
      devDetail: `Failed to connect to backend at ${apiUrl}: ${err.message}`,
      response: userErrMsg,
    });
  }
}
