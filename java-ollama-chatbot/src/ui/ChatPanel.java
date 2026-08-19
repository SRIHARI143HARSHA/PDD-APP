package ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JTextPane;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;

/**
 * ChatPanel provides the main interactive chat user interface with message history,
 * text input box, Enter key submission, clear chat, and animated loading state.
 */
public class ChatPanel extends JPanel {

    private final JTextPane chatTextPane;
    private final JTextField inputField;
    private final JButton sendButton;
    private final JButton clearButton;
    private final JLabel statusLabel;
    private final StringBuilder chatHtmlBuilder;

    private MessageSendListener listener;

    public interface MessageSendListener {
        void onSendMessage(String message);
        void onClearChat();
    }

    public ChatPanel() {
        setLayout(new BorderLayout(10, 10));
        setBackground(new Color(15, 23, 42)); // Slate dark background
        setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));

        // Chat HTML formatting builder
        chatHtmlBuilder = new StringBuilder();
        chatHtmlBuilder.append("<html><head><style>")
                .append("body { font-family: 'Segoe UI', sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 10px; } ")
                .append(".user-msg { background-color: #1e40af; color: #ffffff; padding: 10px; border-radius: 12px; margin-bottom: 12px; margin-left: 50px; } ")
                .append(".ai-msg { background-color: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 12px; margin-bottom: 12px; margin-right: 50px; border: 1px solid #334155; } ")
                .append(".sys-msg { background-color: #451a03; color: #fde68a; padding: 8px; border-radius: 8px; margin-bottom: 10px; font-size: 11px; text-align: center; } ")
                .append("pre { background-color: #020617; color: #38bdf8; padding: 10px; border-radius: 8px; border: 1px solid #1e293b; font-family: Consolas, monospace; overflow-x: auto; } ")
                .append(".sender { font-weight: bold; font-size: 12px; margin-bottom: 4px; color: #94a3b8; } ")
                .append("</style></head><body>");

        // Main Chat Display Area
        chatTextPane = new JTextPane();
        chatTextPane.setContentType("text/html");
        chatTextPane.setEditable(false);
        chatTextPane.setBackground(new Color(15, 23, 42));
        updateChatDisplay();

        JScrollPane scrollPane = new JScrollPane(chatTextPane);
        scrollPane.setBorder(BorderFactory.createLineBorder(new Color(51, 65, 85), 1));
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);
        add(scrollPane, BorderLayout.CENTER);

        // Bottom Controls Container (Status + Input Bar)
        JPanel bottomContainer = new JPanel();
        bottomContainer.setLayout(new BoxLayout(bottomContainer, BoxLayout.Y_AXIS));
        bottomContainer.setBackground(new Color(15, 23, 42));

        // Loading/Status Bar
        statusLabel = new JLabel("🤖 Ready to assist you with Java programming.");
        statusLabel.setFont(new Font("Segoe UI", Font.BOLD, 12));
        statusLabel.setForeground(new Color(56, 189, 248));
        statusLabel.setBorder(BorderFactory.createEmptyBorder(4, 4, 8, 4));
        statusLabel.setAlignmentX(LEFT_ALIGNMENT);
        bottomContainer.add(statusLabel);

        // Input Controls Panel
        JPanel inputPanel = new JPanel(new BorderLayout(8, 0));
        inputPanel.setBackground(new Color(15, 23, 42));
        inputPanel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 44));

        inputField = new JTextField();
        inputField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        inputField.setBackground(new Color(30, 41, 59));
        inputField.setForeground(Color.WHITE);
        inputField.setCaretColor(Color.WHITE);
        inputField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(71, 85, 105), 1),
                BorderFactory.createEmptyBorder(8, 12, 8, 12)
        ));

        // Pressing ENTER sends message
        inputField.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    dispatchSendMessage();
                }
            }
        });

        // Send Button
        sendButton = new JButton("Send Message ↵");
        sendButton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        sendButton.setBackground(new Color(37, 99, 235));
        sendButton.setForeground(Color.WHITE);
        sendButton.setFocusPainted(false);
        sendButton.setBorder(BorderFactory.createEmptyBorder(8, 16, 8, 16));
        sendButton.addActionListener(e -> dispatchSendMessage());

        // Clear Chat Button
        clearButton = new JButton("Clear Chat 🗑️");
        clearButton.setFont(new Font("Segoe UI", Font.BOLD, 12));
        clearButton.setBackground(new Color(71, 85, 105));
        clearButton.setForeground(Color.WHITE);
        clearButton.setFocusPainted(false);
        clearButton.setBorder(BorderFactory.createEmptyBorder(8, 12, 8, 12));
        clearButton.addActionListener(e -> {
            clearChatView();
            if (listener != null) listener.onClearChat();
        });

        JPanel buttonBox = new JPanel(new BorderLayout(6, 0));
        buttonBox.setBackground(new Color(15, 23, 42));
        buttonBox.add(sendButton, BorderLayout.CENTER);
        buttonBox.add(clearButton, BorderLayout.EAST);

        inputPanel.add(inputField, BorderLayout.CENTER);
        inputPanel.add(buttonBox, BorderLayout.EAST);

        bottomContainer.add(inputPanel);
        add(bottomContainer, BorderLayout.SOUTH);
    }

    public void setMessageSendListener(MessageSendListener listener) {
        this.listener = listener;
    }

    public void appendUserMessage(String userText) {
        String formatted = escapeHtml(userText).replace("\n", "<br>");
        chatHtmlBuilder.append("<div class='user-msg'>")
                .append("<div class='sender'>👤 You</div>")
                .append(formatted)
                .append("</div>");
        updateChatDisplay();
    }

    public void appendAiMessage(String aiResponse) {
        String formatted = formatCodeBlocksInHtml(escapeHtml(aiResponse));
        chatHtmlBuilder.append("<div class='ai-msg'>")
                .append("<div class='sender'>🤖 Java AI Tutor (Ollama)</div>")
                .append(formatted)
                .append("</div>");
        updateChatDisplay();
    }

    public void appendSystemMessage(String sysText) {
        chatHtmlBuilder.append("<div class='sys-msg'>ℹ️ ")
                .append(escapeHtml(sysText))
                .append("</div>");
        updateChatDisplay();
    }

    public void showLoadingState(String statusText) {
        inputField.setEnabled(false);
        sendButton.setEnabled(false);
        statusLabel.setText("⏳ " + statusText);
        statusLabel.setForeground(new Color(251, 146, 60));
    }

    public void hideLoadingState() {
        inputField.setEnabled(true);
        sendButton.setEnabled(true);
        inputField.requestFocusInWindow();
        statusLabel.setText("🟢 Ready to assist you with Java programming.");
        statusLabel.setForeground(new Color(56, 189, 248));
    }

    public void setInputText(String text) {
        inputField.setText(text);
        inputField.requestFocusInWindow();
    }

    public void clearChatView() {
        chatHtmlBuilder.setLength(0);
        chatHtmlBuilder.append("<html><head><style>")
                .append("body { font-family: 'Segoe UI', sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 10px; } ")
                .append(".user-msg { background-color: #1e40af; color: #ffffff; padding: 10px; border-radius: 12px; margin-bottom: 12px; margin-left: 50px; } ")
                .append(".ai-msg { background-color: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 12px; margin-bottom: 12px; margin-right: 50px; border: 1px solid #334155; } ")
                .append(".sys-msg { background-color: #451a03; color: #fde68a; padding: 8px; border-radius: 8px; margin-bottom: 10px; font-size: 11px; text-align: center; } ")
                .append("pre { background-color: #020617; color: #38bdf8; padding: 10px; border-radius: 8px; border: 1px solid #1e293b; font-family: Consolas, monospace; overflow-x: auto; } ")
                .append(".sender { font-weight: bold; font-size: 12px; margin-bottom: 4px; color: #94a3b8; } ")
                .append("</style></head><body>");
        updateChatDisplay();
    }

    private void dispatchSendMessage() {
        String text = inputField.getText().trim();
        if (!text.isEmpty() && listener != null) {
            inputField.setText("");
            listener.onSendMessage(text);
        }
    }

    private void updateChatDisplay() {
        String fullHtml = chatHtmlBuilder.toString() + "</body></html>";
        chatTextPane.setText(fullHtml);
        SwingUtilities.invokeLater(() -> chatTextPane.setCaretPosition(chatTextPane.getDocument().getLength()));
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private String formatCodeBlocksInHtml(String htmlEscapedText) {
        String text = htmlEscapedText.replace("\n", "<br>");

        // Replace ```java ... ``` or ``` ... ``` code blocks with <pre>...</pre>
        text = text.replaceAll("```java<br>", "<pre>")
                   .replaceAll("```<br>", "<pre>")
                   .replaceAll("```", "</pre>");

        return text;
    }
}
