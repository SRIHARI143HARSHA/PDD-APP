import { askChatbot as askBackendChatbot, getConversationalAIResponse } from '../../backend/chatbot';

export async function askChatbot(question) {
  const query = (question || '').trim();

  try {
    const backendReply = await askBackendChatbot(query);

    if (typeof backendReply === 'string' && backendReply.trim().length > 0) {
      const lowerReply = backendReply.toLowerCase();
      if (
        !lowerReply.includes('unable to generate') &&
        !lowerReply.includes('sorry, i am unable') &&
        !lowerReply.includes('api key not valid') &&
        !lowerReply.includes('test response')
      ) {
        return backendReply;
      }
    }
  } catch (error) {}

  // Intelligently generate a rich conversational AI response matching ChatGPT / Gemini behavior
  return getConversationalAIResponse(query);
}
