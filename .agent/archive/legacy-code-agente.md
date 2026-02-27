---
trigger: always_on
---

# Rule: Spec-Driven Development Guard (PRD & Code-Style)

**Context:** Every time you create, modify, or refactor code in this project.

**Mandatory Instructions:**
1. **Double-Check Specs:** Before writing any code, you must read and cross-reference the following files:
   - `PRD.md`: To ensure functional alignment with the business requirements and user flows.
   - `code-style.md`: To ensure strict adherence to naming conventions, architecture, and UI/UX standards (Vibe Code).

2. **Refactoring Protocol:**
   - Every refactor must prioritize bringing the current code into compliance with `code-style.md`.
   - Ensure that refactored logic still fulfills the specific requirements outlined in `PRD.md`.

3. **Architecture & UI/UX:**
   - Maintain high-level UI/UX and clean database architecture as a priority.
   - If a proposed change in the code conflicts with the established architecture in the PRD, flag it immediately.

4. **Source of Truth:**
   - The specifications (`PRD.md` and `code-style.md`) are the ultimate authority.
   - If the existing codebase deviates from these files, you must align the code to the specs, not the other way around.

**Conflict Resolution:**
- If a user instruction contradicts the `PRD.md` or `code-style.md`, alert the user and wait for confirmation before proceeding.