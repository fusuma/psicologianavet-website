# 7. External APIs

## Brevo API

* **Purpose:** To add new contacts to the "Tutors" and "Vets" email marketing lists.
* **Authentication:** API Key stored as a server-side environment variable: `BREVO_API_KEY`.
* **Configuration:** Specific list IDs must be stored as environment variables: `BREVO_TUTORS_LIST_ID` and `BREVO_VETS_LIST_ID`.
* **Error Handling:** The **Subscription Service** must map Brevo's "contact already exists" error to our custom `EmailExistsError`, which the Controller then maps to a **409 Conflict** response.
