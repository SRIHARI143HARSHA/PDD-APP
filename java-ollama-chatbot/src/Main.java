import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import ui.MainFrame;

/**
 * Main application entrypoint for the Java AI Chatbot & Tutor application.
 */
public class Main {
    public static void main(String[] args) {
        // Enable system native look and feel if available
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        // Launch Desktop UI on Swing Event Dispatch Thread
        SwingUtilities.invokeLater(() -> {
            MainFrame frame = new MainFrame();
            frame.setVisible(true);
        });
    }
}
