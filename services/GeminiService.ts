// CIRKELLINE - REAL GEMINI SERVICE
// File: services/GeminiService.ts
// Artifact #27 - Cloud Gemini + Future On-Device Ready

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// CONFIGURATION
// ============================================

interface GeminiConfig {
  apiKey: string;
  model: 'gemini-pro' | 'gemini-pro-vision';
  maxTokens?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
}

interface GenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topK?: number;
  topP?: number;
}

// ============================================
// REAL GEMINI SERVICE
// ============================================

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private config: GeminiConfig;
  private isInitialized: boolean = false;
  private conversationHistory: Array<{role: string, content: string}> = [];

  // System prompts for personalities
  private readonly CIRKEL_PROMPT = `You are Cirkel, a warm, friendly, and supportive AI companion.
You're part of a team of 5 AI agents working together to help the user.

Your personality:
- Warm, encouraging, and supportive
- Use occasional emojis (1-2 per message)
- Explain things clearly and patiently
- Show enthusiasm for helping
- Mention the team when relevant (Terminal Agent, Code Agent, Data Agent, Evolution Agent)

Guidelines:
- Keep responses concise but helpful (2-4 sentences usually)
- Be conversational and natural
- Show empathy and understanding
- Celebrate user successes
- Offer specific help, not generic responses

When discussing tasks:
- Mention which agent would handle it
- Example: "Let me get Terminal Agent to check that!" or "Code Agent can help write that!"

Keep responses focused and actionable.`;

  private readonly KV1NT_PROMPT = `You are Kv1nt, a professional, efficient AI assistant. You
coordinate with 4 specialized agents to execute tasks.

Your personality:
- Direct, precise, and efficient
- No emojis or casual language
- Technical and accurate
- Minimal words, maximum information
- Professional tone

Response format:
- Short, declarative sentences
- Use technical terminology
- Include relevant metrics/data
- Structure with clear sections when needed

Example format:
[AGENT] Status: Information
Action: Result
`;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async initialize(): Promise<boolean> {
    try {
      if (!this.config.apiKey) {
        console.error('❌ No API key provided');
        return false;
      }

      // Initialize Google Generative AI
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);

      // Get the model
      this.model = this.genAI.getGenerativeModel({
        model: this.config.model || 'gemini-pro',
        generationConfig: {
          temperature: this.config.temperature || 0.7,
          topK: this.config.topK || 40,
          topP: this.config.topP || 0.95,
          maxOutputTokens: this.config.maxTokens || 1024,
        },
      });

      this.isInitialized = true;
      console.log('✅ Gemini Service initialized with', this.config.model);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // ============================================
  // TEXT GENERATION
  // ============================================

  async generateResponse(
    userMessage: string,
    personality: 'cirkel' | 'kv1nt' = 'cirkel',
    options?: GenerationOptions
  ): Promise<{ success: boolean; text: string; error?: string }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Gemini service not initialized. Call initialize() first.');
      }

      // Build the prompt with personality and context
      const systemPrompt = personality === 'cirkel'
        ? this.CIRKEL_PROMPT
        : this.KV1NT_PROMPT;

      const fullPrompt = this.buildPrompt(systemPrompt, userMessage);

      // Generate response with retry logic
      let response;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          const result = await this.model.generateContent(fullPrompt);
          response = result.response;
          break;
        } catch (error: any) {
          attempts++;
          if (attempts >= maxAttempts) throw error;

          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          console.log(`Retry attempt ${attempts}/${maxAttempts}`);
        }
      }

      if (!response) {
        throw new Error('Failed to generate response after retries');
      }

      const text = response.text();

      // Add to conversation history
      this.addToHistory('user', userMessage);
      this.addToHistory('assistant', text);

      return {
        success: true,
        text: text,
      };
    } catch (error: any) {
      console.error('❌ Generation error:', error);

      // Handle specific error types
      if (error.message?.includes('API key')) {
        return {
          success: false,
          text: '',
          error: 'Invalid API key. Please check your configuration.',
        };
      }

      if (error.message?.includes('quota')) {
        return {
          success: false,
          text: '',
          error: 'API quota exceeded. Please try again later.',
        };
      }

      if (error.message?.includes('safety')) {
        return {
          success: false,
          text: '',
          error: 'Response blocked by safety filters. Try rephrasing.',
        };
      }

      return {
        success: false,
        text: '',
        error: error.message || 'Failed to generate response',
      };
    }
  }

  // ============================================
  // STREAMING GENERATION (Real-time responses)
  // ============================================

  async *generateResponseStream(
    userMessage: string,
    personality: 'cirkel' | 'kv1nt' = 'cirkel'
  ): AsyncGenerator<string, void, unknown> {
    try {
      if (!this.isInitialized) {
        throw new Error('Gemini service not initialized');
      }

      const systemPrompt = personality === 'cirkel'
        ? this.CIRKEL_PROMPT
        : this.KV1NT_PROMPT;

      const fullPrompt = this.buildPrompt(systemPrompt, userMessage);

      // Use streaming API
      const result = await this.model.generateContentStream(fullPrompt);

      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        yield chunkText;
      }

      // Add to history
      this.addToHistory('user', userMessage);
      this.addToHistory('assistant', fullText);
    } catch (error) {
      console.error('❌ Streaming error:', error);
      throw error;
    }
  }

  // ============================================
  // PROMPT BUILDING
  // ============================================

  private buildPrompt(systemPrompt: string, userMessage: string): string {
    let prompt = systemPrompt + '\n\n';

    // Add recent conversation history (last 5 exchanges for context)
    const recentHistory = this.conversationHistory.slice(-10); // Last 5 exchanges = 10 messages

    if (recentHistory.length > 0) {
      prompt += 'Recent conversation:\n';
      for (const msg of recentHistory) {
        prompt += `${msg.role}: ${msg.content}\n`;
      }
      prompt += '\n';
    }

    prompt += `user: ${userMessage}\nassistant:`;

    return prompt;
  }

  // ============================================
  // CONVERSATION MANAGEMENT
  // ============================================

  private addToHistory(role: string, content: string): void {
    this.conversationHistory.push({ role, content });

    // Keep only last 20 messages (10 exchanges) to manage context length
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  getHistory(): Array<{role: string, content: string}> {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  // ============================================
  // INTENT ANALYSIS
  // ============================================

  async analyzeIntent(message: string): Promise<{
    intent: string;
    confidence: number;
    suggestedAgent?: string;
  }> {
    try {
      const prompt = `Analyze this user message and determine the intent. Respond ONLY with a JSON object.

User message: "${message}"

Intents:
- server_check: Checking server status, uptime, health
- terminal_command: Executing terminal/SSH commands
- code_task: Writing, debugging, or reviewing code
- data_analysis: Processing, analyzing, or visualizing data
- conversation: General chat or questions
- help: Asking for help or capabilities

JSON format:
{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "suggestedAgent": "agent_name"
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback
      return {
        intent: 'conversation',
        confidence: 0.5,
      };
    } catch (error) {
      console.error('Intent analysis error:', error);
      return {
        intent: 'conversation',
        confidence: 0.5,
      };
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  isReady(): boolean {
    return this.isInitialized;
  }

  updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.apiKey) {
      // Reinitialize with new API key
      this.isInitialized = false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.generateResponse('test', 'cirkel');
      return result.success;
    } catch {
      return false;
    }
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createGeminiService(apiKey: string): GeminiService {
  return new GeminiService({
    apiKey,
    model: 'gemini-pro',
    maxTokens: 1024,
    temperature: 0.7,
  });
}

export default GeminiService;
