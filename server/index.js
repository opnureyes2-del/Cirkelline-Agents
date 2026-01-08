// CIRKELLINE - WEBSOCKET SSH PROXY SERVER
// File: server/index.js
// Artifact #29 - Deploy this on cirkelline.com

const WebSocket = require('ws');
const { Client } = require('ssh2');
const express = require('express');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  PORT: process.env.PORT || 8080,
  HTTPS_PORT: process.env.HTTPS_PORT || 8443,
  MAX_CLIENTS: 100,
  AUTH_TIMEOUT: 30000, // 30 seconds
  COMMAND_TIMEOUT: 300000, // 5 minutes
  MAX_OUTPUT_SIZE: 10 * 1024 * 1024, // 10MB

  // SSL/TLS certificates (for production)
  SSL_CERT: process.env.SSL_CERT_PATH,
  SSL_KEY: process.env.SSL_KEY_PATH,

  // Security
  ALLOWED_COMMANDS: [
    'ls', 'pwd', 'whoami', 'date', 'uptime', 'hostname',
    'cat', 'less', 'head', 'tail', 'grep', 'find',
    'ps', 'top', 'htop', 'df', 'free', 'du',
    'systemctl status', 'docker ps', 'docker images',
    'netstat', 'ss', 'ip addr',
  ],

  DANGEROUS_COMMANDS: [
    'rm -rf', 'dd', 'mkfs', 'format',
    'shutdown', 'reboot', 'halt', 'poweroff',
    'chmod 777', 'chown root',
  ],
};

// ============================================
// EXPRESS APP (for health checks, etc.)
// ============================================

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    clients: wss.clients.size,
    memory: process.memoryUsage(),
  });
});

app.get('/', (req, res) => {
  res.send('Cirkelline SSH Proxy Server - Running');
});

// ============================================
// WEBSOCKET SERVER
// ============================================

const server = app.listen(CONFIG.PORT, () => {
  console.log(`🚀 HTTP server running on port ${CONFIG.PORT}`);
});

const wss = new WebSocket.Server({ server });

// Client connection tracking
const clients = new Map();

// ============================================
// CLIENT SESSION MANAGEMENT
// ============================================

class ClientSession {
  constructor(ws, clientId) {
    this.ws = ws;
    this.clientId = clientId;
    this.sshClient = null;
    this.authenticated = false;
    this.serverConfig = null;
    this.commandQueue = [];
    this.activeStream = null;
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
  }

  // Connect to SSH server
  async connectSSH(config) {
    return new Promise((resolve, reject) => {
      this.sshClient = new Client();

      const connectionConfig = {
        host: config.host,
        port: config.port || 22,
        username: config.username,
        readyTimeout: 30000,
      };

      // Add authentication method
      if (config.authMethod === 'password') {
        connectionConfig.password = config.password;
      } else if (config.authMethod === 'key') {
        connectionConfig.privateKey = config.privateKey;
      }

      this.sshClient
        .on('ready', () => {
          console.log(`✅ SSH connected for client ${this.clientId}`);
          this.authenticated = true;
          this.serverConfig = config;
          resolve(true);
        })
        .on('error', (err) => {
          console.error(`❌ SSH error for client ${this.clientId}:`, err);
          reject(err);
        })
        .on('close', () => {
          console.log(`🔌 SSH disconnected for client ${this.clientId}`);
          this.authenticated = false;
        })
        .connect(connectionConfig);
    });
  }

  // Execute command
  async executeCommand(command) {
    if (!this.authenticated || !this.sshClient) {
      throw new Error('Not authenticated');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Command timeout'));
      }, CONFIG.COMMAND_TIMEOUT);

      this.sshClient.exec(command, (err, stream) => {
        if (err) {
          clearTimeout(timeout);
          return reject(err);
        }

        let stdout = '';
        let stderr = '';
        let outputSize = 0;

        stream
          .on('data', (data) => {
            const chunk = data.toString();
            outputSize += chunk.length;

            // Prevent memory issues from huge outputs
            if (outputSize > CONFIG.MAX_OUTPUT_SIZE) {
              stream.close();
              return reject(new Error('Output size exceeded limit'));
            }

            stdout += chunk;

            // Stream to client in real-time
            this.send({
              type: 'command_output',
              data: chunk,
              finished: false,
            });
          })
          .stderr.on('data', (data) => {
            stderr += data.toString();
          });

        stream.on('close', (code) => {
          clearTimeout(timeout);
          this.lastActivity = Date.now();

          resolve({
            stdout,
            stderr,
            exitCode: code,
            timestamp: Date.now(),
          });
        });
      });
    });
  }

  // Send message to client
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Disconnect
  disconnect() {
    if (this.sshClient) {
      this.sshClient.end();
    }
    this.ws.close();
  }
}

// ============================================
// MESSAGE HANDLERS
// ============================================

