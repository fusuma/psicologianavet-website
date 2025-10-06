Of course. Here is the complete and final Product Requirements Document for your records.

-----

# Quando um amor se vai Product Requirements Document (PRD)

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-10-06 | 1.0 | Initial draft of PRD based on Project Brief v3. | John (PM) |

## 1\. Goals and Background Context

### Goals

  * **Provide distinct, supportive content pathways for both pet owners (Tutors) and Veterinarians.**
      * *Why this matters: This ensures that a grieving pet owner isn't overwhelmed with clinical information meant for a vet, and a vet can quickly find the professional resources they need. It's about creating a compassionate, tailored experience for everyone.*
  * **Grow an engaged audience by capturing email sign-ups for each distinct user group.**
      * *Why this matters: Building an email list allows us to create a community around the project. We can share new articles, offer support, and build a long-term relationship with our audience, turning a one-time visit into ongoing engagement.*
  * **Establish a professional and trustworthy online presence for the "Quando um amor se vai" project.**
      * *Why this matters: Trust is everything, especially on a sensitive topic. A professional site signals that the information is credible and the project is serious, which is vital for gaining the confidence of both pet owners and veterinary professionals.*

### Guiding Principles / Constraints

  * **Cost-Effectiveness:** The solution will be built using modern, reliable tools that have no monthly costs at our project's scale.
      * *In simple terms: We can run a professional website without a budget for hosting fees. This makes the project financially sustainable indefinitely.*
  * **Mobile-First Experience:** The website will be designed for phones first.
      * *In simple terms: We're ensuring the experience is excellent for the majority of users who will find us on their mobile devices.*
  * **Simplicity & Maintainability:** The website will be easy to manage and won't require a dedicated technical person to keep it running.
      * *In simple terms: The site will essentially run itself. Updating content in the future will be straightforward and won't require specialized technical skills.*

### Background Context

The "Quando um amor se vai" project aims to provide a supportive online resource for pet owners (Tutors) and Veterinarians dealing with pet loss. The primary challenge is to present information that respects the different needs of these two audiences. This requires a solution that offers clear content segregation and distinct user journeys while maintaining a cohesive and professional brand.

-----

## 2\. Requirements

### Functional Requirements

1.  **FR1**: The website will initially consist of three distinct pages: Home, "Tutors", and a "**Vets**" page.
2.  **FR2**: The "Tutors" and "**Vets**" pages will each feature a sign-up form that:
      * Collects one field: the user's email address.
      * Performs client-side validation to ensure the input is a valid email format.
      * Includes a simple 'honeypot' field for bot protection.
      * Upon successful submission, displays a confirmation message (e.g., "Thank you for subscribing\!").
      * In case of a submission error, displays a user-friendly generic error message (e.g., "Something went wrong. Please try again.").
      * All user feedback (success/error messages) will be displayed on the same page without a full page reload.
3.  **FR3**: A submission on the "Tutors" form must add the contact to the "Tutors" list in the Brevo account.
4.  **FR4**: A submission on the "**Vets**" form must add the contact to the "**Vets**" list in the Brevo account.
5.  **FR5**: The website must integrate with Google Analytics for traffic monitoring on all pages.

### Non-Functional Requirements

1.  **NFR1**: All services for hosting, deployment, and email marketing must operate within their respective free tiers. Usage against free-tier limits should be monitored.
2.  **NFR2**: The website must be fully responsive, adhering to a mobile-first design philosophy.
3.  **NFR3**: The architecture must be a static site (SSG/Jamstack) to ensure high performance and security.
4.  **NFR4**: API credentials (e.g., for Brevo) must be secured in a serverless function and MUST NOT be exposed in the frontend code.
5.  **NFR5**: The deployment process must be automated via a Git-based workflow.

-----

## 3\. User Interface Design Goals

#### Overall UX Vision

The overall UX vision is to create a clean, minimalist, and compassionate digital space. The design should feel professional and trustworthy, guiding users gently to the information they need without overwhelming them. The user journey must prioritize immediate audience segmentation to reduce confusion and deliver relevant content as quickly as possible.

#### Key Interaction Paradigms

The Home Page will act as a portal, with the primary interaction being the user's self-selection into one of two paths: 'Tutors' or '**Vets**'. Each choice will be accompanied by a brief, clarifying subline (e.g., for Tutors: 'For pet owners and families'). Once a user chooses their path, they will be taken to a dedicated landing page for that audience. For the MVP, these landing pages will not have further sub-navigation. However, the page layout should be designed to easily accommodate a navigation bar for future expansion (e.g., adding a blog or resources page).

#### Core Screens and Views

1.  Home Page (acting as a portal to the two main sections)
2.  Tutors Page (with sign-up form)
3.  **Vets** Page (with sign-up form)

#### Accessibility

The goal will be to meet **WCAG 2.1 Level AA** compliance.

