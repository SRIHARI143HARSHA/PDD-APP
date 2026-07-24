import { Ionicons } from '@expo/vector-icons';
import { useContext, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { askChatbot } from '../services/chatbotService';

const suggestedPrompts = [
  { icon: 'water-outline', text: 'What should I do during a flood?', color: '#2563EB' },
  { icon: 'home-outline', text: 'How do I prepare for an earthquake?', color: '#F97316' },
  { icon: 'flame-outline', text: 'What should I include in a fire escape plan?', color: '#EF4444' },
  { icon: 'thunderstorm-outline', text: 'How should I prepare for a cyclone?', color: '#0D9488' },
];

export default function ChatbotScreen() {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState('Thinking...');
  const [chat, setChat] = useState([]);
  const flatListRef = useRef(null);

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        botBubble: '#0F1C2E',
        botText: '#E6EEF8',
        userBubble: '#2563EB',
        userText: '#FFFFFF',
        inputBg: '#0B1629',
        promptBg: '#0B1C33',
        promptBorder: '#1E3A8A',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        botBubble: '#FFFFFF',
        botText: '#0F172A',
        userBubble: '#2563EB',
        userText: '#FFFFFF',
        inputBg: '#FFFFFF',
        promptBg: '#FFFFFF',
        promptBorder: '#E2E8F0',
      };

  const handleSend = async (textToSend) => {
    const query = (textToSend || message).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    // Stage 1 (0.0s - 1.8s): "Thinking..."
    setThinkingText('Thinking...');

    // Stage 2 (1.8s - 3.6s): "Analyzing..."
    const timer1 = setTimeout(() => setThinkingText('Analyzing...'), 1800);

    try {
      // Promise.all enforces realistic 3.6s delay using ONLY two loading words
      const [reply] = await Promise.all([
        askChatbot(query),
        new Promise((resolve) => setTimeout(resolve, 3600)),
      ]);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply || 'I am ready to assist you with disaster preparedness guidelines.',
      };
      setChat((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Unable to connect to AI assistant. Please check your internet connection and try again.',
      };
      setChat((prev) => [...prev, botMsg]);
    } finally {
      clearTimeout(timer1);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <View style={styles.mainWrapper}>
        {/* Header Title & Subtitle */}
        <View style={styles.headerArea}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={18} color="#2563EB" />
            <Text style={styles.aiBadgeText}>AI Safety Assistant</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Disaster Preparedness AI</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Get instant preparedness guidance for floods, earthquakes, fires, cyclones, and tsunamis.
          </Text>
        </View>

        {/* Empty State / Suggested Prompts */}
        {chat.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#0B1C33' : '#EFF6FF' }]}>
              <Ionicons name="shield-checkmark" size={44} color="#2563EB" />
            </View>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>How can I help you prepare today?</Text>
            <Text style={[styles.emptyStateSub, { color: colors.subtext }]}>
              Select a suggested topic below or type your question in the box.
            </Text>

            <View style={styles.promptsGrid}>
              {suggestedPrompts.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.promptCard, { backgroundColor: colors.promptBg, borderColor: colors.promptBorder }]}
                  onPress={() => handleSend(item.text)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.promptIconWrap, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.promptText, { color: colors.text }]}>{item.text}</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.subtext} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chat}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatListContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => {
              const isUser = item.sender === 'user';
              return (
                <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
                  {!isUser && (
                    <View style={styles.botAvatar}>
                      <Ionicons name="hardware-chip-outline" size={18} color="#FFFFFF" />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? { backgroundColor: colors.userBubble }
                        : [styles.botBubbleShadow, { backgroundColor: colors.botBubble, borderColor: colors.border }],
                    ]}
                  >
                    <Text style={[styles.messageText, { color: isUser ? colors.userText : colors.botText }]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Loading / Typing State with 3.6s Delay Using Only 2 Words: "Thinking..." & "Analyzing..." */}
        {loading && (
          <View style={styles.typingContainer}>
            <View style={styles.botAvatar}>
              <Ionicons name="hardware-chip-outline" size={18} color="#FFFFFF" />
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.botBubble, borderColor: colors.border }]}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={[styles.typingText, { color: colors.subtext }]}>{thinkingText}</Text>
            </View>
          </View>
        )}

        {/* Floating Composer */}
        <View style={[styles.composerWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TextInput
            placeholder="Ask about disaster preparedness..."
            placeholderTextColor={colors.subtext}
            style={[styles.input, { color: colors.text }]}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: message.trim() ? '#2563EB' : colors.border }]}
            onPress={() => handleSend()}
            disabled={!message.trim() || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
    gap: 6,
  },
  aiBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 600,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateSub: {
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center',
  },
  promptsGrid: {
    width: '100%',
    maxWidth: 700,
    gap: 10,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  promptIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  chatListContent: {
    paddingVertical: 10,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
  },
  botBubbleShadow: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  composerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});