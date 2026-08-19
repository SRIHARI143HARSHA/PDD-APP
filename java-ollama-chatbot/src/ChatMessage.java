import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ChatMessage class representing an individual chat message in the session.
 */
public class ChatMessage {
    public enum Role {
        USER,
        AI,
        SYSTEM
    }

    private final Role role;
    private final String sender;
    private final String content;
    private final String timestamp;

    public ChatMessage(Role role, String sender, String content) {
        this.role = role;
        this.sender = sender;
        this.content = content;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public Role getRole() {
        return role;
    }

    public String getSender() {
        return sender;
    }

    public String getContent() {
        return content;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