#### Branding

  * **Typography:**
      * **Headings: Castoro (rendered in small caps)**
      * **Body Text: Fira Sans**
  * **Color Palette:**
      * **Primary Dark: \#191723**
      * **Primary Green: \#269A9B**
      * **Neutral: \#fff (White)**
  * **Color Application:**
      * **Tutors Section: Dark background (\#191723) with Green text (\#269A9B).**
      * **Vets Section: Green background (\#269A9B) with Dark text (\#191723).**
  * **Logo: To be provided later. A placeholder will be used in the initial design.**

#### Target Device and Platforms

**Web Responsive**. The site must function correctly on all modern web browsers on desktop, tablet, and mobile devices.

-----

## 4\. Technical Assumptions

#### Repository Structure: Monorepo

  * A **Monorepo** is the most straightforward approach. The frontend pages and the backend serverless functions will coexist within the same Next.js project.
  * **Implementation Note:** A `packages/shared` directory can be used to hold shared TypeScript types.

#### Service Architecture: Serverless

  * The architecture will be **Serverless**. The backend logic for the form submission will be a single serverless function.
  * **Implementation Note:** The function signature in a Next.js API route will be strongly typed, e.g.:
    ```typescript
    // pages/api/subscribe.ts
    import type { NextApiRequest, NextApiResponse } from 'next';

    export default async function handler(
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      // Logic to handle form submission...
    }
    ```

#### Testing Requirements: Unit + Integration

  * A baseline of Unit and Integration tests is required.
  * **Implementation Note:** The recommended stack is **Jest** and **React Testing Library**.
  * **Scope:** Backend unit tests for the serverless function and frontend integration tests for the sign-up form component.

#### Core Technology Stack

  * **Framework:** Next.js (a React framework).
  * **Deployment & Hosting:** **Vercel is the primary recommendation**.
  * **Styling:** **Tailwind CSS is the recommended approach**.
  * **Email API:** Brevo.
  * **Form Management: React Hook Form is recommended**.

-----

## 5\. Epic List

**Epic 1: MVP Foundation & Tutor Lead Capture**

  * *Goal: Launch the core website infrastructure and the complete, branded 'Tutors' page with a functioning lead capture form.*

**Epic 2: Vet Audience Expansion**

  * *Goal: Build upon the existing platform to launch the 'Vets' page, including its unique branding and lead capture form, completing the full MVP vision.*

-----

## 6\. Epic & Story Breakdown

### Epic 1 Stories

**Story 1.1: Project Initialization & Hosting Setup**

  * *As a Project Owner, I want the project initialized and connected to a Vercel account...*
  * **Implementation Note:** Use `npx create-next-app@latest` with TypeScript and Tailwind CSS flags.

**Story 1.2: Create Themeable Shared Layout**

  * *As a Developer, I want a shared layout component that supports theming...*
  * **Implementation Note:** Use CSS variables to handle the 'dark' and 'green' themes.

**Story 1.3: Build the Homepage Portal**

  * *As a first-time Visitor, I want a clear homepage that helps me self-identify...*
  * **Implementation Note:** Use Next.js's `<Link>` component for client-side navigation.

**Story 1.4: Build Static Tutor Page**

  * *As a Tutor, I want a dedicated landing page...*
  * **Acceptance Criteria:**
    1.  The `/tutors` page is created.
    2.  The page uses the shared layout with the 'dark' theme applied.
    3.  It contains simple, contextual placeholder text that follows a consistent structure (e.g., Headline, Intro Paragraph).

**Story 1.5: Implement End-to-End Sign-up Feature**

  * *As a Tutor, I want to sign up on the Tutor page and receive confirmation...*
  * **Acceptance Criteria:**
    1.  A reusable, themeable `<SignupForm />` is created and added to the `/tutors` page.
    2.  A serverless function at `/api/subscribe` is created to securely process submissions.
    3.  The form performs client-side validation and has a honeypot field.
    4.  On submission, the form adds the contact to the 'tutors' list in Brevo.
    5.  The form displays loading, success, and generic error messages.
  * **Implementation Notes:**
      * **Frontend:** Use `React Hook Form` for validation.
      * **Backend:** Validate the request body (e.g., using Zod).
      * **API:** Retrieve `BREVO_API_KEY` from `process.env`.

**Story 1.6: Integrate Google Analytics**

  * *As a Project Owner, I want website traffic to be tracked...*
  * **Implementation Note:** Create a dedicated `<Analytics />` component included in the root layout.

### Epic 2 Story

**Story 2.1: Launch the Vet Section**

  * **As a** Vet, **I want** a dedicated, green-themed landing page with a functioning sign-up form...
  * **Acceptance Criteria:**
    1.  The `/vets` page is created.
    2.  The page uses the shared `<Layout />` component, passing it the `theme='green'` prop.
    3.  It contains simple, contextual placeholder text for Vets, following the established content structure.
    4.  The reusable `<SignupForm />` is added and configured to submit to the `/api/subscribe` endpoint with `listName: 'vets'`.
    5.  A successful submission adds the contact to the 'Vets' list in Brevo.
    6.  All form functionality (validation, error handling, etc.) is confirmed working.
  * **Technical Note:** This story is a frontend task focused on composing existing components.

-----

## 7\. Final Review

  * **Overall Readiness:** High
  * **Critical Deficiencies:** None identified.
  * **Final Decision:** **READY FOR ARCHITECT**

-----

## 8\. Next Steps

#### Architect Prompt

"The Product Requirements Document (PRD) for the 'Quando um amor se vai' project is complete. Please review it to create the fullstack architecture document. Pay close attention to the 'Technical Assumptions' and the detailed story breakdown, as they contain the key constraints for the technical design."

-----

What would you like to do now?

1.  Proceed to the next step and switch to our 🏗️ Architect (`*agent architect`).
2.  Exit this process (`*exit`).