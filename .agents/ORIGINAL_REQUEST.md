# Original User Request

## 2026-08-01T01:57:00Z

Fix the English/Spanish language toggle in the header so that it works correctly, and extract any remaining hardcoded text across all components into the translation dictionary so the language updates seamlessly across the entire application.

Working directory: c:/Users/mkmcm/AA Miyako/DevEC/Trabajos Kindev/Gustaff/demogustaff
Integrity mode: demo

## Requirements

### R1. Fix Language Toggle
Ensure the language toggle (English/Spanish) in the header correctly updates the application's global language state.

### R2. Global Translation Coverage
Extract any hardcoded text from the React components (e.g., views, Navbar, Footer, etc.) and add it to the existing `TRANSLATIONS` data structure. Ensure all components use this dictionary to display text.

## Acceptance Criteria

### Verification
- [ ] Clicking the English/Spanish toggle in the header correctly changes the active language state.
- [ ] A programmatic search (e.g., `grep` or AST parsing) confirms that main user-facing text strings in components are replaced by dynamic references to the `TRANSLATIONS` object.
- [ ] Running the dev server and manually checking the UI confirms that the language preference is applied globally to all routes and components, with no untranslated hardcoded text remaining in the main user flows.
