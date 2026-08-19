package ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.SwingConstants;

/**
 * QuickActionsPanel provides quick-action shortcut buttons for OOP concepts,
 * code generation presets, and quick tutoring prompts.
 */
public class QuickActionsPanel extends JPanel {

    public interface ActionSelectListener {
        void onActionSelected(String promptText, String taskCategory);
    }

    private ActionSelectListener listener;

    public QuickActionsPanel() {
        setLayout(new BorderLayout(10, 10));
        setBackground(new Color(15, 23, 42));
        setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));

        // Header Title
        JLabel titleLabel = new JLabel("📚 Quick Learning Shortcuts & Pre-built Topics");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 0));
        add(titleLabel, BorderLayout.NORTH);

        // Main Grid Panel
        JPanel gridContainer = new JPanel(new GridLayout(0, 2, 12, 12));
        gridContainer.setBackground(new Color(15, 23, 42));

        // Category 1: Object-Oriented Programming (OOP)
        addCategorySection(gridContainer, "🧬 OOP Core Concepts", new String[][]{
            {"Classes & Objects", "Explain Classes and Objects in Java with code examples."},
            {"Inheritance", "Explain Inheritance in Java ('extends' keyword) with a simple example."},
            {"Polymorphism", "Explain Method Overriding and Overloading (Polymorphism) in Java."},
            {"Encapsulation", "Explain Encapsulation (getters/setters, private fields) in Java."},
            {"Abstraction", "Explain Abstract Classes and Interfaces (Abstraction) in Java."}
        });

        // Category 2: Code Generation Presets
        addCategorySection(gridContainer, "💻 Program Generator Presets", new String[][]{
            {"Hello World App", "Write a complete Java program for Hello World with detailed comments."},
            {"Array Sorting App", "Write a Java program to sort an array of numbers using Bubble Sort."},
            {"Bank Account Class", "Create a Java BankAccount class with deposit, withdraw, and balance methods."},
            {"Student Grading App", "Write a Java program to calculate student grades based on score ranges."},
            {"Calculator App", "Write a simple Java CLI Calculator program supporting +, -, *, and /."}
        });

        // Category 3: Assignments & Practical Exercises
        addCategorySection(gridContainer, "📝 Assignment Questions", new String[][]{
            {"Beginner Exercises", "Generate 3 beginner Java exercises on loops and conditionals."},
            {"Intermediate Exercises", "Generate 3 intermediate Java exercises on OOP and ArrayLists."},
            {"Advanced Exercises", "Generate 3 advanced Java exercises on Multithreading and Exceptions."}
        });

        JScrollPane scrollPane = new JScrollPane(gridContainer);
        scrollPane.setBorder(null);
        scrollPane.getVerticalScrollBar().setUnitIncrement(14);
        add(scrollPane, BorderLayout.CENTER);
    }

    public void setActionSelectListener(ActionSelectListener listener) {
        this.listener = listener;
    }

    private void addCategorySection(JPanel container, String categoryTitle, String[][] items) {
        JPanel sectionPanel = new JPanel(new BorderLayout(0, 6));
        sectionPanel.setBackground(new Color(30, 41, 59));
        sectionPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(51, 65, 85), 1),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        JLabel catHeader = new JLabel(categoryTitle);
        catHeader.setFont(new Font("Segoe UI", Font.BOLD, 13));
        catHeader.setForeground(new Color(56, 189, 248));
        sectionPanel.add(catHeader, BorderLayout.NORTH);

        JPanel itemsPanel = new JPanel(new GridLayout(0, 1, 4, 6));
        itemsPanel.setBackground(new Color(30, 41, 59));

        for (String[] item : items) {
            String labelName = item[0];
            String promptText = item[1];

            JButton btn = new JButton("▶ " + labelName);
            btn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            btn.setHorizontalAlignment(SwingConstants.LEFT);
            btn.setBackground(new Color(15, 23, 42));
            btn.setForeground(Color.WHITE);
            btn.setFocusPainted(false);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
            btn.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(new Color(71, 85, 105), 1),
                    BorderFactory.createEmptyBorder(6, 10, 6, 10)
            ));

            btn.addActionListener(e -> {
                if (listener != null) {
                    listener.onActionSelected(promptText, categoryTitle);
                }
            });

            itemsPanel.add(btn);
        }

        sectionPanel.add(itemsPanel, BorderLayout.CENTER);
        container.add(sectionPanel);
    }
}
