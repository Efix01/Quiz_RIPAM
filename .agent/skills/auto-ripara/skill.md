---
name: auto_ripara
description: "Skill critica per la correzione automatica di errori e la gestione di codice sensibile."
---

# Auto-Ripara (Self-Repair)

This skill is a critical intervention tool designed to autonomously detect, analyze, and repair errors in the codebase. It is also activated when handling sensitive code, such as ministerial quizzes, to ensure absolute integrity.

## Instructions

When this skill is active, you MUST follow this strict protocol:

1.  **Root Cause Analysis (RCA)**:
    -   **Stop**: Do NOT attempt a fix immediately.
    -   **Analyze**: Investigate the error logs, stack traces, and relevant code.
    -   **Diagnose**: Identify the *exact* cause of the failure. NO GUESSING allowed.
    -   **Explain**: articulating the root cause in **Italian** before proceeding.

2.  **Testing Protocol**:
    -   **Create Test**: Before applying the fix, write a small, isolated script (e.g., a unit test or a reproduction script) to confirm the bug.
    -   **Verify Fix**: Run the test again after applying the fix to ensure it passes.

3.  **Integrity Checks (Quiz/Exams)**:
    -   **Immutable Content**: When modifying code related to quizzes (especially ministerial ones), NEVER alter the text of the questions or answers.
    -   **Verification**: Ensure that data loading and display logic preserve the original content exactly as provided.

4.  **Communication**:
    -   **Language**: **ITALIAN** only.
    -   **Output**:
        -   Explain the error clearly.
        -   Describe the fix.
        -   Confirm definitively: "La soluzione è blindata." (The solution is ironclad).

### Workflow

1.  **Detection & Analysis**:
    -   User reports an error OR Agent detects a failure/sensitive task.
    -   Perform RCA.
    -   *Output*: "Ho analizzato l'errore. La causa radice è..."

2.  **Test & Reproduce**:
    -   Create a reproduction script.
    -   *Internal Action*: Run the script to confirm failure.

3.  **Repair**:
    -   Apply the fix to the codebase.
    -   *Internal Action*: Run the reproduction script again to confirm success.

4.  **Final Report**:
    -   Explain the intervention.
    -   Confirm integrity (if applicable).
    -   *Output*: "Errore corretto. Ho verificato la fix con un test dedicato. La soluzione è blindata."

### Constraints

-   **Output Language**: Italian.
-   **Methodology**: Scientific method (Observe -> Hypothesize -> Test -> Fix).
-   **Quiz Integrity**: 100% preservation of text content.

### Examples

**Scenario**: A quiz question is not displaying.

**Agent Response**:
"Ho analizzato il problema.
**Causa**: Il parser JSON fallisce perché alcune chiavi contengono caratteri non escapati.
**Test**: Ho creato uno script che prova a parsare il file JSON problematico.
**Fix**: Ho corretto la funzione di parsing per gestire correttamente i caratteri speciali.
**Verifica**: Il test ora passa e le domande vengono caricate correttamente senza alterare il testo.
La soluzione è blindata."
