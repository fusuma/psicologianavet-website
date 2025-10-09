import { z } from 'zod';

/**
 * Zod schema for subscription payload validation.
 * This is the single source of truth for subscription data validation.
 */
export const subscriptionPayloadSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  listName: z.enum(['tutors', 'vets']),

  // Clinic name - REQUIRED for vets, collected upfront for PDF personalization
  clinicName: z.string()
    .min(2, { message: "Nome da clínica deve ter pelo menos 2 caracteres." })
    .max(100, { message: "Nome da clínica deve ter no máximo 100 caracteres." })
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-'\.]+$/, { message: "Nome da clínica contém caracteres inválidos." })
    .trim()
    .optional(), // Optional in schema, but enforced via refine for vets

  // Multi-layer bot detection fields
  // Layer 1: Decoy fields (should remain empty)
  website: z.string().max(0).optional(), // Primary honeypot
  phone: z.string().max(0).optional(),   // Secondary honeypot
  company: z.string().max(0).optional(), // Tertiary honeypot

  // Layer 2: Temporal validation
  formLoadTime: z.number().int().positive(), // Unix timestamp when form loaded
  formSubmitTime: z.number().int().positive().optional(), // Unix timestamp when submitted (set at submit time)

  // Layer 3: Behavioral fingerprinting
  interactionCount: z.number().int().min(0), // Number of user interactions
  hasFocusEvents: z.boolean(), // Did user focus on email field?
  hasMouseMovement: z.boolean(), // Was mouse movement detected?
})
  .refine(
    (data) => {
      // CRITICAL: Clinic name is REQUIRED for vets to enable PDF personalization
      if (data.listName === 'vets') {
        return !!data.clinicName && data.clinicName.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Nome da clínica é obrigatório para veterinários.",
      path: ['clinicName'],
    }
  );

/**
 * TypeScript type inferred from subscriptionPayloadSchema.
 * Do not define this type separately - always infer from Zod schema.
 */
export type SubscriptionPayload = z.infer<typeof subscriptionPayloadSchema>;

/**
 * Standard API error structure.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown[];
}

/**
 * Generic API response envelope.
 * All API endpoints return this structure for consistency.
 *
 * @template T - The type of data returned on success
 */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
}
