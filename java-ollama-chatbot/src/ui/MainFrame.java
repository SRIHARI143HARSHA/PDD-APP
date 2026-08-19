package ui;

import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.SwingWorker;

import model.ChatManager;
import model.ChatMessage;
import model.OllamaClient;
import model.PromptManager;
import model.QuizManager;

/**
 * MainFrame provides the main desktop window for the Java AI Tutor application.
 * Manages mode switching, sidebar navigation, Ollama connection health checks,
 * and asynchronous background tasks.
 */
public class MainFrame extends JFrame {

    private final OllamaClient ollamaClient;
    private final ChatManager chatManager;
    private final QuizManager quizManager;

    private JLabel statusBadgeLabel;
    private final CardLayout cardLayout;
    private final JPanel cardsContainer;

    private final ChatPanel chatPanel;
    private final QuickActionsPanel quickActionsPanel;
    private final QuizPanel quizPanel;

    private String currentMode = "GENERAL_CHAT";

    public MainFrame() {
        super("Java AI Tutor & Code Assistant (Ollama llama3.2)");

        this.ollamaClient = new OllamaClient();
        this.chatManager = new ChatManager();
        this.quizManager = new QuizManager();

        setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        setSize(1100, 750);
        setMinimumSize(new Dimension(900, 600));
        setLocationRelativeTo(null);

        // Safe window close handler
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                confirmSafeExit();
            }
        });

        // Top Navigation Header
        JPanel topHeader = createHeaderPanel();

        // Left Sidebar Modes Menu
        JPanel sidebar = createSidebarPanel();

        // Main Center Content Cards Container (CardLayout)
        cardLayout = new CardLayout();
        cardsContainer = new JPanel(cardLayout);
        cardsContainer.setBackground(new Color(15, 23, 42));

        // 1. Chat View Component
        chatPanel = new ChatPanel();
        chatPanel.setMessageSendListener(new ChatPanel.MessageSendListener() {
            @Override
            public void onSendMessage(String userMessage) {
                handleUserChatMessage(userMessage);
            }

            @Override
            public void onClearChat() {
                chatManager.clearHistory();
                chatPanel.appendSystemMessage("Chat history cleared for current session.");
            }
        });

        // 2. Quick Actions View Component
        quickActionsPanel = new QuickActionsPanel();
        quickActionsPanel.setActionSelectListener((promptText, category) -> {
            cardLayout.show(cardsContainer, "CHAT_VIEW");
            chatPanel.setInputText(promptText);
        });

        // 3. Quiz View Component
        quizPanel = new QuizPanel();
        quizPanel.setQuizListener(topic -> generateNextQuizQuestion(topic));

        cardsContainer.add(chatPanel, "CHAT_VIEW");
        cardsContainer.add(quickActionsPanel, "QUICK_VIEW");
        cardsContainer.add(quizPanel, "QUIZ_VIEW");

        // Layout Assembly
        getContentPane().setLayout(new BorderLayout());
        getContentPane().add(topHeader, BorderLayout.NORTH);
        getContentPane().add(sidebar, BorderLayout.WEST);
        getContentPane().add(cardsContainer, BorderLayout.CENTER);

        // Initial Connection Status Check
        checkOllamaConnectionStatus();
    }

    private JPanel createHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout(10, 0));
        header.setBackground(new Color(30, 41, 59));
        header.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(51, 65, 85)),
                BorderFactory.createEmptyBorder(12, 16, 12, 16)
        ));

        JLabel titleLabel = new JLabel("☕ Java AI Tutor & Assistant");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLabel.setForeground(Color.WHITE);

        JLabel subLabel = new JLabel("Powered by Local Ollama (llama3.2 API)");
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        subLabel.setForeground(new Color(148, 163, 184));

        JPanel titleBox = new JPanel();
        titleBox.setLayout(new BoxLayout(titleBox, BoxLayout.Y_AXIS));
        titleBox.setBackground(new Color(30, 41, 59));
        titleBox.add(titleLabel);
        titleBox.add(subLabel);

        // Connection Status Badge
        statusBadgeLabel = new JLabel("🔍 Checking Ollama...");
        statusBadgeLabel.setFont(new Font("Segoe UI", Font.BOLD, 12));
        statusBadgeLabel.setForeground(new Color(251, 146, 60));
        statusBadgeLabel.setCursor(new Cursor(Cursor.HAND_CURSOR));
        statusBadgeLabel.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                checkOllamaConnectionStatus();
            }
        });

        header.add(titleBox, BorderLayout.WEST);
        header.add(statusBadgeLabel, BorderLayout.EAST);
        return header;
    }

    private JPanel createSidebarPanel() {
        JPanel sidebar = new JPanel();
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBackground(new Color(30, 41, 59));
        sidebar.setPreferredSize(new Dimension(210, 0));
        sidebar.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 0, 1, new Color(51, 65, 85)),
                BorderFactory.createEmptyBorder(12, 10, 12, 10)
        ));

        JLabel menuHeader = new JLabel("FEATURE MODES");
        menuHeader.setFont(new Font("Segoe UI", Font.BOLD, 11));
        menuHeader.setForeground(new Color(148, 163, 184));
        menuHeader.setAlignmentX(LEFT_ALIGNMENT);
        sidebar.add(menuHeader);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));

        sidebar.add(createSidebarButton("💬 General Chat", () -> setMode("GENERAL_CHAT")));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("📚 Java Tutor", () -> {
            setMode("JAVA_TUTOR");
            chatPanel.setInputText("Explain OOP concepts in Java with code examples.");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("💻 Code Generator", () -> {
            setMode("CODE_GENERATOR");
            chatPanel.setInputText("Write a Java program to sort an array using Bubble Sort.");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("🔍 Code Explainer", () -> {
            setMode("CODE_EXPLAINER");
            chatPanel.setInputText("Explain how 'public static void main(String[] args)' works line by line.");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("🛠️ Error Fixer", () -> {
            setMode("ERROR_FIXER");
            chatPanel.setInputText("Fix this error: 'NullPointerException' in String name = null; System.out.println(name.length());");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("📝 Assignments", () -> {
            setMode("ASSIGNMENTS");
            chatPanel.setInputText("Generate 3 beginner Java assignment exercises on loops and conditionals.");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("🧩 Quiz Mode", () -> {
            setMode("QUIZ_MODE");
            cardLayout.show(cardsContainer, "QUIZ_VIEW");
            generateNextQuizQuestion("Java Fundamentals");
        }));
        sidebar.add(Box.createRigidArea(new Dimension(0, 6)));

        sidebar.add(createSidebarButton("⚡ Quick Shortcuts", () -> {
            setMode("SHORTCUTS");
            cardLayout.show(cardsContainer, "QUICK_VIEW");
        }));

        sidebar.add(Box.createVerticalGlue());

        JButton exitBtn = createSidebarButton("❌ Exit App", () -> confirmSafeExit());
        exitBtn.setBackground(new Color(153, 27, 27));
        sidebar.add(exitBtn);

        return sidebar;
    }

    private JButton createSidebarButton(String text, Runnable onClick) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setBackground(new Color(15, 23, 42));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setMaximumSize(new Dimension(Integer.MAX_VALUE, 36));
        btn.setAlignmentX(LEFT_ALIGNMENT);
        btn.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(51, 65, 85), 1),
                BorderFactory.createEmptyBorder(6, 12, 6, 12)
        ));

        btn.addActionListener(e -> onClick.run());
        return btn;
    }

    private void setMode(String mode) {
        this.currentMode = mode;
        if (!mode.equals("QUIZ_MODE") && !mode.equals("SHORTCUTS")) {
            cardLayout.show(cardsContainer, "CHAT_VIEW");
        }
    }

    private void handleUserChatMessage(String userText) {
        chatManager.addMessage(ChatMessage.Role.USER, "You", userText);
        chatPanel.appendUserMessage(userText);
        chatPanel.showLoadingState("Ollama (llama3.2) is generating response...");

        String promptToExecute;
        switch (currentMode) {
            case "JAVA_TUTOR":
                promptToExecute = PromptManager.getConceptExplanationPrompt(userText);
                break;
            case "CODE_GENERATOR":
                promptToExecute = PromptManager.getCodeGenerationPrompt(userText);
                break;
            case "CODE_EXPLAINER":
                promptToExecute = PromptManager.getCodeExplanationPrompt(userText);
                break;
            case "ERROR_FIXER":
                promptToExecute = PromptManager.getErrorFixingPrompt(userText);
                break;
            case "ASSIGNMENTS":
                promptToExecute = PromptManager.getAssignmentPrompt("Beginner/Intermediate", userText);
                break;
            default:
                promptToExecute = PromptManager.buildPrompt(null, userText);
                break;
        }

        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() {
                return ollamaClient.generateResponse(promptToExecute);
            }

            @Override
            protected void done() {
                try {
                    String aiResponse = get();
                    chatManager.addMessage(ChatMessage.Role.AI, "Java AI Tutor", aiResponse);
                    chatPanel.appendAiMessage(aiResponse);
                } catch (Exception ex) {
                    chatPanel.appendAiMessage("⚠️ Failed to generate response: " + ex.getMessage());
                } finally {
                    chatPanel.hideLoadingState();
                }
            }
        };

        worker.execute();
    }

    private void generateNextQuizQuestion(String topic) {
        String quizPrompt = PromptManager.getQuizQuestionPrompt(topic);

        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() {
                return ollamaClient.generateResponse(quizPrompt);
            }

            @Override
            protected void done() {
                try {
                    String raw = get();
                    QuizManager.QuizQuestion question = quizManager.parseOllamaQuizResponse(raw);
                    quizPanel.loadQuestion(
                        question.getQuestionText(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC(),
                        question.getOptionD(),
                        question.getCorrectOption(),
                        question.getExplanation()
                    );
                } catch (Exception e) {
                    QuizManager.QuizQuestion fb = quizManager.getFallbackQuestion();
                    quizPanel.loadQuestion(
                        fb.getQuestionText(), fb.getOptionA(), fb.getOptionB(),
                        fb.getOptionC(), fb.getOptionD(), fb.getCorrectOption(), fb.getExplanation()
                    );
                }
            }
        };

        worker.execute();
    }

    private void checkOllamaConnectionStatus() {
        statusBadgeLabel.setText("🔍 Checking Ollama...");
        statusBadgeLabel.setForeground(new Color(251, 146, 60));

        SwingWorker<Boolean, Void> checkWorker = new SwingWorker<>() {
            @Override
            protected Boolean doInBackground() {
                return ollamaClient.isOllamaAvailable();
            }

            @Override
            protected void done() {
                try {
                    boolean isOnline = get();
                    if (isOnline) {
                        statusBadgeLabel.setText("🟢 Ollama Connected (llama3.2)");
                        statusBadgeLabel.setForeground(new Color(74, 222, 128));
                    } else {
                        statusBadgeLabel.setText("🔴 Ollama Offline (Click to Retry)");
                        statusBadgeLabel.setForeground(new Color(248, 113, 113));
                        chatPanel.appendSystemMessage("⚠️ Connection Warning: Unable to reach Ollama at http://localhost:11434. Please verify 'ollama serve' is running.");
                    }
                } catch (Exception e) {
                    statusBadgeLabel.setText("🔴 Connection Error");
                    statusBadgeLabel.setForeground(new Color(248, 113, 113));
                }
            }
        };

        checkWorker.execute();
    }

    private void confirmSafeExit() {
        int choice = JOptionPane.showConfirmDialog(
            this,
            "Are you sure you want to exit the Java AI Tutor application?",
            "Exit Confirmation",
            JOptionPane.YES_NO_OPTION,
            JOptionPane.QUESTION_MESSAGE
        );

        if (choice == JOptionPane.YES_OPTION) {
            dispose();
            System.exit(0);
        }
    }
}
