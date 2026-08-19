package ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import javax.swing.BorderFactory;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTextPane;

/**
 * QuizPanel provides an interactive Multiple Choice Question (MCQ) quiz interface
 * with option selection, instant grading, explanation rendering, and score tracking.
 */
public class QuizPanel extends JPanel {

    public interface QuizListener {
        void onRequestNextQuestion(String topic);
    }

    private final JLabel scoreLabel;
    private final JTextPane questionTextPane;
    private final JRadioButton radioA;
    private final JRadioButton radioB;
    private final JRadioButton radioC;
    private final JRadioButton radioD;
    private final ButtonGroup optionGroup;
    private final JButton submitButton;
    private final JButton nextButton;
    private final JTextPane feedbackPane;

    private QuizListener listener;
    private String currentCorrectOption = "A";
    private String currentExplanation = "";
    private int score = 0;
    private int totalAttempted = 0;
    private boolean answeredCurrent = false;

    public QuizPanel() {
        setLayout(new BorderLayout(10, 10));
        setBackground(new Color(15, 23, 42));
        setBorder(BorderFactory.createEmptyBorder(14, 14, 14, 14));

        // Header Panel (Title & Live Score)
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(new Color(15, 23, 42));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 0));

        JLabel titleLabel = new JLabel("🧩 Interactive Java MCQ Quiz Mode");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        titleLabel.setForeground(Color.WHITE);

        scoreLabel = new JLabel("Score: 0 / 0 (0%)");
        scoreLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        scoreLabel.setForeground(new Color(56, 189, 248));

        headerPanel.add(titleLabel, BorderLayout.WEST);
        headerPanel.add(scoreLabel, BorderLayout.EAST);
        add(headerPanel, BorderLayout.NORTH);

        // Center Content Panel (Question Box + Options + Feedback)
        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new javax.swing.BoxLayout(centerPanel, javax.swing.BoxLayout.Y_AXIS));
        centerPanel.setBackground(new Color(15, 23, 42));

        // Question Display Box
        questionTextPane = new JTextPane();
        questionTextPane.setContentType("text/html");
        questionTextPane.setEditable(false);
        questionTextPane.setBackground(new Color(30, 41, 59));
        questionTextPane.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(51, 65, 85), 1),
                BorderFactory.createEmptyBorder(12, 12, 12, 12)
        ));
        setQuestionText("Loading quiz question...");

        JScrollPane qScroll = new JScrollPane(questionTextPane);
        qScroll.setPreferredSize(new Dimension(600, 90));
        qScroll.setMaximumSize(new Dimension(Integer.MAX_VALUE, 110));
        qScroll.setBorder(null);
        centerPanel.add(qScroll);

        centerPanel.add(javax.swing.Box.createRigidArea(new Dimension(0, 12)));

        // Radio Options Panel
        JPanel optionsPanel = new JPanel(new GridLayout(4, 1, 6, 6));
        optionsPanel.setBackground(new Color(15, 23, 42));

        radioA = createOptionRadio("A) ");
        radioB = createOptionRadio("B) ");
        radioC = createOptionRadio("C) ");
        radioD = createOptionRadio("D) ");

        optionGroup = new ButtonGroup();
        optionGroup.add(radioA);
        optionGroup.add(radioB);
        optionGroup.add(radioC);
        optionGroup.add(radioD);

        optionsPanel.add(radioA);
        optionsPanel.add(radioB);
        optionsPanel.add(radioC);
        optionsPanel.add(radioD);

        centerPanel.add(optionsPanel);
        centerPanel.add(javax.swing.Box.createRigidArea(new Dimension(0, 12)));

        // Submit & Next Controls
        JPanel controlPanel = new JPanel(new java.awt.FlowLayout(java.awt.FlowLayout.LEFT, 10, 0));
        controlPanel.setBackground(new Color(15, 23, 42));

        submitButton = new JButton("Submit Answer ➔");
        submitButton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        submitButton.setBackground(new Color(37, 99, 235));
        submitButton.setForeground(Color.WHITE);
        submitButton.setFocusPainted(false);
        submitButton.addActionListener(e -> evaluateAnswer());

        nextButton = new JButton("Next Question ⏭");
        nextButton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        nextButton.setBackground(new Color(16, 185, 129));
        nextButton.setForeground(Color.WHITE);
        nextButton.setFocusPainted(false);
        nextButton.setEnabled(false);
        nextButton.addActionListener(e -> {
            if (listener != null) {
                listener.onRequestNextQuestion("Java Fundamentals");
            }
        });

        controlPanel.add(submitButton);
        controlPanel.add(nextButton);
        centerPanel.add(controlPanel);

        centerPanel.add(javax.swing.Box.createRigidArea(new Dimension(0, 12)));

        // Feedback / Explanation Box
        feedbackPane = new JTextPane();
        feedbackPane.setContentType("text/html");
        feedbackPane.setEditable(false);
        feedbackPane.setBackground(new Color(30, 41, 59));
        feedbackPane.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(51, 65, 85), 1),
                BorderFactory.createEmptyBorder(10, 12, 10, 12)
        ));
        setFeedbackText("Select an option above and click 'Submit Answer'.");

        JScrollPane fbScroll = new JScrollPane(feedbackPane);
        fbScroll.setPreferredSize(new Dimension(600, 110));
        fbScroll.setBorder(null);
        centerPanel.add(fbScroll);

        add(centerPanel, BorderLayout.CENTER);
    }

    public void setQuizListener(QuizListener listener) {
        this.listener = listener;
    }

    public void loadQuestion(String question, String optA, String optB, String optC, String optD, String correctOption, String explanation) {
        this.currentCorrectOption = (correctOption != null) ? correctOption.trim().toUpperCase() : "A";
        this.currentExplanation = explanation;
        this.answeredCurrent = false;

        setQuestionText(question);
        radioA.setText("A) " + optA);
        radioB.setText("B) " + optB);
        radioC.setText("C) " + optC);
        radioD.setText("D) " + optD);

        optionGroup.clearSelection();
        setOptionsEnabled(true);
        submitButton.setEnabled(true);
        nextButton.setEnabled(false);

        setFeedbackText("💡 Select your choice (A, B, C, or D) and click Submit.");
    }

    private void evaluateAnswer() {
        if (answeredCurrent) return;

        String selected = null;
        if (radioA.isSelected()) selected = "A";
        else if (radioB.isSelected()) selected = "B";
        else if (radioC.isSelected()) selected = "C";
        else if (radioD.isSelected()) selected = "D";

        if (selected == null) {
            setFeedbackText("<span style='color: #fb923c;'>⚠️ Please select an option (A, B, C, or D) before submitting!</span>");
            return;
        }

        answeredCurrent = true;
        totalAttempted++;
        boolean isCorrect = selected.equalsIgnoreCase(currentCorrectOption);

        if (isCorrect) {
            score++;
            setFeedbackText("<html><body style='font-family: sans-serif; color: #4ade80;'> " +
                    "<b>✅ Correct Answer! Great Job!</b><br><br>" +
                    "<b>Explanation:</b> " + escapeHtml(currentExplanation) + "</body></html>");
        } else {
            setFeedbackText("<html><body style='font-family: sans-serif; color: #f87171;'> " +
                    "<b>❌ Incorrect! You selected (" + selected + "). Correct Answer: (" + currentCorrectOption + ")</b><br><br>" +
                    "<b>Explanation:</b> " + escapeHtml(currentExplanation) + "</body></html>");
        }

        int percent = (totalAttempted > 0) ? Math.round(((float) score / totalAttempted) * 100) : 0;
        scoreLabel.setText(String.format("Score: %d / %d (%d%%)", score, totalAttempted, percent));

        setOptionsEnabled(false);
        submitButton.setEnabled(false);
        nextButton.setEnabled(true);
    }

    private JRadioButton createOptionRadio(String text) {
        JRadioButton radio = new JRadioButton(text);
        radio.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        radio.setBackground(new Color(30, 41, 59));
        radio.setForeground(Color.WHITE);
        radio.setFocusPainted(false);
        radio.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(51, 65, 85), 1),
                BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));
        return radio;
    }

    private void setOptionsEnabled(boolean enabled) {
        radioA.setEnabled(enabled);
        radioB.setEnabled(enabled);
        radioC.setEnabled(enabled);
        radioD.setEnabled(enabled);
    }

    private void setQuestionText(String text) {
        questionTextPane.setText("<html><body style='font-family: sans-serif; color: #f8fafc; font-size: 13px;'> " +
                "<b>" + escapeHtml(text) + "</b></body></html>");
    }

    private void setFeedbackText(String text) {
        feedbackPane.setText("<html><body style='font-family: sans-serif; color: #cbd5e1; font-size: 12px;'> " +
                text + "</body></html>");
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
