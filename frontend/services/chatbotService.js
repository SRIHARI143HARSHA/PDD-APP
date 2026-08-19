const { getConversationalAIResponse } = require('../../backend/chatbot');

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
 * Ask Ollama AI Chatbot via Express Backend Bridge.
 * Automatically injects live weather and active alerts context.
 * Returns a String-compatible object for 100% backward & forward compatibility.
 */
export async function askChatbot(question, context = {}) {
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
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message: query,
        currentWeather: currentWeather,
        activeAlerts: activeAlerts,
        conversationHistory: conversationHistory,
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.response) {
        const text = data.response;
        return Object.assign(String(text), { success: true, response: text });
      }
    }
  } catch (err) {}

  // Fallback to built-in local offline disaster response engine
  const offlineReply = getConversationalAIResponse(query);
  if (offlineReply) {
    return Object.assign(String(offlineReply), {
      success: true,
      response: offlineReply,
      isOfflineFallback: true,
    });
  }

  const fallbackErr = 'AI assistant is currently unavailable.';
  return Object.assign(String(fallbackErr), {
    error: true,
    code: 'OLLAMA_UNAVAILABLE',
    message: fallbackErr,
    response: fallbackErr,
  });
}
