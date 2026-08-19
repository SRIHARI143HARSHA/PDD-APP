import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { generateWeatherAlerts } from '../utils/weatherAlertEngine';

const quickQuestions = [
  { icon: 'rainy-outline', text: 'What should I do during heavy rain?', color: '#0EA5E9' },
  { icon: 'thunderstorm-outline', text: 'What should I do during a thunderstorm?', color: '#DC2626' },
  { icon: 'medical-outline', text: 'What should I keep in an emergency kit?', color: '#10B981' },
  { icon: 'thermometer-outline', text: 'How do I prepare for extreme heat?', color: '#F97316' },
  { icon: 'water-outline', text: 'What should I do during a flood?', color: '#2563EB' },
];

/**
 * Render Markdown content cleanly (Headings, Bold, Bullet points, Code blocks).
 */
const SimpleMarkdownRenderer = React.memo(({ content, colors, isDark }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockBuffer = [];

  lines.forEach((line, index) => {
    // Code block toggle (```)
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <View
            key={`code-${index}`}
            style={[
              styles.codeBlockContainer,
              { backgroundColor: isDark ? '#090D16' : '#F1F5F9', borderColor: colors.border },
            ]}
          >
            <Text style={[styles.codeBlockText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
              {codeBlockBuffer.join('\n')}
            </Text>
          </View>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <Text key={`h1-${index}`} style={[styles.heading1, { color: colors.text }]}>
          {line.replace('# ', '')}
        </Text>
      );
      return;
    }
    if (line.startsWith('## ') || line.startsWith('### ')) {
      elements.push(
        <Text key={`h2-${index}`} style={[styles.heading2, { color: colors.text }]}>
          {line.replace(/###?\s/, '')}
        </Text>
      );
      return;
    }

    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().replace(/^[-*]\s/, '');
      elements.push(
        <View key={`bullet-${index}`} style={styles.bulletRow}>
          <Text style={[styles.bulletDot, { color: colors.subtext }]}>•</Text>
          <Text style={[styles.bulletText, { color: colors.text }]}>
            {renderBoldFormattedText(bulletText)}
          </Text>
        </View>
      );
      return;
    }

    // Standard Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <Text key={`p-${index}`} style={[styles.paragraph, { color: colors.text }]}>
          {renderBoldFormattedText(line)}
        </Text>
      );
    }
  });

  return <View style={styles.markdownWrapper}>{elements}</View>;
});

/**
 * Format **bold** inline text.
 */
function renderBoldFormattedText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '800' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}

/**
 * Memoized Chat Message Item component to prevent unnecessary re-rendering.
 */
const ChatMessageItem = React.memo(({ item, colors, isDark, copiedId, onCopy, onRegenerate }) => {
  const isUser = item.sender === 'user';
  const isCopied = copiedId === item.id;

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
        {isUser ? (
          <Text style={[styles.messageText, { color: colors.userText }]}>{item.text}</Text>
        ) : (
          <View>
            <SimpleMarkdownRenderer content={item.text} colors={colors} isDark={isDark} />

            {/* Per-Message Action Bar (Copy & Regenerate) shown after completion */}
            {!item.isStreaming && item.text && (
              <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => onCopy(item.id, item.text)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isCopied ? 'checkmark-circle' : 'copy-outline'}
                    size={14}
                    color={isCopied ? '#10B981' : colors.subtext}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: isCopied ? '#10B981' : colors.subtext, fontWeight: isCopied ? '800' : '600' },
                    ]}
                  >
                    {isCopied ? '✓ Copied' : '📋 Copy'}
                  </Text>
                </TouchableOpacity>

                {onRegenerate && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => onRegenerate()}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="refresh-outline" size={14} color={colors.subtext} />
                    <Text style={[styles.actionBtnText, { color: colors.subtext }]}>🔄 Regenerate</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
});

