export async function askChatbot(question) {
  // Front-end placeholder for chatbot requests.
  // Replace this with a secure backend API call instead of calling Node-only code directly.
  if (!question || question.trim().length === 0) {
    return 'Please ask a question about disaster preparedness.';
  }

  return `This is a simulated response for: ${question}`;
}
