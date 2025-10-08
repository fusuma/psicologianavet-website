/**
 * Bot Detection Configuration
 *
 * Centralized configuration for all bot detection thresholds and settings.
 * Adjust these values based on monitoring data and legitimate user behavior.
 */

export interface BotDetectionConfig {
  /** Temporal validation thresholds (milliseconds) */
  temporal: {
    /** Minimum time between form load and submit (default: 2000ms = 2 seconds) */
    minFormTimeMs: number;
    /** Maximum time between form load and submit (default: 3600000ms = 1 hour) */
    maxFormTimeMs: number;
  };

  /** Behavioral validation thresholds */
  behavioral: {
    /** Minimum number of user interactions required (focus + keystrokes) */
    minInteractionCount: number;
    /** Whether to require focus events on email field */
    requireFocusEvents: boolean;
    /** Whether to require mouse movement detection */
    requireMouseMovement: boolean;
  };

  /** Honeypot validation */
  honeypot: {
    /** Whether honeypot validation is enabled */
    enabled: boolean;
    /** Field names that must remain empty */
    fieldNames: string[];
  };

  /** Logging configuration */
  logging: {
    /** Whether to log bot detection attempts */
    enabled: boolean;
    /** Log level: 'info' | 'warn' | 'error' */
    level: 'info' | 'warn' | 'error';
    /** Whether to log to console */
    console: boolean;
    /** Whether to store logs in database/file (future) */
    persistent: boolean;
  };

  /** CAPTCHA fallback (optional) */
  captcha: {
    /** Whether CAPTCHA fallback is enabled */
    enabled: boolean;
    /** Number of failed attempts before showing CAPTCHA */
    failureThreshold: number;
  };
}

/**
 * Default bot detection configuration.
 * Override via environment variables or admin panel.
 */
export const defaultBotDetectionConfig: BotDetectionConfig = {
  temporal: {
    minFormTimeMs: parseInt(process.env.BOT_MIN_FORM_TIME_MS || '2000', 10),
    maxFormTimeMs: parseInt(process.env.BOT_MAX_FORM_TIME_MS || '3600000', 10),
  },
  behavioral: {
    minInteractionCount: parseInt(process.env.BOT_MIN_INTERACTIONS || '2', 10),
    requireFocusEvents: process.env.BOT_REQUIRE_FOCUS !== 'false', // true by default
    requireMouseMovement: process.env.BOT_REQUIRE_MOUSE !== 'false', // true by default
  },
  honeypot: {
    enabled: process.env.BOT_HONEYPOT_ENABLED !== 'false', // true by default
    fieldNames: ['website', 'phone', 'company'],
  },
  logging: {
    enabled: process.env.BOT_LOGGING_ENABLED !== 'false', // true by default
    level: (process.env.BOT_LOG_LEVEL as 'info' | 'warn' | 'error') || 'warn',
    console: true,
    persistent: false, // Future: store in database
  },
  captcha: {
    enabled: process.env.BOT_CAPTCHA_ENABLED === 'true', // false by default
    failureThreshold: parseInt(process.env.BOT_CAPTCHA_THRESHOLD || '3', 10),
  },
};

/**
 * Get current bot detection configuration.
 * Can be extended to load from database or admin panel in the future.
 */
export function getBotDetectionConfig(): BotDetectionConfig {
  return defaultBotDetectionConfig;
}

/**
 * Validation reasons for logging and monitoring
 */
export enum BotDetectionReason {
  HONEYPOT_FILLED = 'HONEYPOT_FILLED',
  TOO_FAST = 'TOO_FAST',
  TOO_SLOW = 'TOO_SLOW',
  NO_FOCUS_EVENTS = 'NO_FOCUS_EVENTS',
  INSUFFICIENT_INTERACTIONS = 'INSUFFICIENT_INTERACTIONS',
  NO_MOUSE_MOVEMENT = 'NO_MOUSE_MOVEMENT',
}

/**
 * Bot detection result for logging and monitoring
 */
export interface BotDetectionResult {
  isBot: boolean;
  reason?: BotDetectionReason;
  details?: Record<string, unknown>;
  timestamp: number;
  email?: string; // For tracking repeat offenders (hashed)
}
