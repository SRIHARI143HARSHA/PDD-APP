// Mock Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Test response'),
        },
      }),
    }),
  })),
}));

describe('Chatbot Module', () => {
  let chatbot;

  beforeEach(() => {
    jest.clearAllMocks();
    chatbot = require('../backend/chatbot');
  });

  it('should export askChatbot function', () => {
    expect(typeof chatbot.askChatbot).toBe('function');
  });

  it('should handle chatbot responses', async () => {
    const response = await chatbot.askChatbot('What should I do in an earthquake?');
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('should support various disaster scenarios', async () => {
    const scenarios = [
      'earthquake',
      'hurricane',
      'flood',
      'tornado',
      'wildfire',
      'tsunami',
      'volcanic eruption',
    ];

    for (const scenario of scenarios) {
      const response = await chatbot.askChatbot(`What should I do during a ${scenario}?`);
      expect(typeof response).toBe('string');
    }
  });

  it('should handle empty questions gracefully', async () => {
    const response = await chatbot.askChatbot('');
    expect(typeof response).toBe('string');
  });
});

describe('Frontend chatbot guidance', () => {
  it('should provide actionable flood guidance for flood-related questions', async () => {
    const { askChatbot } = require('../frontend/services/chatbotService');
    const response = await askChatbot('What should I do during a flood?');

    expect(response.toLowerCase()).toContain('flood');
    expect(response.toLowerCase()).toContain('higher ground');
  });

  it('should explain what a flood is for definition questions', async () => {
    const { askChatbot } = require('../frontend/services/chatbotService');
    const response = await askChatbot('what is flood');

    expect(response.toLowerCase()).toContain('overflow');
    expect(response.toLowerCase()).toContain('water');
  });
});

describe('Chatbot Safety and Security', () => {
  it('should not expose API key in responses', async () => {
    const chatbot = require('../backend/chatbot');
    const response = await chatbot.askChatbot('Hello');

    expect(response).not.toContain('DUMMY_GEMINI_KEY');
  });
});
