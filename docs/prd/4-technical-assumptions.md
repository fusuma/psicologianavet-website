# 4. Technical Assumptions

### Repository Structure: Monorepo

* A **Monorepo** is the most straightforward approach. The frontend pages and the backend serverless functions will coexist within the same Next.js project.
* **Implementation Note:** A `packages/shared` directory can be used to hold shared TypeScript types.

### Service Architecture: Serverless

* The architecture will be **Serverless**. The backend logic for the form submission will be a single serverless function.
* **Implementation Note:** The function signature in a Next.js API route will be strongly typed.

### Testing Requirements: Unit + Integration

* A baseline of Unit and Integration tests is required.
* **Implementation Note:** The recommended stack is **Jest** and **React Testing Library**.
* **Scope:** Backend unit tests for the serverless function and frontend integration tests for the sign-up form component.

### Core Technology Stack

* **Framework:** **Next.js (App Router)**.
* **Deployment & Hosting:** **Vercel is the primary recommendation**.
* **Styling:** **Tailwind CSS is the recommended approach**.
* **Email API:** Brevo.
* **Form Management:** **React Hook Form is recommended**.
* **UI Component Library:** **Shadcn/UI (Built on Radix UI)**.

---
