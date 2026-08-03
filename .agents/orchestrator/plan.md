# Project Plan & Milestone Decomposition

## Project Overview
Project Root: `c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff`
Goal: Fix English/Spanish language toggle in header and extract all hardcoded strings into the TRANSLATIONS data structure.

## Milestones

| # | Milestone | Scope | Dependencies | Target Subagents | Status |
|---|-----------|-------|--------------|------------------|--------|
| M1 | Discovery & Audit | Identify component tree, state management, language toggle implementation, and hardcoded string inventory | None | Explorer | DONE |
| M2 | Fix Language Toggle (R1) | Ensure header toggle correctly updates global language state and re-renders components | M1 | Worker, Reviewer, Challenger | DONE |
| M3 | Global Translation Extraction (R2) | Extract hardcoded text from all components into TRANSLATIONS and wire dynamic references | M1, M2 | Worker, Reviewer, Challenger | DONE |
| M4 | Forensic Audit & Verification | Perform integrity verification, end-to-end testing, and complete translation coverage check | M2, M3 | Auditor, Reviewer, Challenger | DONE |

## Milestone Execution Details

### Milestone 1: Discovery & Audit
- Explorer analyze codebase:
  - Find state management mechanism for language (React Context, Redux, useState, custom hook, etc.)
  - Map `TRANSLATIONS` data structure file location and format
  - Map all components (Navbar, Header, Footer, views, modals, etc.) containing hardcoded English/Spanish strings
  - Identify build/test scripts (npm run test, npm run build, etc.)

### Milestone 2: Fix Language Toggle (R1)
- Worker implement state fix:
  - Fix language state updates in Header/Navbar toggle component
  - Ensure language context/provider wraps the application properly
  - Verify state persistence or reactivity across routes
- Reviewer & Challenger verify toggle behavior.

### Milestone 3: Global Translation Coverage (R2)
- Worker implement translation extraction:
  - Expand `TRANSLATIONS` dictionary with keys for English and Spanish for all identified hardcoded strings.
  - Update components to reference `TRANSLATIONS[lang].key` (or hook equivalent).
- Reviewer & Challenger verify all components render translated strings dynamically without broken markup or missing keys.

### Milestone 4: Verification & Forensic Audit
- Auditor verify integrity (no hardcoded test hacks, authentic translation logic).
- Reviewer verify zero remaining untranslated hardcoded user-facing strings.
