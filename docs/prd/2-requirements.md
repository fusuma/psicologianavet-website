# 2. Requirements

## Functional Requirements

1.  **FR1**: The website will initially consist of three distinct pages: Home, "Tutors", and a "**Vets**" page.
2.  **FR2**: The "Tutors" and "**Vets**" pages will each feature a sign-up form that:
* Collects one field: the user's email address.
* Performs client-side validation to ensure the input is a valid email format.
* Includes a simple 'honeypot' field for bot protection.
* Upon successful submission, displays a confirmation message (e.g., "Thank you for subscribing!").
* In case of a submission error, displays a user-friendly generic error message (e.g., "Something went wrong. Please try again.").
* All user feedback (success/error messages) will be displayed on the same page without a full page reload.
3.  **FR3**: A submission on the "Tutors" form must add the contact to the "Tutors" list in the Brevo account.
4.  **FR4**: A submission on the "**Vets**" form must add the contact to the "**Vets**" list in the Brevo account.
5.  **FR5**: The website must integrate with Google Analytics for traffic monitoring on all pages.

## Non-Functional Requirements

1.  **NFR1**: All services for hosting, deployment, and email marketing must operate within their respective free tiers. Usage against free-tier limits should be monitored.
2.  **NFR2**: The website must be fully responsive, adhering to a mobile-first design philosophy.
3.  **NFR3**: The architecture must be a static site (SSG/Jamstack) to ensure high performance and security.
4.  **NFR4**: API credentials (e.g., for Brevo) must be secured in a serverless function and MUST NOT be exposed in the frontend code.
5.  **NFR5**: The deployment process must be automated via a Git-based workflow.

---
