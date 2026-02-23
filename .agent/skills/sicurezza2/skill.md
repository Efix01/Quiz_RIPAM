---
name: sicurezza2
description: "Skill per lo sviluppo di applicazioni moderne, sicure e basate su Clean Code."
---

# Sicurezza 2

This skill is designed to enforce high standards of security, modern technology usage, and code quality in software development tasks. It acts as a guardian of best practices, ensuring that all generated code is robust, secure, and maintainable.

## Instructions

When this skill is active or relevant, you MUST adhere to the following directives:

1.  **Technology Stack Enforcement**:
    -   **Frontend**: Use **React** or **Next.js** as the primary frameworks.
    -   **Backend**: Use **Node.js** or **Python**.
    -   **Constraint**: clearly justify any deviation from this stack.

2.  **Security Mandates**:
    -   **Input Validation**: You MUST validate all external inputs. Use libraries like **Zod** for schema validation.
    -   **Injection Prevention**: preventing SQL Injection is mandatory. Use parameterized queries or ORMs (e.g., Prisma, TypeORM, SQLAlchemy).
    -   **XSS Prevention**: Ensure all user-generated content is properly sanitized before rendering.
    -   **Credentials**: NEVER hardcode API keys, passwords, or secrets. Use environment variables (e.g., `.env`).

3.  **Code Quality (Clean Code)**:
    -   **SOLID**: Apply SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
    -   **DRY**: Don't Repeat Yourself. Refactor repetitive logic into reusable functions or components.
    -   **Readability**: Write self-documenting code with clear variable/function names.

4.  **Communication**:
    -   **Language**: You MUST explain all architectural choices, security measures, and design patterns in **ITALIAN**.

### Workflow

1.  **Analysis**:
    -   Analyze the user's request for potential security risks or architectural needs.
    -   Select the appropriate modern stack components.

2.  **Implementation/Refactoring**:
    -   Generate code that strictly follows the **Security Mandates**.
    -   Implement **Input Validation** (e.g., Zod schemas) for every data entry point.
    -   Structure the code according to **SOLID** principles.

3.  **Explanation**:
    -   Explain the implemented solution in **Italian**.
    -   Highlights:
        -   "Ho scelto [Tecnologia] perché..."
        -   "Per la sicurezza, ho implementato..."
        -   "Il codice rispetta il principio [SOLID Principle] in questo modo..."

### Constraints

-   **Output Language**: Italian (for explanations).
-   **Security**: Zero tolerance for hardcoded secrets or unvalidated inputs.
-   **Code Style**: Modern, functional, and strongly typed (if using TypeScript).

### Examples

**User Request**: "Crea un form di login."

**Response (Internal Logic)**:
-   Select React + React Hook Form + Zod.
-   Create a Zod schema for email/password.
-   Implement the form component.

**Response (Output to User)**:
"Ho creato il form di login utilizzando React Hook Form e Zod per la validazione.
Ecco le scelte architetturali:
1.  **Validazione**: Ho definito uno schema Zod per garantire che l'email sia valida e la password rispetti i criteri minimi.
2.  **Sicurezza**: I dati vengono validati prima dell'invio per prevenire input dannosi.
..."
