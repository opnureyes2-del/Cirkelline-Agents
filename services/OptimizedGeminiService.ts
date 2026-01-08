// CIRKELLINE - OPTIMIZED GEMINI SERVICE
// File: services/OptimizedGeminiService.ts
// Artifact #1 - Gemini API with cache, retry, health check

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// CONFIGURATION
// ============================================

interface GeminiConfig {
  apiKey: string;
  model: 'gemini-pro' | 'gemini-pro-vision';
  temperature?: number;
  maxTokens?: number;
}

// ============================================
// OPTIMIZED GEMINI SERVICE
// ============================================

export class OptimizedGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: GeminiConfig;
  private isInitialized: boolean = false;
  private cache: Map<string, { response: string; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private requestCount: number = 0;
  private errorCount: number = 0;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.model || 'gemini-pro',
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxTokens || 1024,
      },
    });
    this.isInitialized = true;
    console.log('✅ OptimizedGeminiService initialized');
  }

  // ============================================
  // CACHED GENERATION
  // ============================================

  async generateWithCache(prompt: string): Promise<string> {
    const cacheKey = this.hashPrompt(prompt);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Cache hit');
      return cached.response;
    }

    // Generate new response
    const response = await this.generateWithRetry(prompt);

    // Cache response
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now(),
    });

    return response;
  }

  // ============================================
  // RETRY LOGIC
  // ============================================

  async generateWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        this.requestCount++;
        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        return response;
      } catch (error: any) {
        lastError = error;
        this.errorCount++;
        console.warn(`⚠️ Attempt ${attempt + 1} failed:`, error.message);

        // Exponential backoff
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  // ============================================
  // HELPERS
  // ============================================

  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  getMetrics(): { requests: number; errors: number; cacheSize: number } {
    return {
      requests: this.requestCount,
      errors: this.errorCount,
      cacheSize: this.cache.size,
    };
  }

  parseError(error: any): string {
    if (error.message?.includes('quota')) {
      return 'API quota exceeded. Try again later.';
    }
    if (error.message?.includes('safety')) {
      return 'Response blocked by safety filters.';
    }
    if (error.message?.includes('429')) {
      return 'Rate limit exceeded. Waiting...';
    }
    return error.message || 'Unknown error occurred';
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: any;
  }> {
    try {
      const startTime = Date.now();
      await this.model.generateContent('test');
      const responseTime = Date.now() - startTime;

      const metrics = this.getMetrics();

      return {
        status: responseTime < 3000 ? 'healthy' : 'degraded',
        details: {
          responseTime,
          ...metrics,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: this.parseError(error) },
      };
    }
  }
}

// ============================================
// FACTORY
// ============================================

export function createOptimizedGeminiService(apiKey: string): OptimizedGeminiService {
  return new OptimizedGeminiService({
    apiKey,
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 1024,
  });
}

export default OptimizedGeminiService;
