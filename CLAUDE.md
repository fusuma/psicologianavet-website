# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Quando um amor se vai** is a supportive website for pet owners (Tutors) and Veterinarians dealing with pet loss. It's a **serverless Jamstack application** built with Next.js 14, TypeScript, and Tailwind CSS, hosted on Vercel. The architecture features static site generation (SSG) for frontend pages and Next.js API routes for serverless backend functions that integrate with the Brevo email marketing API.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Build & Production
npm run build            # Production build (runs Next.js build with linting)
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing
npm run cypress:open     # Open Cypress interactive test runner
npm run cypress:run      # Run Cypress E2E tests in headless mode
```

## Architecture & Key Concepts

### Monorepo Structure

This is a **shared-type monorepo** where frontend and backend logic coexist within a single Next.js project. The critical architectural pattern is **shared schemas** via `src/shared/schemas.ts` - Zod schemas serve as the single source of truth for both validation and TypeScript types across the entire stack.

### Controller/Service Pattern

Backend API routes follow strict separation of concerns:

- **Controller** (`src/app/api/v*/[endpoint]/route.ts`): HTTP layer - handles request/response, error mapping
- **Service** (`src/services/*.ts`): Business logic - validation, external API calls, data transformation

**Example**: `/api/v1/subscribe`
- Controller: `src/app/api/v1/subscribe/route.ts` (HTTP I/O)
- Service: `src/services/subscriptionService.ts` (Brevo integration, validation)

### Bot Detection System

Multi-layer bot protection implemented across the form submission flow:

1. **Honeypot Fields** (`website`, `phone`, `company`) - Must remain empty
2. **Temporal Validation** - 2s minimum, 1h maximum form submission time
3. **Behavioral Fingerprinting** - Mouse movement, focus events, interaction count

**Configuration**: Via environment variables (see `.env.example`)
- Thresholds: `BOT_MIN_FORM_TIME_MS`, `BOT_MIN_INTERACTIONS`, etc.
- Logging: `BOT_LOGGING_ENABLED`, `BOT_LOG_LEVEL`

**Monitoring API**: `GET /api/v1/bot-detection/stats` (requires `X-Admin-Token` header)

### Component Architecture

- **Server Components by Default**: Use `'use client';` directive only when client-side interactivity is required
- **Base UI** (`src/components/ui/`): Shadcn/UI primitives (Button, Input, Form, Label)
- **Composite Components** (`src/components/composite/`): Feature-specific components (SignupForm, Layout, Analytics)

### Theme System

Two distinct color themes for different audiences:
- **Tutors**: Dark background (`#191723`) with Green accent (`#269A9B`)
- **Vets**: Green background (`#269A9B`) with Dark text (`#191723`)

Theme switching is prop-based via `theme?: 'dark' | 'green'` (e.g., `<SignupForm theme="green" />`)

### API Response Envelope

All API endpoints use a unified response structure:

```typescript
interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
}

interface ApiError {
  code: string;        // e.g., 'EMAIL_EXISTS', 'VALIDATION_ERROR'
  message: string;
  details?: unknown[];
}
```

### Brevo Integration

Email list management and transactional emails via `@getbrevo/brevo` SDK:
- **Environment Variables**: `BREVO_API_KEY`, `BREVO_TUTORS_LIST_ID`, `BREVO_VETS_LIST_ID`, `BREVO_VET_WELCOME_TEMPLATE_ID`
- **Services**:
  - `src/services/subscriptionService.ts` (list management, bot detection)
  - `src/services/pdfPersonalization.ts` (PDF generation, watermarking)
- **Error Mapping**: Brevo's `duplicate_parameter` → `EmailExistsError` → 409 Conflict response

### PDF Personalization System

Veterinarians receive personalized support material PDFs via email upon subscription:

1. **Dynamic PDF Generation**: Uses `pdf-lib` to replace clinic name on template PDF
2. **Transactional Email Delivery**: Sends personalized PDF as email attachment via Brevo
3. **Graceful Degradation**: Falls back to download links if PDF generation fails
4. **Optional Watermarking**: Tracks PDF distribution with metadata

**Key Files**:
- Template: `public/assets/apoio-momentos-dificeis.pdf`
- Fonts: `public/fonts/FiraSans-Bold.ttf`, `public/fonts/FiraSans-Regular.ttf`
- Service: `src/services/pdfPersonalization.ts`

**Performance**: 2-4s response time for vets (includes PDF generation), ~500ms for tutors

## Critical Files

| File | Purpose |
|------|---------|
| `src/shared/schemas.ts` | **Single source of truth** for all data schemas (Zod) and types |
| `src/services/subscriptionService.ts` | Core business logic for email subscriptions and bot detection |
| `src/services/pdfPersonalization.ts` | PDF generation and watermarking for vet subscriptions |
| `src/components/composite/SignupForm.tsx` | Reusable signup form with bot detection tracking |
| `src/config/botDetection.ts` | Centralized bot detection configuration |
| `docs/architecture/coding-standards.md` | Complete coding standards (TypeScript, React, testing, accessibility) |
| `.env.example` | Required environment variables with documentation |

## Zod Schema Pattern

**ALWAYS** infer TypeScript types from Zod schemas - never define types separately:

```typescript
// ✅ Correct
export const subscriptionPayloadSchema = z.object({
  email: z.string().email(),
  listName: z.enum(['tutors', 'vets']),
});

export type SubscriptionPayload = z.infer<typeof subscriptionPayloadSchema>;

// ❌ Wrong - creates drift
export type SubscriptionPayload = {
  email: string;
  listName: 'tutors' | 'vets';
}
```

## Styling Standards

- **Framework**: Tailwind CSS (utility-first)
- **Typography**: Castoro (headings in small caps), Fira Sans (body)
- **No Inline Styles**: Use Tailwind classes; only use `style={{}}` for dynamic values
- **Conditional Classes**: Use `cn()` utility from `@/lib/utils`
- **Mobile-First**: Always design for mobile first, then add responsive breakpoints

## Testing Strategy

- **E2E**: Cypress tests in `cypress/e2e/` (tutor-subscription.cy.ts, vet-subscription.cy.ts)
- **Accessibility**: `cypress-axe` for automated WCAG 2.1 Level AA compliance checks
- **Test Pattern**: Intercept API calls, test happy paths, error states, and accessibility

## Accessibility Requirements

- **Standard**: WCAG 2.1 Level AA compliance
- **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<main>`)
- **ARIA**: All form inputs must have labels (`htmlFor`, `aria-required`)
- **Keyboard**: All interactive elements must be keyboard accessible
- **Focus Indicators**: Visible focus states required

## Security Standards

- **Environment Variables**: Never commit secrets; use `.env.local` (git-ignored)
- **API Keys**: Server-side only; never expose in client code
- **Client Variables**: Prefix with `NEXT_PUBLIC_` only when necessary
- **Input Validation**: Always validate on server, even if validated on client
- **Honeypot**: All forms include bot protection (see bot detection system)

## Error Handling

### Custom Error Classes

```typescript
ValidationError      // Invalid input or bot detected
EmailExistsError     // Duplicate email in Brevo
```

### Error Mapping (API Routes)

- `ZodError` → 400 Bad Request
- `ValidationError` → 400 Bad Request
- `EmailExistsError` → 409 Conflict
- Unknown errors → 500 Internal Server Error (never expose internals to client)

## Type Safety Standards

- **No `any` type**: Use `unknown` and narrow if type is truly unknown
- **Explicit return types**: All functions must declare return types
- **Strict mode**: Enabled in `tsconfig.json` - never disable strict checks
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections

## Naming Conventions

- **Components/Classes**: `PascalCase` (e.g., `SignupForm`, `ApiClient`)
- **Variables/Functions**: `camelCase` (e.g., `userName`, `getUserEmail`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`)
- **Boolean Variables**: Prefix with `is`, `has`, `should`, `can` (e.g., `isLoading`, `hasError`)
- **Private Properties**: Prefix with `_` (e.g., `_internalCache`)

## Git Conventions

**Commit Format**: Conventional commits
```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore
scope: signup, api, ui, etc.
```

**Examples**:
```
feat(signup): add email validation to signup form
fix(api): handle 409 conflict for duplicate emails
docs(readme): update installation instructions
```

## Important Documentation

- **Architecture**: `docs/architecture.md` - Complete fullstack architecture
- **PDF Integration**: `docs/architecture/15-pdf-personalization-integration.md` - PDF personalization & Brevo email integration
- **Integration Diagrams**: `docs/architecture/pdf-integration-diagrams.md` - Visual system diagrams
- **Quick Start**: `docs/pdf-integration-quickstart.md` - Step-by-step implementation guide
- **UX Guide**: `docs/ux-vet-signup-form.md` - Form design and conversion optimization
- **Tech Stack**: `docs/architecture/tech-stack.md` - Technology decisions and versions
- **Coding Standards**: `docs/architecture/coding-standards.md` - Comprehensive coding guidelines
- **Bot Detection**: `docs/bot-detection-quick-reference.md` - Bot detection monitoring guide
- **PRD**: `docs/prd.md` - Product requirements and user stories

## Common Patterns

### Adding a New API Endpoint

1. Create route file: `src/app/api/v1/[endpoint]/route.ts`
2. Define schema in `src/shared/schemas.ts`
3. Implement service in `src/services/[name]Service.ts`
4. Controller calls service, handles errors
5. Add E2E tests in `cypress/e2e/`

### Adding a New Page

1. Create `src/app/[route]/page.tsx`
2. Export metadata for SEO
3. Use Server Components by default
4. Add `'use client';` only if needed for interactivity

### Working with Forms

1. Use React Hook Form with Zod resolver
2. Import schema from `src/shared/schemas.ts`
3. Include bot detection fields (honeypot, timestamps, behavioral)
4. Handle success/error states with user-friendly messages
5. Never expose internal errors to users

## Performance Standards

- **Mobile-First**: Optimize for mobile devices first
- **Bundle Size**: Avoid unnecessary dependencies; use dynamic imports for heavy components
- **Images**: Use Next.js `Image` component with appropriate sizing
- **Fonts**: Use `next/font` for optimal font loading (already configured for Fira Sans and Castoro)

## Deployment

- **Platform**: Vercel (automated Git-based CI/CD)
- **Strategy**: SSG for pages, Serverless Functions for API routes
- **Environment Variables**: Configure in Vercel dashboard (match `.env.example`)
