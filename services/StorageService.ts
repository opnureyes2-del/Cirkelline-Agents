// CIRKELLINE - REAL STORAGE SERVICE
// File: services/StorageService.ts
// Artifact #28 - AsyncStorage + Keychain for secure credentials

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

// ============================================
// TYPES
// ============================================

export interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  agentType?: string;
}

export interface ServerConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authMethod: 'password' | 'key';
  nickname?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  personality: 'cirkel' | 'kv1nt';
  notifications: boolean;
  autoSave: boolean;
  maxHistory: number;
}

export interface SecureCredentials {
  geminiApiKey?: string;
  anthropicApiKey?: string;
  sshPrivateKey?: string;
  serverPasswords: Record<string, string>;
}

// ============================================
// STORAGE SERVICE
// ============================================

export class StorageService {
  private static instance: StorageService;

  // Storage keys
  private readonly KEYS = {
    MESSAGES: '@cirkelline:messages',
    SETTINGS: '@cirkelline:settings',
    SERVERS: '@cirkelline:servers',
    LAST_SYNC: '@cirkelline:last_sync',
    USER_PROFILE: '@cirkelline:user_profile',
  };

  // Secure storage service identifier
  private readonly KEYCHAIN_SERVICE = 'com.cirkelline.credentials';

  private constructor() {}

  // Singleton pattern
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // ============================================
  // MESSAGE STORAGE
  // ============================================

  async saveMessages(messages: Message[]): Promise<boolean> {
    try {
      // Keep only last 1000 messages to prevent storage bloat
      const messagesToSave = messages.slice(-1000);

      await AsyncStorage.setItem(
        this.KEYS.MESSAGES,
        JSON.stringify(messagesToSave)
      );

      console.log(`✅ Saved ${messagesToSave.length} messages`);
      return true;
    } catch (error) {
      console.error('❌ Error saving messages:', error);
      return false;
    }
  }

  async loadMessages(): Promise<Message[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.MESSAGES);

      if (!data) {
        console.log('ℹ️ No saved messages found');
        return [];
      }

