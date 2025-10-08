/**
 * Bot Detection Logging Utility
 *
 * Centralized logging for bot detection attempts with structured data.
 * Supports multiple output targets (console, file, database).
 */

import {
  getBotDetectionConfig,
  BotDetectionReason,
  type BotDetectionResult,
} from '@/config/botDetection';

/**
 * In-memory store for bot detection attempts (last 1000).
 * In production, this should be replaced with persistent storage.
 */
const botDetectionLog: BotDetectionResult[] = [];
const MAX_LOG_SIZE = 1000;

/**
 * Log a bot detection attempt with structured data.
 */
export function logBotDetection(
  reason: BotDetectionReason,
  details: Record<string, unknown>,
  email?: string
): void {
  const config = getBotDetectionConfig();

  if (!config.logging.enabled) {
    return;
  }

  const result: BotDetectionResult = {
    isBot: true,
    reason,
    details,
    timestamp: Date.now(),
    email: email ? hashEmail(email) : undefined, // Hash for privacy
  };

  // Store in memory (replace with database in production)
  botDetectionLog.push(result);
  if (botDetectionLog.length > MAX_LOG_SIZE) {
    botDetectionLog.shift(); // Remove oldest
  }

  // Console logging
  if (config.logging.console) {
    const logMessage = `[BOT DETECTED] ${reason}`;
    const logData = {
      reason,
      details,
      timestamp: new Date(result.timestamp).toISOString(),
    };

    switch (config.logging.level) {
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      case 'info':
      default:
        console.info(logMessage, logData);
        break;
    }
  }

  // TODO: Persistent storage (database, file, or external service)
  // if (config.logging.persistent) {
  //   await storeBotDetectionLog(result);
  // }
}

/**
 * Log a legitimate submission for comparison metrics.
 */
export function logLegitimateSubmission(
  details: Record<string, unknown>
): void {
  const config = getBotDetectionConfig();

  if (!config.logging.enabled) {
    return;
  }

  const result: BotDetectionResult = {
    isBot: false,
    details,
    timestamp: Date.now(),
  };

  // Store in memory
  botDetectionLog.push(result);
  if (botDetectionLog.length > MAX_LOG_SIZE) {
    botDetectionLog.shift();
  }

  // Optional: Log successful submissions at info level
  if (config.logging.console && config.logging.level === 'info') {
    console.info('[LEGITIMATE SUBMISSION]', {
      details,
      timestamp: new Date(result.timestamp).toISOString(),
    });
  }
}

/**
 * Get bot detection statistics for monitoring.
 */
export function getBotDetectionStats(): {
  total: number;
  botAttempts: number;
  legitimateSubmissions: number;
  botPercentage: number;
  reasonBreakdown: Record<string, number>;
  recentAttempts: BotDetectionResult[];
} {
  const total = botDetectionLog.length;
  const botAttempts = botDetectionLog.filter((log) => log.isBot).length;
  const legitimateSubmissions = total - botAttempts;
  const botPercentage = total > 0 ? (botAttempts / total) * 100 : 0;

  // Count by reason
  const reasonBreakdown: Record<string, number> = {};
  botDetectionLog.forEach((log) => {
    if (log.isBot && log.reason) {
      reasonBreakdown[log.reason] = (reasonBreakdown[log.reason] || 0) + 1;
    }
  });

  // Get last 50 attempts
  const recentAttempts = botDetectionLog.slice(-50);

  return {
    total,
    botAttempts,
    legitimateSubmissions,
    botPercentage: Math.round(botPercentage * 100) / 100,
    reasonBreakdown,
    recentAttempts,
  };
}

/**
 * Clear bot detection logs (admin only).
 */
export function clearBotDetectionLogs(): void {
  botDetectionLog.length = 0;
}

/**
 * Simple email hashing for privacy-preserving tracking.
 * Prevents storing PII while allowing repeat offender detection.
 */
function hashEmail(email: string): string {
  // Simple hash - in production use crypto.subtle.digest or similar
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Export logs for analysis (CSV format).
 */
export function exportBotDetectionLogs(): string {
  const header = 'Timestamp,IsBot,Reason,Details\n';
  const rows = botDetectionLog.map((log) => {
    const timestamp = new Date(log.timestamp).toISOString();
    const isBot = log.isBot ? 'TRUE' : 'FALSE';
    const reason = log.reason || 'N/A';
    const details = JSON.stringify(log.details || {}).replace(/"/g, '""'); // Escape quotes
    return `${timestamp},${isBot},${reason},"${details}"`;
  });

  return header + rows.join('\n');
}
