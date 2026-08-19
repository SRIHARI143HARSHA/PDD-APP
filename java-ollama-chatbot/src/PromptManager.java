/**
 * PromptManager manages prompt construction and system instructions for Ollama.
 */
public class PromptManager {

    private static final String SYSTEM_INSTRUCTION = 
        "You are an expert, friendly Java Programming Tutor and AI Assistant designed for beginners. " +
        "Your goal is to help students learn Java programming step-by-step. " +
        "Provide clear explanations using simple language, short code snippets with comments, and clear formatting. " +
        "Always use standard Java conventions.";

    /**
     * Constructs a full prompt formatted with System Instruction.
     */
    public static String buildPrompt(String userTask, String userContext) {
        StringBuilder sb = new StringBuilder();
        sb.append(SYSTEM_INSTRUCTION).append("\n\n");
        if (userTask != null && !userTask.trim().isEmpty()) {
            sb.append("Task: ").append(userTask).append("\n\n");
        }
        if (userContext != null && !userContext.trim().isEmpty()) {
            sb.append("Context / User Input:\n").append(userContext).append("\n\n");
        }
        sb.append("Response:");
        return sb.toString();
    }

    /**
     * Prompts for explaining Java Concepts (e.g. OOP concepts).
     */
    public static String getConceptExplanationPrompt(String concept) {
        String task = "Explain the Java concept '" + concept + "' in simple, beginner-friendly language. " +
                      "Include a definition, why it is useful, real-world analogy, and a clean code example with comments.";
        return buildPrompt(task, concept);
    }

    /**
     * Prompts for Code Generation from natural language.
     */
    public static String getCodeGenerationPrompt(String request) {
        String task = "Generate a complete, compilable, and well-commented Java program for the following requirement: " +
                      "'" + request + "'. Include a main method, sample output comments, and explain how it works.";
        return buildPrompt(task, request);
    }

    /**
     * Prompts for Line-by-Line Code Explanation.
     */
    public static String getCodeExplanationPrompt(String code) {
        String task = "Explain the following Java code line by line for a beginner. " +
                      "Break down key keywords, variables, methods, and control flow.";
        return buildPrompt(task, code);
    }

    /**
     * Prompts for Error Fixing and Bug Resolution.
     */
    public static String getErrorFixingPrompt(String codeAndError) {
        String task = "Analyze the following Java code and error message. " +
                      "1. Identify the bug or error. 2. Explain why it occurs. 3. Provide the complete corrected Java code.";
        return buildPrompt(task, codeAndError);
    }

    /**
     * Prompts for Assignment Generation by difficulty level.
     */
    public static String getAssignmentPrompt(String level, String topic) {
        String task = "Generate 3 practical Java assignment exercises for a " + level + " student. " +
                      "Topic: " + (topic != null ? topic : "General Java Concepts") + ". " +
                      "For each exercise, provide: Problem Statement, Input/Output requirements, and Hints.";
        return buildPrompt(task, level + " " + topic);
    }

    /**
     * Prompts for Quiz MCQ Generation.
     */
    public static String getQuizQuestionPrompt(String topic) {
        String task = "Generate 1 Java Multiple-Choice Question (MCQ) on the topic of " + topic + ". " +
                      "Format strictly as follows:\n" +
                      "QUESTION: <Question text>\n" +
                      "OPTION_A: <Option A>\n" +
                      "OPTION_B: <Option B>\n" +
                      "OPTION_C: <Option C>\n" +
                      "OPTION_D: <Option D>\n" +
                      "CORRECT: <A, B, C, or D>\n" +
                      "EXPLANATION: <Short clear explanation of why this answer is correct>";
        return buildPrompt(task, topic);
    }
}
