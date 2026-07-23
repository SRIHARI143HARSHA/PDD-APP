import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'DUMMY_GEMINI_API_KEY';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askChatbot(question) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const prompt = `
You are an AI-Based Disaster Preparedness and Emergency Response Assistant.

Your responsibilities:
- Answer questions related to disasters and emergencies.
- Provide safety guidance for floods, earthquakes, cyclones, tsunamis, fires, landslides, and storms.
- Explain disaster preparedness measures.
- Give emergency response instructions.
- Keep answers clear, practical, and easy to understand.
- If the question is unrelated to disasters, answer normally and politely.

User Question:
${question}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {

    console.log('Gemini Error:', error);

    return 'Sorry, I am unable to generate a response right now. Please try again later.';
  }
}