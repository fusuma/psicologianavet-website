import * as brevo from '@getbrevo/brevo';
import { subscriptionPayloadSchema, type SubscriptionPayload } from '@/shared/schemas';
import { getBotDetectionConfig, BotDetectionReason } from '@/config/botDetection';
import { logBotDetection, logLegitimateSubmission } from '@/utils/botDetectionLogger';

/**
 * Custom error for validation failures (including honeypot detection).
 */
export class ValidationError extends Error {
  constructor(message: string, public details?: unknown[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom error for when an email address is already subscribed.
 */
export class EmailExistsError extends Error {
  constructor(message: string = 'Email already subscribed') {
    super(message);
    this.name = 'EmailExistsError';
  }
}

/**
 * Validate and sanitize required environment variables
 */
function validateEnvironment(): void {
  const required = [
    'BREVO_API_KEY',
    'BREVO_TUTORS_LIST_ID',
    'BREVO_VETS_LIST_ID',
  ];

  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please configure these in your Vercel project settings.'
    );
  }

  // Trim whitespace from all env vars to prevent formatting issues
  required.forEach((key) => {
    const value = process.env[key];
    if (value) {
      process.env[key] = value.trim();
    }
  });

  console.log('Environment validated:', {
    apiKeyLength: process.env.BREVO_API_KEY?.length,
    tutorsListId: process.env.BREVO_TUTORS_LIST_ID,
    vetsListId: process.env.BREVO_VETS_LIST_ID,
  });
}

// Validate environment on module load
validateEnvironment();

/**
 * Initialize Brevo API client with API key from environment.
 */
const apiInstance = new brevo.ContactsApi();
apiInstance.setApiKey(
  brevo.ContactsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

/**
 * Map list names to Brevo list IDs from environment variables.
 */
const listIdMap: Record<'tutors' | 'vets', string> = {
  tutors: process.env.BREVO_TUTORS_LIST_ID as string,
  vets: process.env.BREVO_VETS_LIST_ID as string,
};

/**
 * Subscribes a user to the specified mailing list.
 *
 * @param payload - The subscription data including email and list name
 * @returns A promise that resolves when subscription is successful
 * @throws {ValidationError} If the payload is invalid or bot detected
 * @throws {EmailExistsError} If the email is already subscribed
 */
export async function subscribe(payload: SubscriptionPayload): Promise<void> {
  // Get current bot detection configuration
  const config = getBotDetectionConfig();

  // Validate payload using Zod schema
  const validated = subscriptionPayloadSchema.parse(payload);

  // Layer 1: Check honeypot fields - if any are filled, reject as bot
  if (config.honeypot.enabled) {
    if (
      (validated.website && validated.website.length > 0) ||
      (validated.phone && validated.phone.length > 0) ||
      (validated.company && validated.company.length > 0)
    ) {
      logBotDetection(
        BotDetectionReason.HONEYPOT_FILLED,
        {
          website: validated.website?.length || 0,
          phone: validated.phone?.length || 0,
          company: validated.company?.length || 0,
        },
        validated.email
      );
      throw new ValidationError('Bot submission detected');
    }
  }

  // Layer 2: Temporal validation - check submission speed
  if (!validated.formSubmitTime) {
    logBotDetection(
      BotDetectionReason.TOO_FAST,
      {
        timeTaken: 0,
        threshold: config.temporal.minFormTimeMs,
        reason: 'formSubmitTime not set',
      },
      validated.email
    );
    throw new ValidationError('Invalid form submission timing');
  }

  const timeTaken = validated.formSubmitTime - validated.formLoadTime;

  if (timeTaken < config.temporal.minFormTimeMs) {
    logBotDetection(
      BotDetectionReason.TOO_FAST,
      {
        timeTaken,
        threshold: config.temporal.minFormTimeMs,
      },
      validated.email
    );
    throw new ValidationError('Form submitted too quickly');
  }

  if (timeTaken > config.temporal.maxFormTimeMs) {
    logBotDetection(
      BotDetectionReason.TOO_SLOW,
      {
        timeTaken,
        threshold: config.temporal.maxFormTimeMs,
      },
      validated.email
    );
    throw new ValidationError('Form session expired');
  }

  // Layer 3: Behavioral validation - check for human-like interaction
  if (config.behavioral.requireFocusEvents && !validated.hasFocusEvents) {
    logBotDetection(BotDetectionReason.NO_FOCUS_EVENTS, {}, validated.email);
    throw new ValidationError('Invalid interaction pattern');
  }

  if (validated.interactionCount < config.behavioral.minInteractionCount) {
    logBotDetection(
      BotDetectionReason.INSUFFICIENT_INTERACTIONS,
      {
        count: validated.interactionCount,
        threshold: config.behavioral.minInteractionCount,
      },
      validated.email
    );
    throw new ValidationError('Invalid interaction pattern');
  }

  if (config.behavioral.requireMouseMovement && !validated.hasMouseMovement) {
    logBotDetection(BotDetectionReason.NO_MOUSE_MOVEMENT, {}, validated.email);
    throw new ValidationError('Invalid interaction pattern');
  }

  // Map list name to Brevo list ID
  const listId = listIdMap[validated.listName];
  if (!listId) {
    throw new ValidationError(`Invalid list name: ${validated.listName}`);
  }

  // Create contact in Brevo
  const createContact = new brevo.CreateContact();
  createContact.email = validated.email;
  createContact.listIds = [parseInt(listId, 10)];

  try {
    await apiInstance.createContact(createContact);

    // Log successful (legitimate) submission
    logLegitimateSubmission({
      email: validated.email,
      listName: validated.listName,
      timeTaken,
      interactionCount: validated.interactionCount,
      hasFocusEvents: validated.hasFocusEvents,
      hasMouseMovement: validated.hasMouseMovement,
    });
  } catch (error: unknown) {
    // Log full error object to understand its structure
    console.error('Raw Brevo error:', {
      errorType: error?.constructor?.name,
      hasResponse: error && typeof error === 'object' && 'response' in error,
      errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });

    // Handle Brevo API errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown;
          body?: { code?: string; message?: string };
        };
      };

      const response = axiosError.response;

      // Log detailed Brevo API error for debugging
      console.error('Brevo API error details:', {
        status: response?.status,
        statusText: response?.statusText,
        data: JSON.stringify(response?.data),
        body: JSON.stringify(response?.body),
      });

      // Parse error data (Brevo returns JSON string in response.data)
      let errorData: { code?: string; message?: string } | undefined;
      try {
        errorData = typeof response?.data === 'string'
          ? JSON.parse(response.data)
          : response?.data || response?.body;
      } catch {
        errorData = response?.data || response?.body;
      }

      const errorCode = errorData?.code;
      const errorMessage = errorData?.message;

      console.log('Parsed error data:', { errorCode, errorMessage });

      // Check if error is "duplicate_parameter" (contact already exists)
      if (errorCode === 'duplicate_parameter') {
        throw new EmailExistsError('Email already subscribed');
      }

      // Throw ValidationError for other Brevo API errors
      throw new ValidationError(
        `Brevo API error (${response?.status}): ${errorMessage || response?.statusText || 'Unknown error'}`
      );
    }

    // Re-throw unknown errors
    throw error;
  }
}
