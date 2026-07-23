import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'DUMMY_GEMINI_API_KEY';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askChatbot(question) {
  try {
    if (process.env.GEMINI_API_KEY && API_KEY !== 'DUMMY_GEMINI_API_KEY') {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const prompt = `
You are a helpful, expert AI Disaster Preparedness and Emergency Assistant (like ChatGPT and Gemini AI).

Answer the user's question with clear formatting, markdown headers, and bullet points where helpful:
- Focus on practical safety, emergency guidance, definitions, and preparedness.
- Respond conversationally and warmly to greetings like "hi" or "hello".
- If asked "what is disaster", explain clearly with categories (Natural vs. Human-made) and safety tips.
- Keep answers informative, accurate, and easy to read.

User Question:
${question}
`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      if (reply && reply.trim().length > 0) {
        return reply;
      }
    }
  } catch (error) {
    console.log('Gemini AI fallback active:', error.message || error);
  }

  // Conversational AI fallback response
  const q = (question || '').trim().toLowerCase();
  if (q.includes('earthquake')) {
    return 'During an earthquake, drop to hands and knees, cover your head under a sturdy desk or table, and hold on until shaking stops.';
  }
  if (q.includes('flood')) {
    return 'A flood is an overflow of water onto dry land. If a flood warning is issued, move to higher ground immediately and avoid walking or driving through moving water.';
  }
  if (q.includes('fire')) {
    return 'In a fire, evacuate immediately using the nearest exit, stay low under smoke, and call emergency services.';
  }

  return 'I am your AI Safety & Emergency Preparedness Assistant. How can I help you prepare for disasters today?';
}