export default function ChatbotScreen() {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('●');
  const [chat, setChat] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [unavailableError, setUnavailableError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);

  const flatListRef = useRef(null);
  const pendingTextRef = useRef('');
  const batchTimerRef = useRef(null);
  const lastUserQueryRef = useRef('');

  // Fetch real-time weather & alerts context for the chatbot
  const fetchWeatherContext = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=13.0281&longitude=80.0158&current_weather=true&hourly=relative_humidity_2m,precipitation`
      );
      const data = await res.json();
      if (data && data.current_weather) {
        const cw = data.current_weather;
        const currentHour = new Date().getHours();
        const humidity = data.hourly?.relative_humidity_2m?.[currentHour] || 65;
        const rainfall = data.hourly?.precipitation?.[currentHour] || 0;

        const wObj = {
          location: 'Thandalam, Chennai',
          temp: Math.round(cw.temperature),
          feelsLike: Math.round(cw.temperature + (humidity > 70 ? 2 : 0)),
          windSpeed: Math.round(cw.windspeed),
          humidity: humidity,
          rainfall: Math.round(rainfall * 10) / 10,
          condition: cw.weathercode >= 95 ? 'Thunderstorm' : cw.weathercode >= 51 ? 'Rain' : 'Normal',
          weathercode: cw.weathercode,
        };

        setCurrentWeather(wObj);
        setActiveAlerts(generateWeatherAlerts(wObj));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchWeatherContext();
  }, [fetchWeatherContext]);

  // Animate loading dots
  useEffect(() => {
    let interval;
    if (loading) {
      let count = 1;
      interval = setInterval(() => {
        count = (count % 3) + 1;
        setDots('● '.repeat(count).trim());
      }, 350);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCopy = async (msgId, rawText) => {
    try {
      if (Clipboard && typeof Clipboard.setStringAsync === 'function') {
        await Clipboard.setStringAsync(rawText);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(rawText);
      }
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (e) {}
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || message).trim();
    if (!query || loading) return;

    lastUserQueryRef.current = query;
    setUnavailableError(null);

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    const updatedChat = [...chat, userMsg];
    setChat(updatedChat);
    setMessage('');

    // Immediately show 🤖 Analyzing...
    setLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    let hasReceivedFirstToken = false;
    pendingTextRef.current = '';

    // Clear any previous batch timer
    if (batchTimerRef.current) {
      clearInterval(batchTimerRef.current);
      batchTimerRef.current = null;
    }

    try {
      const res = await askChatbot(
        query,
        {
          currentWeather: currentWeather,
          activeAlerts: activeAlerts,
          conversationHistory: updatedChat.slice(-6),
        },
        (chunkToken, fullTextSoFar) => {
          pendingTextRef.current = fullTextSoFar;

          // On first streaming token: hide Analyzing indicator & add bot message
          if (!hasReceivedFirstToken) {
            hasReceivedFirstToken = true;
            setLoading(false);

            setChat((prev) => [
              ...prev,
              {
                id: botMsgId,
                sender: 'bot',
                text: fullTextSoFar,
                isStreaming: true,
              },
            ]);

            // Start 70ms buffered rendering loop
            batchTimerRef.current = setInterval(() => {
              const currentText = pendingTextRef.current;
              setChat((prev) =>
                prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: currentText } : msg))
              );
            }, 70);
          }
        }
      );

      // Stop batch update timer upon completion
      if (batchTimerRef.current) {
        clearInterval(batchTimerRef.current);
        batchTimerRef.current = null;
      }

      const finalReply = typeof res === 'string' ? res : (res && res.response ? res.response : null);

      if ((res && res.success) || finalReply) {
        const textToSet = finalReply || pendingTextRef.current || 'I am ready to assist you.';

        if (!hasReceivedFirstToken) {
          setLoading(false);
          setChat((prev) => [
            ...prev,
            {
              id: botMsgId,
              sender: 'bot',
              text: textToSet,
              isStreaming: false,
            },
          ]);
        } else {
          // Mark streaming completed for action buttons to render
          setChat((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: textToSet, isStreaming: false } : msg
            )
          );
        }
      } else {
        setLoading(false);
        setUnavailableError((res && res.message) || 'AI assistant is currently unavailable.');
      }
    } catch (e) {
      if (batchTimerRef.current) {
        clearInterval(batchTimerRef.current);
        batchTimerRef.current = null;
      }
      setLoading(false);
      setUnavailableError('AI assistant is currently unavailable. Please try again.');
    }
  };

  const handleRegenerate = () => {
    if (lastUserQueryRef.current && !loading) {
      handleSend(lastUserQueryRef.current);
    }
  };

  const clearChat = () => {
    setChat([]);
    setUnavailableError(null);
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <View style={styles.mainWrapper}>
        {/* Header Title & Subtitle */}
        <View style={styles.headerArea}>
          <View style={styles.headerRowTop}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={16} color="#2563EB" />
              <Text style={styles.aiBadgeText}>AI Emergency Safety</Text>
            </View>
            {chat.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearChat} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={16} color={colors.subtext} />
                <Text style={[styles.clearBtnText, { color: colors.subtext }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Disaster AI Assistant</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Ask me about disaster safety and preparedness.
          </Text>
        </View>

        {/* Unavailable Error Banner with Retry */}
        {unavailableError && (
          <View style={[styles.errorCard, { backgroundColor: isDark ? '#450A0A' : '#FEF2F2', borderColor: '#EF4444' }]}>
            <Ionicons name="alert-circle" size={22} color="#EF4444" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.errorTitle, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                {unavailableError}
              </Text>
              <Text style={[styles.errorSub, { color: isDark ? '#FEE2E2' : '#7F1D1D' }]}>
                Check that Ollama and the backend server are running.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => handleSend(chat[chat.length - 1]?.text || 'What should I do during heavy rain?')}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Conversation List or Quick Questions Grid */}
        {chat.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#0B1C33' : '#EFF6FF' }]}>
              <Ionicons name="shield-checkmark" size={44} color="#2563EB" />
            </View>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>How can I help you prepare today?</Text>
            <Text style={[styles.emptyStateSub, { color: colors.subtext }]}>
              Select a quick question below or type your safety question.
            </Text>

            <View style={styles.promptsGrid}>
              {quickQuestions.map((item, idx) => (
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
            renderItem={({ item }) => (
              <ChatMessageItem
                item={item}
                colors={colors}
                isDark={isDark}
                copiedId={copiedId}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
              />
            )}
          />
        )}

        {/* Immediate 🤖 Analyzing... Loading Indicator */}
        {loading && (
          <View style={styles.typingContainer}>
            <View style={styles.botAvatar}>
              <Ionicons name="hardware-chip-outline" size={18} color="#FFFFFF" />
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.botBubble, borderColor: colors.border }]}>
              <View style={styles.typingHeaderRow}>
                <Text style={styles.typingTitleText}>🤖 Analyzing...</Text>
                <Text style={styles.animatedDotsText}>{dots}</Text>
              </View>
              <View style={styles.typingMessageRow}>
                <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={[styles.typingStatusText, { color: colors.subtext }]}>Generating AI response...</Text>
              </View>
            </View>
          </View>
        )}

        {/* Floating Message Input Bar */}
        <View style={[styles.composerWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TextInput
            placeholder="Ask about disaster safety & emergency procedures..."
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
    marginBottom: 14,
  },
  headerRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  aiBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
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
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  errorSub: {
    fontSize: 11,
    marginTop: 1,
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateSub: {
    fontSize: 13,
    marginBottom: 20,
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
    maxWidth: '84%',
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
  markdownWrapper: {
    gap: 6,
  },
  heading1: {
    fontSize: 16,
    fontWeight: '900',
    marginVertical: 4,
  },
  heading2: {
    fontSize: 14,
    fontWeight: '800',
    marginVertical: 3,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  bulletDot: {
    fontSize: 14,
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  codeBlockContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 6,
  },
  codeBlockText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12.5,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  typingBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 200,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  typingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typingTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  animatedDotsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 2,
  },
  typingMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  typingStatusText: {
    fontSize: 12,
    fontWeight: '600',
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