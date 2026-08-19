import { askChatbot } from '../../frontend/services/chatbotService';

describe('AI Chatbot Thinking & Speed Optimization Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should support token streaming callback and return full response', async () => {
    const tokens = ['Hello! ', 'I am ', 'Disaster AI.'];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => {
          let i = 0;
          return {
            read: async () => {
              if (i < tokens.length) {
                const chunk = tokens[i++];
                return { done: false, value: new TextEncoder().encode(chunk) };
              }
              return { done: true, value: undefined };
            },
          };
        },
      },
    });

    const receivedTokens = [];
    const res = await askChatbot('hi', {}, (tokenChunk) => {
      receivedTokens.push(tokenChunk);
    });

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.response).toBe('Hello! I am Disaster AI.');
    expect(receivedTokens).toEqual(tokens);
  });
});
