import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ChatManager handles conversation history for the current session.
 */
public class ChatManager {
    private final List<ChatMessage> messages;

    public ChatManager() {
        this.messages = new ArrayList<>();
    }

    public synchronized void addMessage(ChatMessage.Role role, String sender, String content) {
        messages.add(new ChatMessage(role, sender, content));
    }

    public synchronized List<ChatMessage> getMessages() {
        return Collections.unmodifiableList(new ArrayList<>(messages));
    }

    public synchronized void clearHistory() {
        messages.clear();
    }

    public synchronized String getFormattedHistory() {
        StringBuilder sb = new StringBuilder();
        for (ChatMessage msg : messages) {
            sb.append("[").append(msg.getSender()).append("]: ")
              .append(msg.getContent()).append("\n");
        }
        return sb.toString();
    }
}