      const messages = JSON.parse(data);
      console.log(`✅ Loaded ${messages.length} messages`);
      return messages;
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      return [];
    }
  }

  async clearMessages(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.KEYS.MESSAGES);
      console.log('✅ Messages cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing messages:', error);
      return false;
    }
  }

  async addMessage(message: Message): Promise<boolean> {
    try {
      const messages = await this.loadMessages();
      messages.push(message);
      return await this.saveMessages(messages);
    } catch (error) {
      console.error('❌ Error adding message:', error);
      return false;
    }
  }

  // ============================================
  // SETTINGS STORAGE
  // ============================================

  async saveSettings(settings: AppSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.SETTINGS,
        JSON.stringify(settings)
      );

      console.log('✅ Settings saved');
      return true;
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      return false;
    }
  }

  async loadSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.SETTINGS);

      if (!data) {
        // Return default settings
        const defaultSettings: AppSettings = {
          theme: 'dark',
          personality: 'cirkel',
          notifications: true,
          autoSave: true,
          maxHistory: 1000,
        };

        // Save defaults
        await this.saveSettings(defaultSettings);
        return defaultSettings;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      // Return default settings on error
      return {
        theme: 'dark',
        personality: 'cirkel',
        notifications: true,
        autoSave: true,
        maxHistory: 1000,
      };
    }
  }

  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<boolean> {
    try {
      const settings = await this.loadSettings();
      settings[key] = value;
      return await this.saveSettings(settings);
    } catch (error) {
      console.error('❌ Error updating setting:', error);
      return false;
    }
  }

  // ============================================
  // SERVER CONFIGURATION STORAGE
  // ============================================

  async saveServers(servers: ServerConfig[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.SERVERS,
        JSON.stringify(servers)
      );

      console.log(`✅ Saved ${servers.length} server configs`);
      return true;
    } catch (error) {
      console.error('❌ Error saving servers:', error);
      return false;
    }
  }

  async loadServers(): Promise<ServerConfig[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.SERVERS);

      if (!data) {
        return [];
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading servers:', error);
      return [];
    }
  }

  async addServer(server: ServerConfig): Promise<boolean> {
    try {
      const servers = await this.loadServers();

      // Check if server with same ID exists
      const existingIndex = servers.findIndex(s => s.id === server.id);

      if (existingIndex >= 0) {
        // Update existing
        servers[existingIndex] = server;
      } else {
        // Add new
        servers.push(server);
      }

      return await this.saveServers(servers);
    } catch (error) {
      console.error('❌ Error adding server:', error);
      return false;
    }
  }

  async deleteServer(serverId: string): Promise<boolean> {
    try {
      const servers = await this.loadServers();
      const filtered = servers.filter(s => s.id !== serverId);
      return await this.saveServers(filtered);
    } catch (error) {
      console.error('❌ Error deleting server:', error);
      return false;
    }
  }

  // ============================================
  // SECURE CREDENTIALS STORAGE (Keychain)
  // ============================================

  async saveSecureCredential(
    key: string,
    value: string
  ): Promise<boolean> {
    try {
      await Keychain.setGenericPassword(
        key,
        value,
        {
          service: `${this.KEYCHAIN_SERVICE}.${key}`,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );

      console.log(`✅ Saved secure credential: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving credential ${key}:`, error);
      return false;
    }
  }

  async loadSecureCredential(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${this.KEYCHAIN_SERVICE}.${key}`,
      });

      if (credentials) {
        return credentials.password;
      }

      return null;
    } catch (error) {
      console.error(`❌ Error loading credential ${key}:`, error);
      return null;
    }
  }

  async deleteSecureCredential(key: string): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: `${this.KEYCHAIN_SERVICE}.${key}`,
      });

      console.log(`✅ Deleted secure credential: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting credential ${key}:`, error);
      return false;
    }
  }

  // Convenience methods for common credentials
  async saveGeminiApiKey(apiKey: string): Promise<boolean> {
    return await this.saveSecureCredential('gemini_api_key', apiKey);
  }

  async loadGeminiApiKey(): Promise<string | null> {
    return await this.loadSecureCredential('gemini_api_key');
  }

  async saveSSHKey(privateKey: string): Promise<boolean> {
    return await this.saveSecureCredential('ssh_private_key', privateKey);
  }

  async loadSSHKey(): Promise<string | null> {
    return await this.loadSecureCredential('ssh_private_key');
  }

  async saveServerPassword(serverId: string, password: string): Promise<boolean> {
    return await this.saveSecureCredential(`server_password_${serverId}`, password);
  }

  async loadServerPassword(serverId: string): Promise<string | null> {
    return await this.loadSecureCredential(`server_password_${serverId}`);
  }

  // ============================================
  // BULK OPERATIONS
  // ============================================

  async exportAllData(): Promise<string> {
    try {
      const messages = await this.loadMessages();
      const settings = await this.loadSettings();
      const servers = await this.loadServers();

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        messages,
        settings,
        servers: servers.map(s => ({
          ...s,
          // Don't export passwords/keys
          password: undefined,
          privateKey: undefined,
        })),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);

      if (data.messages) {
        await this.saveMessages(data.messages);
      }

      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      if (data.servers) {
        await this.saveServers(data.servers);
      }

      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.MESSAGES,
        this.KEYS.SETTINGS,
        this.KEYS.SERVERS,
        this.KEYS.LAST_SYNC,
        this.KEYS.USER_PROFILE,
      ]);

      console.log('✅ All data cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing all data:', error);
      return false;
    }
  }

  // ============================================
  // SYNC TRACKING
  // ============================================

  async updateLastSync(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this.KEYS.LAST_SYNC,
        new Date().toISOString()
      );
      return true;
    } catch (error) {
      console.error('❌ Error updating last sync:', error);
      return false;
    }
  }

  async getLastSync(): Promise<Date | null> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.LAST_SYNC);
      return data ? new Date(data) : null;
    } catch (error) {
      console.error('❌ Error getting last sync:', error);
      return null;
    }
  }

  // ============================================
  // STORAGE INFO
  // ============================================

  async getStorageInfo(): Promise<{
    messageCount: number;
    serverCount: number;
    lastSync: Date | null;
    hasApiKey: boolean;
  }> {
    try {
      const messages = await this.loadMessages();
      const servers = await this.loadServers();
      const lastSync = await this.getLastSync();
      const apiKey = await this.loadGeminiApiKey();

      return {
        messageCount: messages.length,
        serverCount: servers.length,
        lastSync,
        hasApiKey: !!apiKey,
      };
    } catch (error) {
      console.error('❌ Error getting storage info:', error);
      return {
        messageCount: 0,
        serverCount: 0,
        lastSync: null,
        hasApiKey: false,
      };
    }
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export default StorageService.getInstance();
