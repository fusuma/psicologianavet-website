# Coding Standards

## 1. Introduction

This document defines the coding standards for the "Quando um amor se vai" project. These standards ensure code quality, maintainability, accessibility, and consistency across the codebase. All contributors must adhere to these standards.

**Guiding Principle**: Write code that is readable, maintainable, and accessible first; clever or overly complex solutions should be avoided.

---

## 2. General Principles

### 2.1 Code Quality Standards

1. **Readability Over Cleverness**: Code should be self-documenting. Use clear variable and function names.
2. **Single Responsibility Principle**: Each function/component should do one thing well.
3. **DRY (Don't Repeat Yourself)**: Extract reusable logic into shared utilities or components.
4. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's required.
5. **Separation of Concerns**: Keep business logic, presentation, and data access separate.

### 2.2 Performance Standards

1. **Mobile-First**: Optimize for mobile devices first.
2. **Minimize Bundle Size**: Avoid unnecessary dependencies; use dynamic imports for large components.
3. **Optimize Images**: Use Next.js `Image` component with appropriate sizing and formats.
4. **Lazy Loading**: Defer loading of non-critical resources.

---

## 3. TypeScript Standards

### 3.1 Type Safety

1. **No `any` Type**: Never use `any`. Use `unknown` if the type is truly unknown, then narrow it.
2. **Explicit Return Types**: All functions must have explicit return types.
   ```typescript
   // ✅ Good
   function calculateTotal(price: number, quantity: number): number {
     return price * quantity;
   }

   // ❌ Bad
   function calculateTotal(price: number, quantity: number) {
     return price * quantity;
   }
   ```

3. **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections.
   ```typescript
   // ✅ Good
   interface User {
     name: string;
     email: string;
   }

   type Theme = 'dark' | 'green';

   // ❌ Bad - using type for simple object
   type User = {
     name: string;
     email: string;
   }
   ```

4. **Zod as Single Source of Truth**: All data validation schemas must be defined with Zod. Infer TypeScript types from Zod schemas.
   ```typescript
   // ✅ Good
   import { z } from 'zod';

   export const userSchema = z.object({
     email: z.string().email(),
     name: z.string().min(2),
   });

   export type User = z.infer<typeof userSchema>;

   // ❌ Bad - separate type definition
   export type User = {
     email: string;
     name: string;
   }
   ```

5. **Strict Mode**: The project uses strict TypeScript configuration. Never disable strict checks.

### 3.2 Naming Conventions

1. **Variables & Functions**: `camelCase`
   ```typescript
   const userName = 'John';
   function getUserEmail() { }
   ```

2. **Components & Classes**: `PascalCase`
   ```typescript
   function SignupForm() { }
   class ApiClient { }
   ```

3. **Constants**: `UPPER_SNAKE_CASE`
   ```typescript
   const MAX_RETRY_ATTEMPTS = 3;
   const API_BASE_URL = '/api/v1';
   ```

4. **Private Properties**: Prefix with `_`
   ```typescript
   class Service {
     private _internalCache: Map<string, unknown>;
   }
   ```

5. **Boolean Variables**: Prefix with `is`, `has`, `should`, or `can`
   ```typescript
   const isLoading = true;
   const hasError = false;
   const shouldRender = true;
   ```

---

## 4. React & Next.js Standards

### 4.1 Component Architecture

1. **Server Components by Default**: All components are Server Components unless they require client-side interactivity.
   ```typescript
   // ✅ Good - Server Component (default)
   export function StaticContent() {
     return <div>Static content</div>;
   }

   // ✅ Good - Client Component (only when needed)
   'use client';

   import { useState } from 'react';

   export function InteractiveForm() {
     const [value, setValue] = useState('');
     return <input value={value} onChange={(e) => setValue(e.target.value)} />;
   }
   ```

2. **Component File Structure**: One component per file. File name must match component name.
   ```
   ✅ components/composite/SignupForm.tsx
   ❌ components/composite/forms.tsx (multiple components)
   ```

3. **Component Template**:
   ```typescript
   'use client'; // Only if needed

   import { type ComponentProps } from 'react';

   interface SignupFormProps {
     theme?: 'dark' | 'green';
     onSuccess?: () => void;
   }

   export function SignupForm({ theme = 'dark', onSuccess }: SignupFormProps): JSX.Element {
     // Component logic
     return (
       <form>
         {/* Component JSX */}
       </form>
     );
   }
   ```

4. **Props Interface**: Always define explicit props interface. Never use inline types.

5. **Component Organization**: Structure components in this order:
   ```typescript
   // 1. Imports
   import { useState } from 'react';

   // 2. Type definitions
   interface Props { }

   // 3. Constants (outside component)
   const DEFAULT_THEME = 'dark';

   // 4. Component
   export function Component(props: Props) {
     // 4a. Hooks
     const [state, setState] = useState();

     // 4b. Event handlers
     const handleClick = () => { };

     // 4c. Derived values
     const isValid = state !== null;

     // 4d. Effects
     useEffect(() => { }, []);

     // 4e. Render
     return <div />;
   }
   ```

### 4.2 Hooks Standards

1. **Custom Hooks**: Prefix with `use` and place in `src/hooks/`.
   ```typescript
   // src/hooks/useSubscription.ts
   export function useSubscription() {
     // Hook logic
   }
   ```

2. **Hook Dependencies**: Always specify all dependencies. Never disable the exhaustive-deps rule.
   ```typescript
   // ✅ Good
   useEffect(() => {
     fetchData(userId);
   }, [userId]);

   // ❌ Bad
   useEffect(() => {
     fetchData(userId);
   }, []); // Missing dependency
   ```

3. **Early Returns in Hooks**: Conditional hooks are forbidden.
   ```typescript
   // ❌ Bad
   function Component({ condition }) {
     if (condition) return null;

     useEffect(() => { }); // Conditional hook usage
   }

   // ✅ Good
   function Component({ condition }) {
     useEffect(() => {
       if (!condition) return;
       // Effect logic
     }, [condition]);

     if (condition) return null;
   }
   ```

### 4.3 Next.js Specific Standards

1. **App Router**: Use App Router (`/app` directory) for all routing.

2. **Page Files**: Use `page.tsx` for routes, `layout.tsx` for layouts.

3. **API Routes**: Use `route.ts` for API endpoints.
   ```typescript
   // app/api/v1/subscribe/route.ts
   import { NextRequest, NextResponse } from 'next/server';

   export async function POST(request: NextRequest): Promise<NextResponse> {
     // API logic
   }
   ```

4. **Metadata**: Export metadata for SEO.
   ```typescript
   import { type Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };
   ```

5. **Environment Variables**: Prefix client-side variables with `NEXT_PUBLIC_`.
   ```typescript
   // ✅ Server-side only
   const apiKey = process.env.BREVO_API_KEY;

   // ✅ Client-side accessible
   const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
   ```

---

## 5. Styling Standards

### 5.1 Tailwind CSS

1. **Utility-First Approach**: Use Tailwind utilities instead of custom CSS.
   ```tsx
   // ✅ Good
   <div className="flex items-center justify-center p-4 bg-primary text-white">

   // ❌ Bad
   <div className="custom-container" style={{ display: 'flex' }}>
   ```

2. **Class Organization**: Order classes logically (layout → sizing → spacing → colors → typography → effects).
   ```tsx
   <div className="flex flex-col w-full max-w-md p-4 mt-8 bg-primary text-lg font-bold rounded-lg shadow-md">
   ```

3. **Conditional Classes**: Use `clsx` or `cn` utility for conditional classes.
   ```typescript
   import { cn } from '@/lib/utils';

   <button className={cn(
     "px-4 py-2 rounded",
     isPrimary && "bg-primary text-white",
     isDisabled && "opacity-50 cursor-not-allowed"
   )} />
   ```

4. **Custom Colors**: Use CSS variables defined in `globals.css`.
   ```css
   /* globals.css */
   :root {
     --primary-dark: #191723;
     --primary-green: #269A9B;
   }
   ```

5. **Responsive Design**: Mobile-first breakpoints.
   ```tsx
   <div className="text-sm md:text-base lg:text-lg">
   ```

### 5.2 Component Styling

1. **Shadcn/UI Theme**: Use Shadcn/UI's theming system via CSS variables.

2. **No Inline Styles**: Avoid inline styles unless absolutely necessary (e.g., dynamic values).
   ```tsx
   // ❌ Bad
   <div style={{ color: 'red' }}>

   // ✅ Good
   <div className="text-red-500">

   // ✅ Acceptable (dynamic value)
   <div style={{ width: `${progress}%` }}>
   ```

---

## 6. State Management Standards

### 6.1 Local State

1. **useState**: For simple component-level state.
   ```typescript
   const [email, setEmail] = useState<string>('');
   ```

2. **useReducer**: For complex state with multiple related values.
   ```typescript
   interface State {
     email: string;
     isLoading: boolean;
     error: string | null;
   }

   type Action =
     | { type: 'SET_EMAIL'; payload: string }
     | { type: 'SET_LOADING'; payload: boolean }
     | { type: 'SET_ERROR'; payload: string | null };

   function reducer(state: State, action: Action): State {
     switch (action.type) {
       case 'SET_EMAIL':
         return { ...state, email: action.payload };
       // ...
     }
   }
   ```

### 6.2 Global State

1. **React Context**: For theme, user preferences, or shared UI state.
   ```typescript
   interface ThemeContextValue {
     theme: 'dark' | 'green';
     setTheme: (theme: 'dark' | 'green') => void;
   }

   const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

   export function useTheme(): ThemeContextValue {
     const context = useContext(ThemeContext);
     if (!context) {
       throw new Error('useTheme must be used within ThemeProvider');
     }
     return context;
   }
   ```

---

## 7. API & Data Fetching Standards

### 7.1 API Client

1. **Centralized Client**: All API calls go through `src/services/apiClient.ts`.
   ```typescript
   // src/services/apiClient.ts
   export class ApiClient {
     private baseUrl = '/api/v1';

     async subscribe(payload: SubscriptionPayload): Promise<ApiResponse> {
       // Implementation
     }
   }
   ```

2. **Error Handling**: Always handle errors gracefully.
   ```typescript
   try {
     const response = await apiClient.subscribe(payload);
     return response;
   } catch (error) {
     if (error instanceof ValidationError) {
       // Handle validation error
     } else if (error instanceof NetworkError) {
       // Handle network error
     }
     throw error;
   }
   ```

3. **Type Safety**: All API responses must be typed.
   ```typescript
   interface ApiResponse<T = unknown> {
     data: T | null;
     error: ApiError | null;
   }
   ```

### 7.2 Backend API Routes

1. **Controller/Service Pattern**: Separate HTTP concerns from business logic.
   ```typescript
   // app/api/v1/subscribe/route.ts (Controller)
   export async function POST(request: NextRequest): Promise<NextResponse> {
     try {
       const body = await request.json();
       const result = await subscriptionService.subscribe(body);
       return NextResponse.json(result);
     } catch (error) {
       return handleError(error);
     }
   }

   // src/services/subscriptionService.ts (Service)
   export class SubscriptionService {
     async subscribe(payload: SubscriptionPayload): Promise<void> {
       // Business logic
     }
   }
   ```

2. **Input Validation**: Validate all inputs with Zod at the service layer.
   ```typescript
   const validated = subscriptionPayloadSchema.parse(payload);
   ```

3. **Error Responses**: Use consistent error structure.
   ```typescript
   interface ApiError {
     code: string;
     message: string;
     details?: unknown[];
   }
   ```

---

## 8. Testing Standards

### 8.1 General Testing Principles

1. **Test Coverage**: Minimum 80% code coverage for critical paths.
2. **Test Naming**: Use descriptive test names: `it('should add contact to Brevo when email is valid')`.
3. **AAA Pattern**: Arrange, Act, Assert.

### 8.2 Unit Tests (Jest + React Testing Library)

1. **Test File Location**: Co-locate tests with source files using `.test.ts` or `.test.tsx` suffix.
   ```
   src/components/SignupForm.tsx
   src/components/SignupForm.test.tsx
   ```

2. **Component Testing Template**:
   ```typescript
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { SignupForm } from './SignupForm';

   describe('SignupForm', () => {
     it('should render email input', () => {
       render(<SignupForm />);
       expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
     });

     it('should call onSuccess when form is submitted successfully', async () => {
       const onSuccess = jest.fn();
       render(<SignupForm onSuccess={onSuccess} />);

       const emailInput = screen.getByLabelText(/email/i);
       await userEvent.type(emailInput, 'test@example.com');

       const submitButton = screen.getByRole('button', { name: /submit/i });
       await userEvent.click(submitButton);

       expect(onSuccess).toHaveBeenCalledTimes(1);
     });
   });
   ```

3. **Query Priority**: Use queries in this order:
   - `getByRole` (preferred)
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`
   - `getByTestId` (last resort)

4. **Mock External Dependencies**: Mock API calls and external services.
   ```typescript
   jest.mock('@/services/apiClient', () => ({
     apiClient: {
       subscribe: jest.fn(),
     },
   }));
   ```

### 8.3 Integration Tests

1. **Test User Workflows**: Test complete user flows, not isolated units.
   ```typescript
   it('should display success message after successful subscription', async () => {
     // Mock successful API response
     (apiClient.subscribe as jest.Mock).mockResolvedValueOnce({ data: {} });

     render(<SignupForm />);

     await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
     await userEvent.click(screen.getByRole('button', { name: /submit/i }));

     expect(await screen.findByText(/thank you for subscribing/i)).toBeInTheDocument();
   });
   ```

### 8.4 E2E Tests (Cypress)

1. **Test File Location**: Place in `cypress/e2e/` directory.

2. **E2E Test Template**:
   ```typescript
   describe('Tutor Subscription Flow', () => {
     beforeEach(() => {
       cy.visit('/tutors');
     });

     it('should allow user to subscribe successfully', () => {
       cy.findByLabelText(/email/i).type('test@example.com');
       cy.findByRole('button', { name: /submit/i }).click();

       cy.findByText(/thank you for subscribing/i).should('be.visible');
     });

     it('should show error when email already exists', () => {
       // Intercept API call
       cy.intercept('POST', '/api/v1/subscribe', {
         statusCode: 409,
         body: { error: { code: 'EMAIL_EXISTS', message: 'Already subscribed' } },
       });

       cy.findByLabelText(/email/i).type('existing@example.com');
       cy.findByRole('button', { name: /submit/i }).click();

       cy.findByText(/already subscribed/i).should('be.visible');
     });
   });
   ```

3. **Accessibility Testing**: Use `cypress-axe` for automated accessibility checks.
   ```typescript
   it('should have no accessibility violations', () => {
     cy.visit('/tutors');
     cy.injectAxe();
     cy.checkA11y();
   });
   ```

---

## 9. Accessibility Standards

### 9.1 WCAG 2.1 Level AA Compliance

1. **Semantic HTML**: Use semantic elements (`<nav>`, `<main>`, `<article>`, `<button>`, etc.).
   ```tsx
   // ✅ Good
   <button onClick={handleClick}>Submit</button>

   // ❌ Bad
   <div onClick={handleClick}>Submit</div>
   ```

2. **Keyboard Navigation**: All interactive elements must be keyboard accessible.
   ```tsx
   <button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
   ```

3. **ARIA Labels**: Provide labels for all form inputs and interactive elements.
   ```tsx
   <label htmlFor="email">Email Address</label>
   <input id="email" type="email" aria-required="true" />
   ```

4. **Color Contrast**: Ensure minimum 4.5:1 contrast ratio for text.

5. **Focus Indicators**: All focusable elements must have visible focus indicators.
   ```css
   button:focus-visible {
     @apply ring-2 ring-offset-2 ring-primary;
   }
   ```

6. **Alt Text**: All images must have descriptive alt text.
   ```tsx
   <Image src="/logo.png" alt="Quando um amor se vai logo" />
   ```

7. **Skip Links**: Provide skip navigation links for keyboard users.
   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only">
     Skip to main content
   </a>
   ```

### 9.2 Testing Accessibility

1. **Automated Testing**: Use `jest-axe` for unit tests and `cypress-axe` for E2E tests.
2. **Manual Testing**: Test with keyboard navigation and screen readers.

---

## 10. Error Handling Standards

### 10.1 Error Types

1. **Custom Error Classes**: Define specific error types.
   ```typescript
   export class ValidationError extends Error {
     constructor(message: string, public details?: unknown[]) {
       super(message);
       this.name = 'ValidationError';
     }
   }

   export class EmailExistsError extends Error {
     constructor(message: string = 'Email already subscribed') {
       super(message);
       this.name = 'EmailExistsError';
     }
   }
   ```

2. **Error Boundaries**: Use React Error Boundaries for unexpected errors.
   ```typescript
   'use client';

   import { Component, type ReactNode } from 'react';

   interface Props {
     children: ReactNode;
     fallback: ReactNode;
   }

   interface State {
     hasError: boolean;
   }

   export class ErrorBoundary extends Component<Props, State> {
     state = { hasError: false };

     static getDerivedStateFromError(): State {
       return { hasError: true };
     }

     render() {
       if (this.state.hasError) {
         return this.props.fallback;
       }
       return this.props.children;
     }
   }
   ```

### 10.2 User-Facing Error Messages

1. **Generic Messages**: Never expose internal errors to users.
   ```typescript
   // ✅ Good
   "Something went wrong. Please try again."

   // ❌ Bad
   "Database connection failed at line 42"
   ```

2. **Actionable Errors**: Provide guidance on how to resolve the error.
   ```typescript
   "Invalid email address. Please enter a valid email."
   ```

---

## 11. Security Standards

### 11.1 Environment Variables

1. **Never Commit Secrets**: Use `.env.local` for secrets (git-ignored).
2. **Example File**: Provide `.env.example` with placeholder values.
   ```
   # .env.example
   BREVO_API_KEY=your_api_key_here
   BREVO_TUTORS_LIST_ID=123
   ```

3. **Client-Side Variables**: Only expose necessary variables with `NEXT_PUBLIC_` prefix.

### 11.2 Input Validation

1. **Server-Side Validation**: Always validate on the server, even if validated on client.
2. **Sanitization**: Sanitize user inputs to prevent XSS.
3. **Honeypot Fields**: Implement honeypot for bot protection.
   ```tsx
   <input
     type="text"
     name="website"
     className="sr-only"
     tabIndex={-1}
     autoComplete="off"
   />
   ```

### 11.3 API Security

1. **Rate Limiting**: Implement rate limiting on API routes (future consideration).
2. **CORS**: Configure CORS appropriately for API routes.
3. **HTTPS Only**: Ensure all production traffic uses HTTPS.

---

## 12. File & Folder Naming Standards

### 12.1 File Names

1. **Components**: `PascalCase.tsx`
   ```
   SignupForm.tsx
   Button.tsx
   ```

2. **Utilities**: `camelCase.ts`
   ```
   apiClient.ts
   formatDate.ts
   ```

3. **Types**: `camelCase.types.ts`
   ```
   api.types.ts
   form.types.ts
   ```

4. **Tests**: `{fileName}.test.{ts|tsx}`
   ```
   SignupForm.test.tsx
   apiClient.test.ts
   ```

5. **Schemas**: `schemas.ts` or `{domain}.schema.ts`
   ```
   schemas.ts
   subscription.schema.ts
   ```

### 12.2 Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn/UI primitives
│   └── composite/        # Feature components
├── services/             # Business logic & API clients
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── shared/               # Shared types & schemas
└── lib/                  # Third-party configurations
```

---

## 13. Git & Version Control Standards

### 13.1 Commit Messages

1. **Format**: Use conventional commits format.
   ```
   type(scope): subject

   body (optional)

   footer (optional)
   ```

2. **Types**:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

3. **Examples**:
   ```
   feat(signup): add email validation to signup form

   fix(api): handle 409 conflict for duplicate emails

   docs(readme): update installation instructions
   ```

### 13.2 Branch Naming

1. **Format**: `type/short-description`
   ```
   feature/signup-form
   fix/email-validation
   refactor/api-client
   ```

### 13.3 Pull Requests

1. **Description**: Provide clear description of changes.
2. **Testing**: Include testing instructions.
3. **Screenshots**: Add screenshots for UI changes.

---

## 14. Documentation Standards

### 14.1 Code Comments

1. **When to Comment**:
   - Complex business logic
   - Non-obvious decisions
   - Workarounds or hacks
   - Public API functions

2. **JSDoc for Public APIs**:
   ```typescript
   /**
    * Subscribes a user to the specified mailing list.
    *
    * @param payload - The subscription data including email and list name
    * @returns A promise that resolves when subscription is successful
    * @throws {ValidationError} If the payload is invalid
    * @throws {EmailExistsError} If the email is already subscribed
    */
   export async function subscribe(payload: SubscriptionPayload): Promise<void> {
     // Implementation
   }
   ```

3. **TODO Comments**: Include ticket reference or name.
   ```typescript
   // TODO(john): Implement rate limiting - TICKET-123
   ```

### 14.2 Component Documentation

1. **Props Documentation**: Document complex props.
   ```typescript
   interface SignupFormProps {
     /**
      * The theme variant to apply ('dark' for Tutors, 'green' for Vets)
      * @default 'dark'
      */
     theme?: 'dark' | 'green';

     /**
      * Callback invoked when subscription is successful
      */
     onSuccess?: () => void;
   }
   ```

---

## 15. Performance Standards

### 15.1 Bundle Optimization

1. **Tree Shaking**: Use named imports from libraries.
   ```typescript
   // ✅ Good
   import { useState } from 'react';

   // ❌ Bad
   import React from 'react';
   const { useState } = React;
   ```

2. **Dynamic Imports**: Lazy load heavy components.
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Spinner />,
   });
   ```

3. **Analyze Bundle**: Run `npm run build` and review bundle size.

### 15.2 Image Optimization

1. **Next.js Image**: Always use `next/image` component.
   ```tsx
   import Image from 'next/image';

   <Image
     src="/hero.jpg"
     alt="Hero image"
     width={800}
     height={600}
     priority // For above-fold images
   />
   ```

2. **Responsive Images**: Use `sizes` prop for responsive images.

### 15.3 Font Optimization

1. **Next.js Font**: Use `next/font` for optimal font loading.
   ```typescript
   import { Fira_Sans, Castoro } from 'next/font/google';

   const firaSans = Fira_Sans({
     subsets: ['latin'],
     weight: ['400', '700'],
   });
   ```

---

## 16. Monitoring & Observability

### 16.1 Analytics

1. **Google Analytics**: Track page views and key user actions.
2. **Privacy**: Respect user privacy; comply with GDPR/CCPA.

### 16.2 Error Logging

1. **Console Errors**: Log errors to console in development.
2. **Production Logging**: Consider error tracking service (future).

---

## 17. Enforcement

### 17.1 Automated Tools

1. **ESLint**: Enforce code quality rules.
2. **Prettier**: Auto-format code.
3. **TypeScript**: Enforce type safety.
4. **Husky**: Run pre-commit hooks.

### 17.2 Code Review

1. **Peer Review**: All code must be reviewed before merging.
2. **Checklist**: Use a code review checklist.
   - [ ] Code follows naming conventions
   - [ ] Tests are included and passing
   - [ ] TypeScript types are correct
   - [ ] Accessibility standards are met
   - [ ] No security vulnerabilities
   - [ ] Documentation is updated

---

## 18. Version History

| Date | Version | Description | Author |
|:---|:---|:---|:---|
| 2025-10-06 | 1.0 | Initial coding standards document | Winston (Architect) |

---

**End of Coding Standards Document**
