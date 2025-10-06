import * as brevo from '@getbrevo/brevo';
import { subscriptionPayloadSchema, type SubscriptionPayload } from '@/shared/schemas';

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
 * @throws {ValidationError} If the payload is invalid or honeypot is filled
 * @throws {EmailExistsError} If the email is already subscribed
 */
export async function subscribe(payload: SubscriptionPayload): Promise<void> {
  // Validate payload using Zod schema
  const validated = subscriptionPayloadSchema.parse(payload);

  // Check honeypot field - if filled, reject as bot submission
  if (validated.honeypot && validated.honeypot.length > 0) {
    throw new ValidationError('Bot submission detected');
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
  } catch (error: unknown) {
    // Handle Brevo API errors
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { body?: { code?: string } } }).response;

      // Check if error is "duplicate_parameter" (contact already exists)
      if (response?.body?.code === 'duplicate_parameter') {
        throw new EmailExistsError('Email already subscribed');
      }
    }

    // Re-throw unknown errors
    throw error;
  }
}