const messageHandlers = {
  // Authenticate and connect to SSH server
  connect: async (session, data) => {
    try {
      const { host, port, username, authMethod, password, privateKey } = data;

      // Validate
      if (!host || !username) {
        throw new Error('Missing required fields: host, username');
      }

      // Connect
      await session.connectSSH({
        host,
        port: port || 22,
        username,
        authMethod,
        password,
        privateKey,
      });

      session.send({
        type: 'connect_response',
        success: true,
        message: `Connected to ${host}`,
      });
    } catch (error) {
      session.send({
        type: 'connect_response',
        success: false,
        error: error.message,
      });
    }
  },

  // Execute command
  execute: async (session, data) => {
    try {
      if (!session.authenticated) {
        throw new Error('Not authenticated. Connect first.');
      }

      const { command } = data;

      if (!command) {
        throw new Error('No command provided');
      }

      // Security check
      const safety = checkCommandSafety(command);
      if (!safety.safe) {
        throw new Error(`Dangerous command blocked: ${safety.reason}`);
      }

      console.log(`🖥️  Executing: ${command}`);

      // Execute
      const result = await session.executeCommand(command);

      // Send final result
      session.send({
        type: 'command_result',
        success: true,
        command,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        timestamp: result.timestamp,
      });
    } catch (error) {
      session.send({
        type: 'command_result',
        success: false,
        error: error.message,
      });
    }
  },

  // Upload file
  upload: async (session, data) => {
    try {
      if (!session.authenticated) {
        throw new Error('Not authenticated');
      }

      const { content, remotePath } = data;

      session.sshClient.sftp((err, sftp) => {
        if (err) throw err;

        const writeStream = sftp.createWriteStream(remotePath);
        writeStream.write(content);
        writeStream.end();

        writeStream.on('finish', () => {
          session.send({
            type: 'upload_response',
            success: true,
            path: remotePath,
          });
        });
      });
    } catch (error) {
      session.send({
        type: 'upload_response',
        success: false,
        error: error.message,
      });
    }
  },

  // Download file
  download: async (session, data) => {
    try {
      if (!session.authenticated) {
        throw new Error('Not authenticated');
      }

      const { remotePath } = data;

      session.sshClient.sftp((err, sftp) => {
        if (err) throw err;

        sftp.readFile(remotePath, (err, data) => {
          if (err) {
            return session.send({
              type: 'download_response',
              success: false,
              error: err.message,
            });
          }

          session.send({
            type: 'download_response',
            success: true,
            content: data.toString('base64'),
            path: remotePath,
          });
        });
      });
    } catch (error) {
      session.send({
        type: 'download_response',
        success: false,
        error: error.message,
      });
    }
  },

  // Disconnect
  disconnect: async (session) => {
    session.disconnect();
    session.send({
      type: 'disconnect_response',
      success: true,
    });
  },

  // Ping (keep-alive)
  ping: async (session) => {
    session.send({ type: 'pong', timestamp: Date.now() });
  },
};

// ============================================
// SECURITY CHECKS
// ============================================

function checkCommandSafety(command) {
  const cmd = command.toLowerCase().trim();

  // Check for dangerous commands
  for (const dangerous of CONFIG.DANGEROUS_COMMANDS) {
    if (cmd.includes(dangerous)) {
      return {
        safe: false,
        reason: `Contains dangerous pattern: ${dangerous}`,
      };
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    '>;',        // Command chaining
    '|rm',       // Pipe to rm
    '&&',        // AND operator
    '$()',       // Command substitution
    '`',         // Backtick execution
    'curl.*sh',  // Download and execute
    'wget.*sh',  // Download and execute
  ];

  for (const pattern of suspiciousPatterns) {
    if (new RegExp(pattern).test(cmd)) {
      return {
        safe: false,
        reason: `Contains suspicious pattern: ${pattern}`,
      };
    }
  }

  return { safe: true };
}

// ============================================
// WEBSOCKET CONNECTION HANDLER
// ============================================

wss.on('connection', (ws, req) => {
  const clientId = crypto.randomBytes(16).toString('hex');
  const clientIP = req.socket.remoteAddress;

  console.log(`📱 New client connected: ${clientId} from ${clientIP}`);

  // Check max clients
  if (clients.size >= CONFIG.MAX_CLIENTS) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Server at maximum capacity',
    }));
    ws.close();
    return;
  }

  // Create session
  const session = new ClientSession(ws, clientId);
  clients.set(clientId, session);

  // Send welcome
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    serverVersion: '1.0.0',
    timestamp: Date.now(),
  }));

  // Handle messages
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const handler = messageHandlers[data.type];

      if (!handler) {
        ws.send(JSON.stringify({
          type: 'error',
          message: `Unknown message type: ${data.type}`,
        }));
        return;
      }

      await handler(session, data);
    } catch (error) {
      console.error('Message handling error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message,
      }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log(`🔌 Client disconnected: ${clientId}`);
    session.disconnect();
    clients.delete(clientId);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${clientId}:`, error);
  });
});

// ============================================
// CLEANUP & MAINTENANCE
// ============================================

// Clean up idle connections
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes

  for (const [clientId, session] of clients) {
    if (now - session.lastActivity > timeout) {
      console.log(`🧹 Cleaning up idle session: ${clientId}`);
      session.disconnect();
      clients.delete(clientId);
    }
  }
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');

  for (const [clientId, session] of clients) {
    session.send({
      type: 'server_shutdown',
      message: 'Server is shutting down',
    });
    session.disconnect();
  }

  wss.close(() => {
    server.close(() => {
      console.log('✅ Server shut down');
      process.exit(0);
    });
  });
});

console.log(`
╔═══════════════════════════════════════╗
║   CIRKELLINE SSH PROXY SERVER         ║
║   Running on port ${CONFIG.PORT}              ║
║   WebSocket endpoint: ws://localhost:${CONFIG.PORT}  ║
╚═══════════════════════════════════════╝
`);

// ============================================
// EXPORTS (for testing)
// ============================================

module.exports = { wss, app, CONFIG };
