import java.util.ArrayList;
import java.util.List;

/**
 * QuizManager handles Java MCQ question parsing, score tracking, and answer evaluation.
 */
public class QuizManager {

    public static class QuizQuestion {
        private final String questionText;
        private final String optionA;
        private final String optionB;
        private final String optionC;
        private final String optionD;
        private final String correctOption; // "A", "B", "C", or "D"
        private final String explanation;

        public QuizQuestion(String questionText, String optionA, String optionB, String optionC, String optionD, String correctOption, String explanation) {
            this.questionText = questionText;
            this.optionA = optionA;
            this.optionB = optionB;
            this.optionC = optionC;
            this.optionD = optionD;
            this.correctOption = (correctOption != null) ? correctOption.trim().toUpperCase() : "A";
            this.explanation = explanation;
        }

        public String getQuestionText() { return questionText; }
        public String getOptionA() { return optionA; }
        public String getOptionB() { return optionB; }
        public String getOptionC() { return optionC; }
        public String getOptionD() { return optionD; }
        public String getCorrectOption() { return correctOption; }
        public String getExplanation() { return explanation; }
    }

    private int score = 0;
    private int totalQuestionsAttempted = 0;
    private QuizQuestion currentQuestion = null;

    public int getScore() { return score; }
    public int getTotalQuestionsAttempted() { return totalQuestionsAttempted; }
    public QuizQuestion getCurrentQuestion() { return currentQuestion; }

    public void resetScore() {
        this.score = 0;
        this.totalQuestionsAttempted = 0;
        this.currentQuestion = null;
    }

    /**
     * Evaluates user selected option against correct option.
     */
    public boolean submitAnswer(String selectedOption) {
        if (currentQuestion == null || selectedOption == null) return false;

        totalQuestionsAttempted++;
        boolean isCorrect = selectedOption.trim().equalsIgnoreCase(currentQuestion.getCorrectOption());
        if (isCorrect) {
            score++;
        }
        return isCorrect;
    }

    /**
     * Parses formatted response from Ollama into a QuizQuestion object.
     */
    public QuizQuestion parseOllamaQuizResponse(String rawResponse) {
        if (rawResponse == null || rawResponse.trim().isEmpty()) {
            return getFallbackQuestion();
        }

        String questionText = "Which of the following is a key feature of Java?";
        String optA = "Object-Oriented Programming";
        String optB = "Manual Memory Allocation only";
        String optC = "Compiles directly to machine assembly only";
        String optD = "Does not support multithreading";
        String correct = "A";
        String explanation = "Java is an object-oriented programming language designed for platform independence via the JVM.";

        String[] lines = rawResponse.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("QUESTION:")) {
                questionText = trimmed.substring(9).trim();
            } else if (trimmed.startsWith("OPTION_A:")) {
                optA = trimmed.substring(9).trim();
            } else if (trimmed.startsWith("OPTION_B:")) {
                optB = trimmed.substring(9).trim();
            } else if (trimmed.startsWith("OPTION_C:")) {
                optC = trimmed.substring(9).trim();
            } else if (trimmed.startsWith("OPTION_D:")) {
                optD = trimmed.substring(9).trim();
            } else if (trimmed.startsWith("CORRECT:")) {
                String c = trimmed.substring(8).trim();
                if (!c.isEmpty()) {
                    correct = c.substring(0, 1).toUpperCase();
                }
            } else if (trimmed.startsWith("EXPLANATION:")) {
                explanation = trimmed.substring(12).trim();
            }
        }

        this.currentQuestion = new QuizQuestion(questionText, optA, optB, optC, optD, correct, explanation);
        return this.currentQuestion;
    }

    /**
     * Default fallback MCQ question if Ollama API is offline.
     */
    public QuizQuestion getFallbackQuestion() {
        this.currentQuestion = new QuizQuestion(
            "Which Java keyword is used to implement inheritance between classes?",
            "implements",
            "extends",
            "super",
            "this",
            "B",
            "'extends' is the keyword used in Java to create a subclass that inherits properties from a superclass."
        );
        return this.currentQuestion;
    }
}
