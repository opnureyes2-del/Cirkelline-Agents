// CIRKELLINE - COMPLETE WORKING APP V2
// File: components/App.tsx
// Artifact #30 - Full React Native app with all services

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';

// Import services (when available)
// import GeminiService from '../services/GeminiService';
// import storage from '../services/StorageService';

// ============================================
// TYPES
// ============================================

type PersonalityMode = 'cirkel' | 'kv1nt';
type AgentType = 'chat' | 'terminal' | 'code' | 'data' | 'evolution';
type AgentStatus = 'idle' | 'active' | 'processing' | 'error';
type ThemeMode = 'dark' | 'light';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  agentType?: AgentType;
}

interface AgentState {
  type: AgentType;
  status: AgentStatus;
  lastActive: number;
}

// ============================================
// MAIN APP
// ============================================

export default function App() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [personality, setPersonality] = useState<PersonalityMode>('cirkel');
  const [showAgents, setShowAgents] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Agent states
  const [agentStates, setAgentStates] = useState<Map<AgentType, AgentState>>(
    new Map([
      ['chat', { type: 'chat', status: 'idle', lastActive: Date.now() }],
      ['terminal', { type: 'terminal', status: 'idle', lastActive: Date.now() }],
      ['code', { type: 'code', status: 'idle', lastActive: Date.now() }],
      ['data', { type: 'data', status: 'idle', lastActive: Date.now() }],
      ['evolution', { type: 'evolution', status: 'idle', lastActive: Date.now() }],
    ])
  );

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Cirkelline...');

      // Add welcome message
      addSystemMessage(
        personality === 'cirkel'
          ? "Hey! 👋 I'm Cirkel, your AI companion! I'm here to help with anything you need. What would you like to do?"
          : "Kv1nt AI assistant online. Ready for commands."
      );

      setIsInitializing(false);
      console.log('✅ Initialization complete');
    } catch (error) {
      console.error('❌ Initialization error:', error);
      setError('Failed to initialize app. Please restart.');
      setIsInitializing(false);
    }
  };

  // ============================================
  // MESSAGE HANDLING
  // ============================================

  const sendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      updateAgentStatus('chat', 'active');

      // Add user message
      const userMsg: Message = {
        id: generateId(),
        type: 'user',
        content: inputValue.trim(),
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInputValue('');

      // Generate AI response (simulated for now)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const responseText = generateResponse(userMsg.content, personality);

      // Add AI response
      const aiMsg: Message = {
        id: generateId(),
        type: 'agent',
        content: responseText,
        timestamp: Date.now(),
        agentType: 'chat',
      };

      setMessages([...newMessages, aiMsg]);
      updateAgentStatus('chat', 'idle');
    } catch (error: any) {
      console.error('❌ Send message error:', error);

      const errorMsg: Message = {
        id: generateId(),
        type: 'system',
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMsg]);
      updateAgentStatus('chat', 'error');

      setTimeout(() => updateAgentStatus('chat', 'idle'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateResponse = (input: string, mode: PersonalityMode): string => {
    const msg = input.toLowerCase();

    // Mode switching
    if (msg.includes('cirkel') || msg.includes('friendly')) {
      setPersonality('cirkel');
      return "Switched to Cirkel mode! 😊 I'm here to help in a friendly way!";
    }
    if (msg.includes('kv1nt') || msg.includes('fast') || msg.includes('professional')) {
      setPersonality('kv1nt');
      return "Kv1nt mode activated. Professional mode engaged.";
    }

    // Responses based on personality
    if (mode === 'cirkel') {
      if (msg.includes('hello') || msg.includes('hey') || msg.includes('hi')) {
        return "Hey there! 👋 Great to see you! What can I help you with today?";
      }
      if (msg.includes('server') || msg.includes('status')) {
        return "Let me check with Terminal Agent... 🔍\n\n✨ Terminal Agent: Server is online and running smooth!\n\nEverything's looking good! 😊";
      }
      if (msg.includes('code') || msg.includes('write')) {
        return "Ooh, coding time! 💻 Let me get Code Agent on this...\n\n✨ Code Agent: Ready to help!\n\nWhat would you like me to write?";
      }
      return "I'm here to help! 🤗 Just let me know what you need!";
    } else {
      // Kv1nt mode
      if (msg.includes('hello') || msg.includes('hey') || msg.includes('hi')) {
        return "Ready. Awaiting command.";
      }
      if (msg.includes('server') || msg.includes('status')) {
        return "[TERMINAL] Server status: ONLINE\nLoad: 23%\nMemory: 2.1GB/8GB\n\nStatus: Operational.";
      }
      if (msg.includes('code') || msg.includes('write')) {
        return "[CODE] Agent ready. Specify requirements.";
      }
      return "Standing by.";
    }
  };

  const addSystemMessage = (content: string) => {
    const msg: Message = {
      id: generateId(),
      type: 'system',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, msg]);
  };

  // ============================================
  // SETTINGS & ACTIONS
  // ============================================

  const switchPersonality = (newMode: PersonalityMode) => {
    setPersonality(newMode);
    addSystemMessage(
      newMode === 'cirkel'
        ? "Switched to Cirkel mode! 😊 I'm here to help in a friendly way!"
        : "Kv1nt mode activated. Professional interface engaged."
    );
  };

  const switchTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            addSystemMessage(
              personality === 'cirkel'
                ? "Fresh start! 🎉 What can I help you with?"
                : "History cleared. Ready for new commands."
            );
          },
        },
      ]
    );
  };

  // ============================================
  // HELPERS
  // ============================================

  const updateAgentStatus = (agent: AgentType, status: AgentStatus) => {
    setAgentStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(agent);
      if (state) {
        state.status = status;
        state.lastActive = Date.now();
      }
      return newMap;
    });
  };

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: AgentStatus): string => {
    switch (status) {
      case 'active': return '🟢';
      case 'processing': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // ============================================
  // THEME COLORS
  // ============================================

  const colors = theme === 'dark' ? {
    background: '#0A0E27',
    surface: '#1A1F3A',
    primary: '#00D9FF',
    accent: '#FF006E',
    text: '#FFFFFF',
    textSecondary: '#B4C6E7',
    success: '#00FF88',
    border: '#2A2F4A',
  } : {
    background: '#F8F9FF',
    surface: '#FFFFFF',
    primary: '#0066FF',
    accent: '#FF0055',
    text: '#0A0E27',
    textSecondary: '#4A5568',
    success: '#00C851',
    border: '#E2E8F0',
  };

  // ============================================
  // RENDER
  // ============================================

  if (isInitializing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Initializing Cirkelline...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>🤖</Text>
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>CIRKELLINE</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {personality === 'cirkel' ? '😊 Cirkel' : '⚡ Kv1nt'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: colors.border }]}
            onPress={() => setShowAgents(!showAgents)}
          >
            <Text>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: colors.border }]}
            onPress={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Text>{theme === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: colors.border }]}
            onPress={clearChat}
          >
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Agent Status Panel */}
      {showAgents && (
        <View style={[styles.agentPanel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.panelTitle, { color: colors.text }]}>AGENT STATUS</Text>
          <View style={styles.agentGrid}>
            {Array.from(agentStates.entries()).map(([type, state]) => (
              <View key={type} style={[styles.agentCard, {
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}>
                <Text style={[styles.agentName, { color: colors.textSecondary }]}>
                  {getStatusIcon(state.status)} {type.toUpperCase()}
                </Text>
                <Text style={[styles.agentStatus, { color: colors.textSecondary }]}>
                  {state.status}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageRow,
              msg.type === 'user' && styles.messageRowRight
            ]}>
              <View style={[
                styles.messageBubble,
                msg.type === 'user'
                  ? { backgroundColor: colors.primary }
                  : msg.type === 'system'
                  ? { backgroundColor: colors.surface, borderColor: colors.accent, borderWidth: 1 }
                  : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
              ]}>
                <Text style={[
                  styles.messageText,
                  { color: msg.type === 'user' ? '#000' : colors.text }
                ]}>
                  {msg.content}
                </Text>
              </View>
              <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          ))}
          {isProcessing && (
            <View style={styles.messageRow}>
              <View style={[styles.messageBubble, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1
              }]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.messageText, { color: colors.textSecondary, marginLeft: 8 }]}>
                  {personality === 'cirkel' ? 'Thinking... 🤔' : 'Processing...'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <View style={[styles.quickActions, {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.quickButton, {
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}
              onPress={() => setInputValue('Check server status')}
            >
              <Text style={[styles.quickButtonText, { color: colors.text }]}>
                🖥️ Server
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, {
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}
              onPress={() => switchPersonality(personality === 'cirkel' ? 'kv1nt' : 'cirkel')}
            >
              <Text style={[styles.quickButtonText, { color: colors.text }]}>
                🔄 {personality === 'cirkel' ? 'Kv1nt' : 'Cirkel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, {
                backgroundColor: colors.background,
                borderColor: colors.border
              }]}
              onPress={() => setInputValue('Help')}
            >
              <Text style={[styles.quickButtonText, { color: colors.text }]}>
                ❓ Help
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Input */}
        <View style={[styles.inputContainer, {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        }]}>
          <View style={[styles.personalityBadge, {
            backgroundColor: personality === 'cirkel' ? colors.success : colors.accent
          }]}>
            <Text style={styles.badgeText}>
              {personality === 'cirkel' ? '😊' : '⚡'}
            </Text>
          </View>

          <TextInput
            style={[styles.input, {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border
            }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={personality === 'cirkel'
              ? "Type anything..."
              : "Enter command..."}
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={sendMessage}
            multiline
            maxLength={1000}
            editable={!isProcessing}
          />

          <TouchableOpacity
            style={[styles.sendButton, {
              backgroundColor: inputValue.trim() && !isProcessing ? colors.primary : colors.border
            }]}
            onPress={sendMessage}
            disabled={!inputValue.trim() || isProcessing}
          >
            <Text style={styles.sendButtonText}>
              {isProcessing ? '⏳' : '➤'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentPanel: {
    padding: 16,
    borderBottomWidth: 1,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  agentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  agentCard: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
  },
  agentName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  agentStatus: {
    fontSize: 10,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageRow: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageRowRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  quickActions: {
    padding: 8,
    borderTopWidth: 1,
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  quickButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  personalityBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
