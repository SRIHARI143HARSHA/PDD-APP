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
 * Transmits live weather and active alerts context to Express -> Ollama.
 * Strictly uses Ollama/Express backend. No rule-based offline fallback.
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

    const errData = await res.json().catch(() => ({}));
    const userErrMsg = errData.message || 'AI assistant is currently unavailable. Please try again.';
    if (errData.devDetail) {
      console.warn('[chatbotService] Dev Error Detail:', errData.devDetail);
    }

    return Object.assign(String(userErrMsg), {
      error: true,
      code: errData.code || 'API_ERROR',
      message: userErrMsg,
      devDetail: errData.devDetail,
      response: userErrMsg,
    });
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
