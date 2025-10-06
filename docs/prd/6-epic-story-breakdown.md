# 6. Epic & Story Breakdown

## Epic 1 Stories (Revised)

**Story 1.1: Project Initialization & Hosting Setup**

* *As a Project Owner, I want the project initialized and connected to a Vercel account...*
* **Implementation Note:** Use `npx create-next-app@latest` with TypeScript and Tailwind CSS flags.

**Story 1.2: Initialize Component Library with Shadcn/UI**

* **As a** Developer, **I want** the project configured with the new component library...
* **Acceptance Criteria:**
1. The project has successfully installed the **Shadcn/UI** dependencies (including Radix UI, CVA, etc.).
2. The core components (e.g., `<Button>`, `<Input>`, `<Label>`) have been initialized and are themeable.
3. The project structure is ready to compose these components into feature-specific components.

**Story 1.3: Create Themeable Shared Layout**

* *As a Developer, I want a shared layout component that supports theming...*
* **Implementation Note:** Use CSS variables to handle the 'dark' and 'green' themes.

**Story 1.4: Build the Homepage Portal**

* *As a first-time Visitor, I want a clear homepage that helps me self-identify...*

**Story 1.5: Build Static Tutor Page**

* *As a Tutor, I want a dedicated landing page...*
* **Acceptance Criteria:**
1. The `/tutors` page is created.
2. The page uses the shared layout with the 'dark' theme applied.
3. It contains simple, contextual placeholder text that follows a consistent structure (e.g., Headline, Intro Paragraph).

**Story 1.6: Implement End-to-End Sign-up Feature (ACs Revised)**

* *As a Tutor, I want to sign up on the Tutor page and receive confirmation...*
* **Acceptance Criteria (CRITICAL UPDATES):**
1. A reusable, themeable `<SignupForm />` is created and added to the `/tutors` page.
2. A serverless function at `/api/v1/subscribe` is created to securely process submissions.
3. The form performs client-side validation and has a honeypot field.
4. On submission, the form adds the contact to the 'tutors' list in Brevo.
5. The form displays loading, success, and generic error messages.
6. **Security Check:** Submissions with any value in the honeypot field must be rejected immediately by the server, returning a `400 Bad Request`.
7. **Business Logic Check:** If the email address is already subscribed, the API must return a `409 Conflict` status and display an appropriate message.
8. **E2E Testing:** A Cypress test is created to verify the entire happy path and the 'already subscribed' path.
* **Implementation Notes:**
* **Frontend:** Use `React Hook Form` integrated with the shared **Zod** schema.
* **Backend:** Logic is split into a Controller (`route.ts`) and a Service (`subscriptionService.ts`) for clean logic separation.
* **API:** Retrieve `BREVO_API_KEY` from `process.env`.

**Story 1.7: Integrate Google Analytics (formerly 1.6)**

* *As a Project Owner, I want website traffic to be tracked...*
* **Implementation Note:** Create a dedicated `<Analytics />` component included in the root layout.

## Epic 2 Story

**Story 2.1: Launch the Vet Section**

* **As a** Vet, **I want** a dedicated, green-themed landing page with a functioning sign-up form...
* **Acceptance Criteria:**
1. The `/vets` page is created.
2. The page uses the shared `<Layout />` component, passing it the `theme='green'` prop.
3. It contains simple, contextual placeholder text for Vets, following the established content structure.
4. The reusable `<SignupForm />` is added and configured to submit to the `/api/v1/subscribe` endpoint with `listName: 'vets'`.
5. A successful submission adds the contact to the 'Vets' list in Brevo.
6. All form functionality (validation, error handling, etc.) is confirmed working.
* **Technical Note:** This story is a frontend task focused on composing existing components.

---
