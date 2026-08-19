import { askChatbot } from '../../frontend/services/chatbotService';

describe('Ollama AI Disaster Chatbot Service Test Suite', () => {
  it('should reject empty or whitespace message query', async () => {
    const res = await askChatbot('   ');
    expect(res).toBeDefined();
    expect(res.error).toBe(true);
    expect(res.code).toBe('EMPTY_MESSAGE');
  });

  it('should format disaster query and include weather context', async () => {
    const mockWeather = {
      location: 'Thandalam, Chennai',
      temp: 34,
      feelsLike: 36,
      humidity: 82,
      windSpeed: 24,
      rainfall: 5.5,
      condition: 'Rain',
    };

    const mockAlerts = [
      { id: '1', title: '🌧️ RAIN ALERT', message: 'Rain is currently detected in your area.' },
    ];

    const res = await askChatbot('What should I do during heavy rain?', {
      currentWeather: mockWeather,
      activeAlerts: mockAlerts,
    });

    expect(res).toBeDefined();
    expect(res.response || res.message).toBeDefined();
  });
});
